import { TimeSerie } from './timeserie'
import { AggregationConfiguration, DateLike, FromTimeseriesOptions, Index, Metadata, Point, ReindexOptions, Row, TelemetryV1Output, TimeFrameInternal, PartitionOptions, TimeFrameResampleOptions, TimeframeRowsIterator, TimeInterval, TimeserieIterator, TimeFrameReduceOptions, ProjectionOptions, PipelineStage, PipelineStageType } from './types'
const test = (r, f, t, includeSuperior, includeInferior) => {
  if (includeInferior && includeSuperior) {
    return r >= f && r <= t
  } else if (includeInferior && !includeSuperior) {
    return r >= f && r < t
  } else if (!includeInferior && includeSuperior) {
    return r > f && r <= t
  } else {
    return r > f && r < t
  }
}

const makeTree = require('functional-red-black-tree')

interface TimeFrameOptions {
  data: Row[];
  metadata?: Metadata;
}
/**
 * @class TimeFrame
 * A data structure for time indexed data.
 */
export class TimeFrame {
  private readonly data: TimeFrameInternal = {}
  columnNames: string[] = []
  metadata: Metadata = {}
  private _indexes: any
  private _columns: any = {}

  /**
   * Creates a Timeframe instance from a list of rows. It infers the list of column names from each row's fields.
   * So for example, a single row like `{time: Date.now(), temperature:20, humidity: 40}` would create two columns
   * @param data Array of rows
   */
  constructor(options: TimeFrameOptions) {
    const { data, metadata = {} } = options
    // get a list of unique column names excluding the time key
    this.metadata = metadata

    if (data.length === 0) {
      this.data = {}
      this.columnNames = []
    } else {
      this.columnNames = [...new Set(data
        .filter((row: any) => !!row)
        .map((row: Row) => Object.keys(row))
        .flat())]
        .filter((name: string) => name !== 'time')
      this.data = data
        .concat([])
        .filter((row: any) => !!row)
        .sort((a, b) => {
          const ta = new Date(a.time).getTime()
          const tb = new Date(b.time).getTime()
          if (ta >= tb) { return 1 } else { return -1 }
        })
        .reduce((acc: TimeFrameInternal, row: Row) => {
          const { time, ...rest } = row
          acc[row.time] ? acc[row.time] = { ...acc[row.time], ...rest } : acc[row.time] = rest
          return acc
        }, {})
    }

    this._indexes = {
      time: Object.keys(this.data).sort(),
      checkpoints: null,
      tree: null
    }
  }

  private buildTimeTree() {
    if (!this._indexes.tree) {
      let tree = makeTree(function (a: number, b: number) { return a - b })
      this._indexes.time.forEach((time: string) => {
        const t = new Date(time).getTime()
        tree = tree.insert(t, t)
      })
      this._indexes.tree = tree
    }
  }

  /**
 * Creates a new timeframe preserving the metadata but replacing data
 * @param data The new data to recreate the serie from
 * @returns
 */
  recreate(data: Row[]): TimeFrame {
    return new TimeFrame({ data, metadata: this.metadata })
  }

  /**
   * Creates a new TimeFrame using this timeframe's metadata and using `series` as columns.
   * @param series Array of timeseries which will be used as timeframe columns
   * @returns
   */
  recreateFromSeries(series: TimeSerie[]) {
    const tf = TimeFrame.fromTimeseries(series)
    tf.metadata = this.metadata
    return tf
  }

  /**
   * Recreates the serie's index
   * @param index The new index to use. Can be created with createIndex()
   * @see createIndex
   * @param options
   * @return The reindexed timeserie
   */
  reindex(index: Index, options?: ReindexOptions): TimeFrame {
    return this.recreate(index.map((i: string) => this.atTime(i) || options.fill || { time: i }))
  }

  /**
   * Creates a TimeFrame from a Telemetry Output Object (Apio private method)
   * @param data An object which is telemetry V1 output (Apio Internal)
   */
  static fromTelemetryV1Output(data: TelemetryV1Output = {}, metadata: Metadata = {}): TimeFrame {
    const _data: TimeFrameInternal = {}
    for (const deviceId in data) {
      for (const propertyName in data[deviceId]) {
        for (const [time, value] of data[deviceId][propertyName]) {
          if (!_data[time]) {
            _data[time] = {}
          }
          const column = `${deviceId}:${propertyName}`
          metadata[column] = {
            deviceId,
            propertyName
          }
          _data[time][column] = value
        }
      }
    }
    const rows = Object.keys(_data).map((time: string) => {
      return { time, ..._data[time] }
    })
    return new TimeFrame({ data: rows, metadata })
  }

  private static fromInternalFormat(data: TimeFrameInternal, metadata?: Metadata): TimeFrame {
    const _data: Row[] = Object.keys(data).map((time: string) => {
      return { time, ...data[time] }
    })
    return new TimeFrame({ data: _data, metadata })
  }

  /**
   * Returns a new TimeFrame, where each input timeserie is used as column
   * @param timeseries An array of TimeSerie objects
   * @param options.fill Value to use as filler when a column does not hold a value for a specific time
   */
  static fromTimeseries(timeseries: TimeSerie[], options?: FromTimeseriesOptions): TimeFrame {
    const data: TimeFrameInternal = {}
    const metadata: Metadata = {}
    timeseries.forEach(ts => {
      metadata[ts.name] = ts.metadata
      ts.toArray().forEach((point: Point) => {
        data[point[0]] = data[point[0]] || {}
        data[point[0]][ts.name] = point[1] || options?.fill || null
      })
    })
    return TimeFrame.fromInternalFormat(data, metadata)
  }

  /**
   * Concatenates timeframes. Throws error if overlapping times are found. Use join() to join together
   * timeframes with overlapping times
   * @param timeframes Array of timeframes to concatenate
   */
  static concat(timeframes: TimeFrame[]): TimeFrame {
    return new TimeFrame({
      metadata: Object.assign({}, ...timeframes.map(tf => tf.metadata)),
      data: timeframes.map((tf: TimeFrame) => tf.rows()).flat()
    })
  }

  /**
   * Joins multiple timeframes by adding the columns together and merging indexes (time)
   * @param timeframes Array of timeframes to join together
   * @returns A timeframe with joined columns
   */
  join(timeframes: TimeFrame[]): TimeFrame {
    return TimeFrame.fromInternalFormat(Object.assign({}, ...(timeframes.map(tf => tf.data).concat([this.data]))))
  }

  /**
   * Add a column to the timeframe
   * @param serie The new column
   * @returns {TimeFrame}
   */
  addColumn(serie: TimeSerie): TimeFrame {
    return this.recreateFromSeries(this.columns().concat([serie]))
  }

  /**
   * Returns the column as timeseries
   * @param name The name of the wanted column
   */
  column(name: string): TimeSerie {
    if (!this.columnNames.includes(name)) {
      return null
    }


    // we cache the column to make subsequent reads faster
    if (!this._columns[name]) {
      const data: Point[] = Object.entries(this.data).map(([time, values]) => ([time, values[name]]))
      const metadata = this.metadata[name] || {}
      this._columns[name] = new TimeSerie(name, data, metadata)
    }
    return this._columns[name]
  }

  /**
   * Returns every column as array of timeseries
   */
  columns(): TimeSerie[] {
    return this.columnNames.map((column: string) => this.column(column))
  }

  /**
   * Returns all the rows in an array
   */
  rows(): Row[] {
    return Object.entries(this.data).map(([time, values]) => ({ time, ...values }))
  }

  /**
   * Returns the time index array
   */
  indexes(): DateLike[] {
    return this._indexes.time
  }

  /**
   * Returns a new timeframe with a subset of columns.
   */
  project(config: ProjectionOptions): TimeFrame {
    const nonExisting = config.columns.filter((name: string) => !this.columnNames.includes(name))
    if (nonExisting.length > 0) { throw new Error(`Non existing columns ${nonExisting.join(',')}`) }
    const tf = TimeFrame.fromTimeseries(config.columns.map((columnName: string) => this.column(columnName)))
    tf.metadata = this.metadata
    return tf
  }

  /**
   * Returns a row at a given time or null
   * @param time
   */
  atTime(time: string): Row | null {
    return { time, ...this.data[time] } || null
  }

  /**
   * Get the row at the given index (position, not time)
   */
  atIndex(index: number): Row {
    if (index >= this.rows().length) {
      throw new Error('Index out of bounds')
    }
    return this.rows()[index]
  }

  /**
   * Returns the number of rows
   */
  length(): number {
    return this._indexes.time.length
  }

  /**
   * Returns the shape of the timeframe expressed as [rows,  columns] where columns excludes the time column
   */
  shape(): number[] {
    return [this._indexes.time.length, this.columnNames.length]
  }

  /**
 *
 * Returns the first row
 */
  first(): Row {
    if (this.length() === 0) { return null }
    return this.rows()?.[0] || null
  }

  /**
  *
  * Returns the last row
  */
  last(): Row {
    if (this.length() === 0) { return null }
    const t = this.rows()
    return t?.[t.length - 1] || null
  }

  /**
   * Reduces the TimeFrame to a single Row representing the sum of values in each column. The time is the FIRST index.
   */
  sum(): Row {
    if (this.length() === 0) { return null }
    const time = this.first().time
    return this.columns().reduce((acc, column) => { acc[column.name] = column.sum()[1]; return acc }, { time })
  }

  /**
   * Reduces the TimeFrame to a single Row representing the average of values in each column. The time is the FIRST index.
   */
  avg(): Row {
    if (this.length() === 0) { return null }
    const time = this.first().time
    return this.columns().reduce((acc, column) => { acc[column.name] = column.avg()[1]; return acc }, { time })
  }

  /**
   * Reduces the TimeFrame to a single Row representing the delta of values in each column. The time is the FIRST index.
   */
  delta(): Row {
    if (this.length() === 0) { return null }
    const time = this.first().time
    return this.columns().reduce((acc, column) => { acc[column.name] = column.delta()[1]; return acc }, { time })
  }

  /**
   * Reduces the TimeFrame to a single Row representing the maximum of values in each column. The time is the FIRST index.
   */
  max(): Row {
    if (this.length() === 0) { return null }
    const time = this.first().time
    return this.columns().reduce((acc, column) => { acc[column.name] = column.max()[1]; return acc }, { time })
  }

  /**
   * Reduces the TimeFrame to a single Row representing the minimum of values in each column. The time is the FIRST index.
   */
  min(): Row {
    if (this.length() === 0) { return null }
    const time = this.first().time
    return this.columns().reduce((acc, column) => { acc[column.name] = column.min()[1]; return acc }, { time })
  }

  /**
   * Add a value to every element in the timeframe
   */
  add(value: number): TimeFrame {
    return this.recreateFromSeries(
      this.columns().map((c: TimeSerie) => c.add(value))
    )
  }

  /**
   * Multiply every element in the timeframe by a number
   */
  mul(value: number): TimeFrame {
    return this.recreateFromSeries(
      this.columns().map((c: TimeSerie) => c.mul(value))
    )
  }

  /**
 * Returns the subset of points between the two dates. Extremes are included.
 * @param from start date string in ISO8601 format
 * @param to end date string in ISO8601 format
 */
  betweenTime(from: DateLike, to: DateLike, options = { includeInferior: true, includeSuperior: true }): TimeFrame {
    /**
     * Here we might have to scan a huge sorted array. To prevent scanning too many useless keys. To get better performances we index timestamps with a RBtree in the buildTimeTree funciton
     */
    this.buildTimeTree()
    const { includeInferior, includeSuperior } = options
    const f = new Date(from).getTime()
    const t = new Date(to).getTime()

    const goodRows = []
    const iter = this._indexes.tree.ge(f)
    while (iter && new Date(iter.key).getTime() <= t) {
      if (test(iter.key, f, t, includeSuperior, includeInferior)) {
        goodRows.push({ time: new Date(iter.key).toISOString(), ...this.data[new Date(iter.key).toISOString()] })
      }
      iter.next()
    }


    return this.recreate(goodRows)
  }

  /**
   * Applies transformations to TimeFrame. Each transformation is defined as an operation between columns. Allows, for example, to
   * aggregate two columns into one by applying scalar operations element-wise.
   * @param aggregation An array of AggregationConfigurations
   * @param options? Options
   * @returns {TimeFrame}
   * @example
   * // Creates a 3 new cilumns named power1,power2 and power3 by  multiplying other columns
   * // Then combines the 3 powerN by addition
   * // The resulting TimeFrame has only 1 column named power
   * tf = tf.aggregate({ output: 'power1', columns: ['voltage1', 'current1'], operation: 'mul' })
    * .aggregate({ output: 'power', columns: ['power1', 'power2', 'power3'], operation: 'add'})
   */
  aggregate(agg: AggregationConfiguration): TimeFrame {
    const columnsToAggregate: TimeSerie[] = agg.columns
      .filter((colName: string) => this.columnNames.includes(colName))
      .map((colName: string) => this.column(colName))

    let newColumn: TimeSerie
    if (typeof agg.operation === 'function') {
      newColumn = TimeSerie.internals.combine(columnsToAggregate, agg.operation, { name: agg.output })
    } else if (typeof agg.operation === 'string' && agg.operation in TimeSerie.internals.combiners) {
      newColumn = TimeSerie.internals.combine(columnsToAggregate, TimeSerie.internals.combiners[agg.operation], { name: agg.output })
    } else {
      throw new Error('Wrong type for aggregation operation')
    }

    return this.recreateFromSeries([newColumn].concat(this.columns()))
  }

  /**
   * Reduces the timeframe to a new timeframe of a single row, where each
   * column is populated with the value of the aggregation function passed as
   * TimeFrameReduceOptions.defaultOperation or TimeFrameReduceOptions.operations[columnName]
   *
   * If only operation is provided and it doesn't cover every column, the missing columns will be omitted
   * in the result timeframe.
   */
  reduce(options: TimeFrameReduceOptions): TimeFrame {
    return this.recreateFromSeries(this.columns().map((column: TimeSerie) => {
      if (options.operations && column.name in options.operations) {
        return column.recreate([column[options.operations[column.name]]()])
      } else {
        return column.recreate([column[options.operation]()])
      }
    }))
  }

  /**
   * Resamples the timeframe by the specified time interval. Each row
   * of the result TimeFrame will be the result of the selected aggregation.
   * @param options
   */
  resample(options: TimeFrameResampleOptions): TimeFrame {
    const from = options.from || this.first()?.time
    if (!from) {
      throw new Error('Cannot infer a lower bound for resample')
    }
    const to = options.to || this.last()?.time
    if (!to) {
      throw new Error('Cannot infer an upper bound for resample')
    }
    return TimeFrame.concat(this.partition(options)
      .map((chunk: TimeFrame) => chunk.reduce(options))
    )
  }

  /**
   * Returns a new timeframe where each row satisfies the iterator function
   * @param fn Iterator function
   * @returns {TimeFrame}
   */
  filter(fn: TimeframeRowsIterator): TimeFrame {
    return new TimeFrame({ data: this.rows().filter(fn), metadata: this.metadata })
  }

  /**
 * Returns a new timeframe where each **row** is mapped by the iterator function. For mapping over columns, use apply()
 * @param fn Iterator function
 * @returns {TimeFrame}
 */
  map(fn: TimeframeRowsIterator): TimeFrame {
    return new TimeFrame({ data: this.rows().map(fn), metadata: this.metadata })
  }

  /**
   * Applies transformations to the **columns** of the dataframe, each column is passed to the iterator like a timeserie.
   * If no column is specified, all columns will be used.
   * For mapping over rows, see map()
   * @param fn {TimeserieIterator}
   */
  apply(fn: TimeserieIterator, columns: string[] = this.columnNames): TimeFrame {
    const unmodifiedColumns = this.columnNames.filter((columnName: string) => !columns.includes(columnName)).map((columnName: string) => this.column(columnName))
    const series: TimeSerie[] = columns
      .map((columnName: string) => (this.column(columnName)))
      .map(fn)

    return TimeFrame.fromTimeseries(unmodifiedColumns.concat(series))
  }

  /**
   * Partitions The TimeFrame into multiple sub timeframes by dividing the time column into even groups. Returns an array of sub TimeFrames.
   * @param options
   */
  partition(options: PartitionOptions): TimeFrame[] {
    const from = options.from || this.first()?.time
    if (!from) {
      throw new Error('Cannot infer a lower bound for resample')
    }
    const to = options.to || this.last()?.time
    if (!to) {
      throw new Error('Cannot infer an upper bound for resample')
    }

    const intervals = TimeInterval.generate(from, to, options.interval)
    const partitions = intervals.map((interval: TimeInterval) => {
      return this.betweenTime(interval.from, interval.to, { includeInferior: true, includeSuperior: false })
    })
    return partitions.map((p: TimeFrame, idx: number) => {
      if (p.length() === 0) {
        return p.recreate([{ time: intervals[idx].from.toISOString() }])
      } else if (p.first().time !== intervals[idx].from.toISOString()) {
        return p.recreate([{ time: intervals[idx].from.toISOString() }].concat(p.rows()))
      } else {
        return p
      }
    })
  }

  /**
   * Runs a series of transformations defined as an object. Useful in automation.
   * A stage is an object with a single key and a value, the key is the name of the method, the value is the params object
   * @param stages
   */
  pipeline(stages: PipelineStage[]) {
    return stages.reduce((tf: TimeFrame, stage: PipelineStage) => {
      const fn: PipelineStageType = Object.keys(stage)[0] as PipelineStageType
      return tf[fn](stage[fn] as any)
    }, this)
  }

  /**
   * Pretty prints the TimeFrame to the console
   */
  print() {
    console.table(this.rows())
  }
}
