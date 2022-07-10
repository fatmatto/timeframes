export interface TelemetryV1OutputProperty {
  [propertyName: string]: readonly Point[]
};
export interface TelemetryV1Output {
  [id: string]: TelemetryV1OutputProperty
};


export type PointValue = number | string | boolean | any

export type Metadata = {
  [key: string]: any
}

/**
 * A time indexed value
 */
export type Point = readonly [string, PointValue]


export type TimeFrameInternalRow = {
  [columnName: string]: PointValue
}
export type TimeFrameInternal = {
  [time: string]: TimeFrameInternalRow
}

/**
 * Support type for iterating points from a timeserie
 */
export type TimeseriesIterator = (value: Point, index: number, array: ReadonlyArray<Point>) => any

/**
 * Support type for iterating rows from a timeframe
 */
export type TimeframesIterator = (value: Row, index: number, array: ReadonlyArray<Row>) => any


/**
 * A time indexed group of values of different measurements.
 */
export interface Row {
  readonly time: string
  readonly [x: string]: unknown
};

export type DateLike = Date | string | number;



type ResampleAggregationMap = {
  [x: string]: string
}

type ResampleDefaultAggregation = 'sum' | 'avg' | 'max' | 'min'

export type ResampleOptions = {
  from?: DateLike;
  to?: DateLike;
  aggregations?: ResampleAggregationMap;
  defaultAggregation?: ResampleDefaultAggregation;
  dropNaN?: boolean;
}

export class TimeInterval {
  from: Date;
  to: Date;
  size: number;
  constructor(from: Date, to: Date) {
    this.from = from
    this.to = to
    this.size = to.getTime() - from.getTime()
  }
  static generate(from: DateLike, to: DateLike, size: number): TimeInterval[] {
    const _to = new Date(to)
    let cursor: Date = new Date(from)
    const intervals: TimeInterval[] = []
    while (cursor.getTime() < _to.getTime()) {
      const next = new Date(cursor)
      next.setMilliseconds(next.getMilliseconds() + size)
      const interval = new TimeInterval(cursor, next)
      intervals.push(interval)
      cursor = new Date(next)
    }
    return intervals
  }
}