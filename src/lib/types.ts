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
 * Support type for iterating points
 */
export type TimeseriesIterator = (value: Point, index: number, array: ReadonlyArray<Point>) => any

/**
 * A time indexed group of values of different measurements.
 */
export interface Row {
  readonly time: string
  readonly [x: string]: unknown
};

export type DateLike = Date | string | number;



