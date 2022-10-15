import { TimeSerie } from './timeserie'
import { DateLike, Metadata, Point, PointValue, ResampleOptions, Row, TelemetryV1Output, TimeFrameInternal, TimeframeRowsIterator, TimeInterval, TimeserieIterator } from './types'

interface TimeFrameOptions {
  data: Row[];
  metadata?: Metadata;
}
// interface Column {
//   name: string;
//   data: PointValue[];
//   metadata: Metadata;
// }

/**
 * @class TimeFrame
 * A data structure for time indexed data.
 */
export class TimeFrame {
  readonly data: TimeFrameInternal = {}
  columnNames: string[] = []
  metadata: Metadata = {}

  /**
   * Creates a Timeframe instance from a list of rows. It infers the list of column names from each row's fields.
   * So for example, a single row like `{time: Date.now(), temperature:20, humidity: 40}` would create two columns
   * @param data Array of rows
   */
  constructor (options: TimeFrameOptions) {
    const { data, metadata = {} } = options
    // get a list of unique column names excluding the time key
    this.metadata = metadata
    this.columnNames = [...new Set(data.map((row: Row) => Object.keys(row)).flat())].filter((name: string) => name !== 'time')
    this.data = data
      .concat([])
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

  /**
 * Creates a new timeframe preserving the metadata but replacing data
 * @param data The new data to recreate the serie from
 * @returns
 */
  recreate (data: Row[]): TimeFrame {
    return new TimeFrame({ data, metadata: this.metadata })
  }

  /**
   *
   * @param data An object which is telemetry V1 output {device1: {property1:[[time,value]],property2:[[time,value]]}}
   * @returns
   */
  static fromTelemetryV1Output (data: TelemetryV1Output = {}, metadata: Metadata = {}): TimeFrame {
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

  static fromInternalFormat (data: TimeFrameInternal, metadata?: Metadata): TimeFrame {
    const _data: Row[] = Object.keys(data).map((time: string) => {
      return { time, ...data[time] }
    })
    return new TimeFrame({ data: _data, metadata })
  }

  /**
   *
   * @param timeseries An array of TimeSerie objects
   * @returns A new TimeFrame, where each timeserie represent a column
   */
  static fromTimeseries (timeseries: TimeSerie[]): TimeFrame {
    const data: TimeFrameInternal = {}
    const metadata: Metadata = {}
    timeseries.forEach(ts => {
      metadata[ts.name] = ts.metadata
      ts.toArray().forEach((point: Point) => {
        data[point[0]] = data[point[0]] || {}
        data[point[0]][ts.name] = point[1]
      })
    })
    return TimeFrame.fromInternalFormat(data, metadata)
  }

  /**
   * Concatenates timeframes. Throws error if overlapping times are found. Use merge to join together
   * timeframes with overlapping times
   * @param timeframes Array of timeframes to concatenate
   */
  // static concat(timeframes: TimeFrame[])  : TimeFrame{

  // }

  /**
   *
   * @param timeframes Array of timeframes to join together
   * @returns A timeframe with joined columns
   */
  static join (timeframes: TimeFrame[]): TimeFrame {
    return TimeFrame.fromInternalFormat(Object.assign({}, ...timeframes.map(tf => tf.data)))
  }

  /**
   *
   * @param name The name of the wanted column
   * @returns The column as timeseries
   */
  column (name: string): TimeSerie {
    const data: Point[] = Object.entries(this.data).map(([time, values]) => ([time, values[name]]))
    const metadata = this.metadata[name] || {}
    return new TimeSerie(name, data, metadata)
  }

  columns (): TimeSerie[] {
    return this.columnNames.map((column: string) => this.column(column))
  }

  /**
   *
   * @returns Array of rows
   */
  rows (): readonly Row[] {
    return Object.entries(this.data).map(([time, values]) => ({ time, ...values }))
  }

  project (columns: string[]) : TimeFrame {
    const nonExisting = columns.filter((name: string) => !this.columnNames.includes(name))
    if (nonExisting.length > 0) { throw new Error(`Non existing columns ${nonExisting.join(',')}`) }
    const tf = TimeFrame.fromTimeseries(columns.map((columnName:string) => this.column(columnName)))
    tf.metadata = this.metadata
    return tf
  }

  /**
   *
   * @param time
   * @returns A row at a given time or null
   */
  atTime (time: string): Row | null {
    return { time, ...this.data[time] } || null
  }

  length (): number {
    return Object.keys(this.data).length
  }

  /**
   * Returns the shape of the timeframe
   * @returns Array<Number> The shape of the timeframe expressed as [rows,  columns] where columns excludes the time column
   */
  shape (): number[] {
    return [Object.keys(this.data).length, this.columnNames.length]
  }

  /**
 *
 * @returns The first row
 */
  first (): Row {
    return this.rows()?.[0] || null
  }

  /**
  *
  * @returns The last row
  */
  last (): Row {
    const t = this.rows()
    return t?.[t.length - 1] || null
  }

  sum (): Row {
    const time = this.last().time
    return this.columns().reduce((acc, column) => { acc[column.name] = column.sum(); return acc }, { time })
  }

  avg (): Row {
    const time = this.last().time
    return this.columns().reduce((acc, column) => { acc[column.name] = column.avg(); return acc }, { time })
  }

  delta (): Row {
    const time = this.last().time
    return this.columns().reduce((acc, column) => { acc[column.name] = column.delta(); return acc }, { time })
  }

  max (): Row {
    const time = this.last().time
    return this.columns().reduce((acc, column) => { acc[column.name] = column.max()[1]; return acc }, { time })
  }

  min (): Row {
    const time = this.last().time
    return this.columns().reduce((acc, column) => { acc[column.name] = column.min()[1]; return acc }, { time })
  }

  /**
 *
 * @param from start date string in ISO8601 format
 * @param to end date string in ISO8601 format
 * @returns The subset of points between the two dates. Extremes are included.
 */
  betweenTime (from: DateLike, to: DateLike, options = { includeInferior: true, includeSuperior: true }) {
    const { includeInferior, includeSuperior } = options
    const f = new Date(from)
    const t = new Date(to)
    return this.filter((row: Row) => {
      if (includeInferior && includeSuperior) {
        return new Date(row.time).getTime() >= f.getTime() && new Date(row.time).getTime() <= t.getTime()
      } else if (includeInferior && !includeSuperior) {
        return new Date(row.time).getTime() >= f.getTime() && new Date(row.time).getTime() < t.getTime()
      } else if (!includeInferior && includeSuperior) {
        return new Date(row.time).getTime() > f.getTime() && new Date(row.time).getTime() <= t.getTime()
      } else {
        return new Date(row.time).getTime() > f.getTime() && new Date(row.time).getTime() < t.getTime()
      }
    })
  }

  groupBy (column: string): TimeFrameGrouper {
    return new TimeFrameGrouper(
      [...new Set(this.column(column).values())]
        .map(
          (v: PointValue) => new TimeFrame({
            data: this.rows().filter((row: any) => { return row[column] === v }),
            metadata: this.metadata
          })
        )
    )
  }

  /**
   *
   * @param intervalSizeMs An interval in milliseconds
   * @returns {TimeFramesResampler} a resampler instance that can be used to obtain a new timeframe by aggregating values
   * @example
   * // Average by hour
   * const hourlyAverage = ts.resample(1000 * 60 * 60).avg()
   */
  // aggregate (options: AggregateOptions): TimeFrame {
  //   // Aggregazione per righe o per colonne
  //   // NON resampling
  //   // Vedi https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.aggregate.html
  // }

  resample (options: ResampleOptions): TimeFramesResampler {
    return new TimeFramesResampler(this, options)
  }

  /**
   * Returns a new timeframe where each row satisfies the iterator function
   * @param fn Iterator function
   * @returns {TimeFrame}
   */
  filter (fn: TimeframeRowsIterator) {
    return new TimeFrame({ data: this.rows().filter(fn), metadata: this.metadata })
  }

  /**
 * Returns a new timeframe where each **row** is mapped by the iterator function. For mapping over columns, use apply
 * @param fn Iterator function
 * @returns {TimeFrame}
 */
  map (fn: TimeframeRowsIterator) {
    return new TimeFrame({ data: this.rows().map(fn), metadata: this.metadata })
  }

  /**
   * Applies transformations to the columns of the dataframe, each column is passed to the iterator like a timeserie.
   * If no column is specified, all columns will be used.
   * @param fn {TimeserieIterator}
   */
  apply (fn: TimeserieIterator, columns: string[] = this.columnNames) {
    const unmodifiedColumns = this.columnNames.filter((columnName: string) => !columns.includes(columnName)).map((columnName: string) => this.column(columnName))
    const series: TimeSerie[] = columns
      .map((columnName: string) => (this.column(columnName)))
      .map(fn)

    return TimeFrame.fromTimeseries(unmodifiedColumns.concat(series))
  }

  /**
   * Pretty prints the TimeFrame to the console
   */
  print () {
    console.table(this.rows())
  }
}

class TimeFrameGrouper {
  timeframes: TimeFrame[]

  constructor (timeframes: TimeFrame[] = []) {
    this.timeframes = timeframes
  }
}

/**
 * @class TimeframesResampler
 * Used to resample timeframes, returned by TimeFrame.resample()
 */
class TimeFramesResampler {
  timeframe: TimeFrame
  chunks: TimeFrame[]
  constructor (timeframe: TimeFrame, options: ResampleOptions) {
    this.timeframe = timeframe
    const from = options.from || timeframe.first()?.time
    if (!from) {
      throw new Error('Cannot infer a lower bound for resample')
    }
    const to = options.to || timeframe.last()?.time
    if (!to) {
      throw new Error('Cannot infer an upper bound for resample')
    }
    const intervals = TimeInterval.generate(from, to, options.size)
    this.chunks = intervals.map((interval: TimeInterval) => {
      return timeframe.betweenTime(interval.from, interval.to, { includeInferior: true, includeSuperior: false })
    })
  }

  sum (): TimeFrame {
    return this.timeframe.recreate(this.chunks.map((tf: TimeFrame) => tf.sum()))
  }

  avg (): TimeFrame {
    return this.timeframe.recreate(this.chunks.map((tf: TimeFrame) => tf.avg()))
  }

  first (): TimeFrame {
    return this.timeframe.recreate(this.chunks.map((tf: TimeFrame) => tf.first()))
  }

  last (): TimeFrame {
    return this.timeframe.recreate(this.chunks.map((tf: TimeFrame) => tf.last()))
  }

  max (): TimeFrame {
    return this.timeframe.recreate(this.chunks.map((tf: TimeFrame) => tf.max()))
  }

  min (): TimeFrame {
    return this.timeframe.recreate(this.chunks.map((tf: TimeFrame) => tf.min()))
  }

  delta (): TimeFrame {
    return this.timeframe.recreate(this.chunks.map((tf: TimeFrame) => tf.delta()))
  }
}
