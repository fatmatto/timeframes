import { TimeSerie } from "./timeserie";
import { DateLike, Point, PointValue, ResampleOptions, Row, TelemetryV1Output, TimeFrameInternal, TimeframesIterator, TimeInterval } from "./types";


// interface Column {
//   name: string;
//   data: PointValue[];
//   metadata: Metadata;
// }

/**
 * Timeseries oriented dataframe
 */
export class TimeFrame {
  readonly data: TimeFrameInternal;
  readonly columns: readonly string[];
  /**
   * 
   * @param data An object which is telemetry V1 output {device1: {property1:[[time,value]],property2:[[time,value]]}}
   * @returns 
   */
  static fromTelemetryV1Output(data: TelemetryV1Output = {}): TimeFrame {
    const _data: TimeFrameInternal = {};
    for (const deviceId in data) {
      for (const propertyName in data[deviceId]) {
        for (const [time, value] of data[deviceId][propertyName]) {
          if (!_data[time]) {
            _data[time] = {};
          }
          const column = `${deviceId}:${propertyName}`;
          _data[time][column] = value;

        }
      }
    }
    const rows = Object.keys(_data).map((time: string) => {
      return { time, ..._data[time] }
    })
    return new TimeFrame(rows)
  }

  static fromInternalFormat(data: TimeFrameInternal): TimeFrame {
    return new TimeFrame(Object.keys(data).map((time: string) => {
      return { time, ...data[time] }
    }))
  }

  static fromTimeseries(timeseries: TimeSerie[]): TimeFrame {
    const data: TimeFrameInternal = {}

    timeseries.forEach(ts => {
      ts.toArray().forEach((point: Point) => {
        data[point[0]] = data[point[0]] || {}
        data[point[0]][ts.name] = point[1]
      })
    })
    return TimeFrame.fromInternalFormat(data)
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
  static join(timeframes: TimeFrame[]): TimeFrame {
    return TimeFrame.fromInternalFormat(Object.assign({}, ...timeframes.map(tf => tf.data)))
  }


  constructor(rows: Row[]);

  /**
   * Creates a Timeframe instance from a list of rows. It infers the list of column names from each row's fields.
   * @param data Array of rows
   */
  constructor(data: Row[] = []) {
    this.columns = [...new Set(data.map((row: Row) => Object.keys(row)).flat())].filter((name: string) => name !== 'time')
    this.data = data
    .concat([]).sort((a, b) => {
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
   * 
   * @param name The name of the wanted column
   * @returns The column as timeseries
   */
  column(name: string): TimeSerie {
    return new TimeSerie(name, Object.entries(this.data).map(([time, values]) => ([time, values[name]])))
  }
  /**
   * 
   * @returns Array of rows
   */
  rows(): readonly Row[] {
    return Object.entries(this.data).map(([time, values]) => ({ time, ...values }))
  }
  /**
   * 
   * @param time 
   * @returns A row at a given time or null
   */
  atTime(time: string): Row | null {
    return { time, ...this.data[time] } || null
  }

  length(): number {
    return Object.keys(this.data).length
  }
  /**
   * Returns the shape of the timeframe
   * @returns Array<Number> The shape of the timeframe expressed as [rows,  columns] where columns excludes the time column
   */
  shape(): number[] {
    return [Object.keys(this.data).length, this.columns.length]
  }

  /**
 * 
 * @returns The first row
 */
  first(): Row {
    return this.rows()?.[0] || null
  }

    /**
  * 
  * @returns The first point
  */
  last(): Row {
    const t = this.rows()
    return t?.[t.length-1] || null
  }

  /**
 * 
 * @param from start date string in ISO8601 format
 * @param to end date string in ISO8601 format
 * @returns The subset of points between the two dates. Extremes are included.
 */
  betweenTime(from: DateLike, to: DateLike, options = { includeInferior: true, includeSuperior: true }) {
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

  groupBy(column: string): TimeFrameGrouper {
    return new TimeFrameGrouper(
      [...new Set(this.column(column).values())]
        .map(
          (v: PointValue) => new TimeFrame(this.rows().filter((row: any) => { return row[column] === v }))
        )
    )
  }

  /**
 * 
 * @param intervalSizeMs An interval in milliseconds
 * @returns {TimeframesResampler} a resampler instance that can be used to obtain a new timeframe by aggregating values
 * @example
 * // Average by hour
 * const hourlyAverage = ts.resample(1000 * 60 * 60).avg()
 */
  resample(intervalSizeMs: number, options: ResampleOptions = {}): TimeFrame {
    const from = options.from || this.first()?.time
    if (!from) {
      throw new Error('Cannot infer a lower bound for resample')
    }
    const to = options.to || this.last()?.time

    const defaultAggregation = options.defaultAggregation || 'avg'

    if (!to) {
      throw new Error('Cannot infer an upper bound for resample')
    }
    const intervals = TimeInterval.generate(from, to, intervalSizeMs)
    const frames = intervals.map((interval: TimeInterval) => {
      return this.betweenTime(interval.from, interval.to, { includeInferior: true, includeSuperior: false })
    })
    const rows: Row[] = frames.map((frame: TimeFrame) => {
      const o = {
        time: frame.first().time,
      }
      frame.columns.forEach(columnName => {
        const aggregation = options?.aggregations?.[columnName] || defaultAggregation
        let column = frame.column(columnName)
        if (options.dropNaN) {
          column = column.dropNaN()
        }
        if (typeof column[aggregation] !== 'function') {
          throw new Error(`Invalid aggregation function name. No function named ${aggregation} found in Timeserie`)
        }
        o[columnName] = column[aggregation]()
      })
      return o
    })
    return new TimeFrame(rows)
  }

  /**
   * Returns a new timeframe where each row satisfies the iterator function
   * @param fn Iterator function
   * @returns {TimeFrame}
   */
  filter(fn: TimeframesIterator) {
    return new TimeFrame(this.rows().filter(fn))
  }

  /**
 * Returns a new timeframe where each row is mapped by the iterator function
 * @param fn Iterator function
 * @returns {TimeFrame}
 */
  map(fn: TimeframesIterator) {
    return new TimeFrame(this.rows().map(fn))
  }


  print() {
    console.table(this.rows())
  }
}


class TimeFrameGrouper {
  timeframes: TimeFrame[]

  constructor(timeframes: TimeFrame[] = []) {
    this.timeframes = timeframes
  }
}
