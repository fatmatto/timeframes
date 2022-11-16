import parse from 'parse-duration'
import { TimeSerie } from './timeserie'

export type PointValue = number | string | boolean | any

export type DateLike = Date | string | number;
/**
 * A time indexed value
 */
export type Point = readonly [string, PointValue]
export interface TelemetryV1OutputProperty {
  [propertyName: string]: readonly Point[]
};
export interface TelemetryV1Output {
  [id: string]: TelemetryV1OutputProperty
};

export type Metadata = {
  [key: string]: any
}

export type TimeFrameInternalRow = {
  [columnName: string]: PointValue
}
export type TimeFrameInternal = {
  [time: string]: TimeFrameInternalRow
}

export interface TimeSeriesOperationOptions {
  name?: string;
  metadata?: {};
  fill?: number;
}
export interface FromIndexOptions {
  name: string
  metadata?: Metadata
  fill?: PointValue
}

/**
 * A time indexed group of values of different measurements.
 */
export interface Row {
  readonly time: string
  readonly [x: string]: unknown
};

export type Index = string[]

/**
 * Support type for iterating points from a timeserie
 */
export type TimeseriePointIterator = (value: Point, index: number, array: ReadonlyArray<Point>) => any

/**
 * Support type for combining point values
 */
export type TimeseriePointCombiner = (values: PointValue[], index: DateLike) => PointValue

/**
 * Support type for iterating rows from a timeframe
 */
export type TimeframeRowsIterator = (value: Row, index: number, array: ReadonlyArray<Row>) => any

/**
 * Support type for iterating timeseries
 */
export type TimeserieIterator = (value: TimeSerie, index: number, array: ReadonlyArray<TimeSerie>) => any

export type ColumnAggregation = 'avg' | 'last' | 'first' | 'min' | 'max' | 'delta' | 'sum'
export type ResampleDefaultAggregation = ColumnAggregation

export type IntervalOptions = {
  interval: number;
  from?: DateLike;
  to?: DateLike;
}

export type TimeSerieReduceOptions = {
  operation: ColumnAggregation
}

export type PartitionOptions = IntervalOptions

export type ResampleOptions = IntervalOptions & {
  operation: ResampleDefaultAggregation;
  dropNaN?: boolean;
}

export type TimeFrameResampleOptions = ResampleOptions & {
  operations?: {[key: string]: ColumnAggregation};
}

export interface IndexCreationOptions {
  from: DateLike;
  to: DateLike;
  interval?: number | string;
}

export interface ProjectionOptions {
  columns: string[]
}

export interface AggregationConfiguration {
  output:string;
  operation:'add' | 'mul' | 'div' | 'sub' | 'avg' | TimeseriePointCombiner;
  columns: string[]
}

export type ReduceOperation = 'min' | 'max' | 'first' | 'last' | 'avg' | 'sum' | 'delta'

export type TimeFrameReduceOptions = {
  operation: ReduceOperation
  operations?: {[key:string]:ReduceOperation}
}

export interface FromTimeseriesOptions {
  fill?: PointValue
}

export interface ReindexOptions {
  fill?: PointValue
  mergeIndexes?: boolean
}

export type PipelineStageType = 'aggregate' | 'resample' | 'project'| 'reduce'| 'add' | 'mul'
export type PipelineStage = {
  aggregate?: AggregationConfiguration;
  resample?: ResampleOptions;
  reduce?: TimeFrameReduceOptions;
  project?: ProjectionOptions;
  add?: number;
  mul?: number;
}

export class TimeInterval {
  from: Date
  to: Date
  size: number
  constructor (from: Date, to: Date) {
    this.from = from
    this.to = to
    this.size = to.getTime() - from.getTime()
  }

  static generate (from: DateLike, to: DateLike, interval: number): TimeInterval[] {
    const _to = new Date(to)
    let cursor: Date = new Date(from)
    const intervals: TimeInterval[] = []
    while (cursor.getTime() < _to.getTime()) {
      const next = new Date(cursor)
      next.setMilliseconds(next.getMilliseconds() + interval)
      intervals.push(new TimeInterval(cursor, next))
      cursor = new Date(next)
    }
    return intervals
  }
}

/**
 * Generates a time-index
 * @param options
 * @returns
 */
export function createIndex (options: IndexCreationOptions): Index {
  let size = options.interval
  if (typeof options.interval === 'string') {
    size = parse(options.interval)
  }
  const _to = new Date(options.to)
  const cursor: Date = new Date(options.from)
  const index: Index = []
  while (cursor.getTime() <= _to.getTime()) {
    index.push(cursor.toISOString())
    cursor.setMilliseconds(cursor.getMilliseconds() + (size as number))
  }
  return index
}
