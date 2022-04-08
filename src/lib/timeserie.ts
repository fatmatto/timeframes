import { DateLike, Point, PointValue, TimeseriesIterator } from "./types";



function sortPoints(points: Point[] | ReadonlyArray<Point>, order= 'ASC') {
  let k = 1
  if (order === 'DESC') {
    k = -1
  }
  return [].concat(points).sort((a: Point, b: Point) => {
    if (a[0]>b[0]) {
      return 1 * k
    }
    else {
      return -1 * k
    }
  })
}

/**
 * A data structure for a time serie.
 */
export class TimeSerie {
  readonly data: ReadonlyArray<Point>;
  readonly name: string;
  constructor(name: string, serie: Point[] | ReadonlyArray<Point>) {
    this.data = sortPoints(serie)
    this.name = name
  }
  /**
   * 
   * @returns Array of points, where each point is a tuple with ISO8601 timestamp and value
   */
  toArray() {
    return this.data
  }
  lastValidIndex(): string | null {
    const result = this.data.concat([]).reverse().find((point: Point) => {
      return !!point[1]
    })
    if (result) {
      return result[0]
    } else {
      return null
    }
  }
  firstValidIndex(): string | null {
    const result = this.data.find((point: Point) => {
      return !!point[1]
    })
    if (result) {
      return result[0]
    } else {
      return null
    }
  }
  lastValidValue(): PointValue {
    const result = this.data.concat([]).reverse().find((point: Point) => {
      return !!point[1]
    })
    if (result) {
      return result[1]
    } else {
      return null
    }
  }
  firstValidValue(): PointValue {
    const result = this.data.find((point: Point) => {
      return !!point[1]
    })
    if (result) {
      return result[1]
    } else {
      return null
    }
  }
  /**
   * 
   * @param time 
   * @returns {PointValue} The value of the timeseries at the given time
   */
  atTime(time: DateLike) : PointValue {
    const point: Point | undefined = this.data.find((point: Point) => {
      return point[0] === time
    })

    if (point) {
      return point[1]
    } else {
      return null
    }
  }
  /**
   * 
   * @param from start date string in ISO8601 format
   * @param to end date string in ISO8601 format
   * @returns The subset of points between the two dates. Extremes are included.
   */
  betweenTime(from: DateLike, to: DateLike) {
    const f = new Date(from)
    const t = new Date(to)
    return new TimeSerie(this.name, this.data.filter((point: Point) => {
      return new Date(point[0]).getTime() >= f.getTime() && new Date(point[0]).getTime() <= t.getTime()
    }))
  }

  filter(fn: TimeseriesIterator) {
    return new TimeSerie(this.name, this.data.filter(fn))
  }
  map(fn: TimeseriesIterator) {
    return new TimeSerie(this.name, this.data.map(fn))
  }
  length(): number {
    return this.data.length
  }
  isEmpty(): boolean {
    return this.data.length === 0
  }
  copy(): TimeSerie {
    return new TimeSerie(this.name, this.data)
  }
  sum(): number {
    return this.data.map((p: Point) => p[1]).reduce((p1: number, p2: number) => p1 + p2, 0)
  }
  /**
   * 
   * @returns The average of point values
   */
  avg(): number {
    return this.sum() / this.length()
  }
  /**
   * 
   * @returns The first point
   */
  first(): Point {
    return this.data[0] || null
  }
  /**
   * 
   * @returns The last point
   */
  last(): Point {
    return this.data[this.length()-1] || null
  }
  /**
   * 
   * @returns The point with max value, or null
   */
  max(): Point | null {
    if (this.length() === 0) {
      return null
    }
    if (this.length() === 1) {
      return this.data[0]
    }
    return this.data.reduce((prev,current) => current[1] > prev[1] ? current : prev, this.data[0])
  }
  /**
   * 
   * @returns The point with min value or null
   */
  min(): Point | null {
    if (this.length() === 0) {
      return null
    }
    if (this.length() === 1) {
      return this.data[0]
    }
    return this.data.reduce((prev, current) => current[1] < prev[1] ? current : prev, this.data[0])
  }
  /**
   * 
   * @param intervalSizeMs An interval in milliseconds
   * @returns {TimeseriesResampler} a resampler instance that can be used to obtain a new timeserie by aggregating values
   * @example
   * // Average by hour
   * const hourlyAverage = ts.resample(1000 * 60 * 60).avg()
   */
  resample(intervalSizeMs : number) : TimeseriesResampler {
    const intervals = TimeInterval.generate(this.first()[0],this.last()[0], intervalSizeMs)
    return new TimeseriesResampler(this.name,intervals.map((interval: TimeInterval) => {
      return this.betweenTime(interval.from,interval.to)
    }))
  }
}



class TimeInterval {
  from: Date;
  to: Date;
  size: number;
  constructor(from: Date, to: Date) {
    this.from = from
    this.to = to
    this.size = to.getTime() - from.getTime()
  }
  static generate(from: DateLike, to: DateLike, size: number) : TimeInterval[] {
    const _to = new Date(to)
    const cursor : Date = new Date(from)
    const intervals: TimeInterval[] = []
    while (cursor.getTime() < _to.getTime()) {
      const next = new Date(cursor)
      next.setMilliseconds(next.getMilliseconds() + size)
      const interval = new TimeInterval(cursor, next)
      intervals.push(interval)
    }
    return intervals
  }
}

class TimeseriesResampler {
  timeseries: TimeSerie[];
  name: string;
  constructor(name: string, timeseries: TimeSerie[]) {
    this.name = name
    this.timeseries = timeseries
  }
  sum(): TimeSerie {
    return new TimeSerie(this.name, this.timeseries.map((ts:TimeSerie) => [ts.first()[0], ts.sum()]))
  }
  avg(): TimeSerie {
    return new TimeSerie(this.name, this.timeseries.map((ts: TimeSerie) => [ts.first()[0], ts.avg()]))
  }
  first(): TimeSerie {
    return new TimeSerie(this.name, this.timeseries.map((ts: TimeSerie) => [ts.first()[0], ts.first()[1]]))
  }
  last(): TimeSerie {
    return new TimeSerie(this.name, this.timeseries.map((ts: TimeSerie) => [ts.first()[0], ts.last()[1]]))
  }
  max(): TimeSerie {
    return new TimeSerie(this.name, this.timeseries.map((ts: TimeSerie) => [ts.first()[0], ts.max()[1]]))
  }
  min(): TimeSerie {
    return new TimeSerie(this.name, this.timeseries.map((ts: TimeSerie) => [ts.first()[0], ts.min()[1]]))
  }

}