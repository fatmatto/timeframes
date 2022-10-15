import { DateLike, Metadata, Point, PointValue, ResampleOptions, TimeInterval, TimeseriePointCombiner, TimeseriePointIterator } from './types'
import { DateLikeToString } from './utils'

interface TimeSeriesOperationOptions {
  name: string;
  metadata?: {};
  fill?: number;
}

function isNumeric (str: string | number): boolean {
  if (typeof str === 'number') return !isNaN(str)
  if (typeof str !== 'string') return false // we only process strings!
  return !isNaN(str as any) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}

function sortPoints (points: Point[] | ReadonlyArray<Point>) {
  return [].concat(points).sort((a: Point, b: Point) => {
    if (a[0] > b[0]) {
      return 1
    } else {
      return -1
    }
  })
}

function normalizePoint (p: Point): Point {
  return [DateLikeToString(p[0]), p[1]]
}

/**
 * A data structure for a time serie.
 */
export class TimeSerie {
  static internals: any
  readonly data: Point[]
  readonly name: string
  metadata: Metadata
  constructor (name: string, serie: Point[] | ReadonlyArray<Point>, metadata: Metadata = {}) {
    this.data = sortPoints(serie).map(normalizePoint)
    this.name = name
    this.metadata = metadata
  }

  /**
   *
   * @returns Array of points, where each point is a tuple with ISO8601 timestamp and value
   */
  toArray () {
    return this.data
  }

  /**
   * Creates a new serie preserving the name and the metadata but replacing data
   * @param serie The new data to recreate the serie from
   * @returns
   */
  recreate (serie: Point[] | ReadonlyArray<Point>) {
    return new TimeSerie(this.name, serie, this.metadata)
  }

  /**
   *
   * @returns The array of time indexes
   */
  indexes (): DateLike[] {
    return this.data.map((p: Point) => p[0])
  }

  /**
   *
   * @returns The array of values
   */
  values (): PointValue[] {
    return this.data.map((p: Point) => p[1])
  }

  /**
   *
   * @returns The time of the latest non-NaN value
   */
  lastValidIndex (): string | null {
    const result = this.data.concat([]).reverse().find((point: Point) => {
      return !!point[1]
    })
    if (result) {
      return result[0]
    } else {
      return null
    }
  }

  /**
   *
   * @returns The time of the first non-NaN value
   */
  firstValidIndex (): string | null {
    const result = this.data.find((point: Point) => {
      return !!point[1]
    })
    if (result) {
      return result[0]
    } else {
      return null
    }
  }

  /**
   *
   * @returns The latest non-NaN value
   */
  lastValidValue (): PointValue {
    const result = this.data.concat([]).reverse().find((point: Point) => {
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
   * @returns The first non-NaN value
   */
  firstValidValue (): PointValue {
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
   * @returns {PointValue} The value of the timeseries at the given time
   */
  atTime (time: DateLike, fillValue: number = null): PointValue {
    const point: Point | undefined = this.data.find((point: Point) => {
      return point[0] === DateLikeToString(time)
    })

    if (point) {
      return point[1]
    } else {
      return fillValue
    }
  }

  /**
   *
   * @returns The value at the given index (position, not time)
   */
  atIndex (index: number): PointValue {
    if (index >= this.data.length) {
      throw new Error('Index out of bounds')
    }
    return this.data[index][1]
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
    const data: Point[] = this.data.filter((point: Point) => {
      if (includeInferior && includeSuperior) {
        return new Date(point[0]).getTime() >= f.getTime() && new Date(point[0]).getTime() <= t.getTime()
      } else if (includeInferior && !includeSuperior) {
        return new Date(point[0]).getTime() >= f.getTime() && new Date(point[0]).getTime() < t.getTime()
      } else if (!includeInferior && includeSuperior) {
        return new Date(point[0]).getTime() > f.getTime() && new Date(point[0]).getTime() <= t.getTime()
      } else {
        return new Date(point[0]).getTime() > f.getTime() && new Date(point[0]).getTime() < t.getTime()
      }
    })
    return this.recreate(data)
  }

  /**
 *
 * @param from start positional index
 * @param to end positional index
 * @returns The subset of points between the two indexes. Extremes are included.
 */
  betweenIndexes (from: number, to: number) {
    return this.filter((_: Point, i: number) => { return i >= from && i <= to })
  }

  filter (fn: TimeseriePointIterator) {
    return this.recreate(this.data.filter(fn))
  }

  map (fn: TimeseriePointIterator) {
    return this.recreate(this.data.map(fn))
  }

  length (): number {
    return this.data.length
  }

  isEmpty (): boolean {
    return this.data.length === 0
  }

  copy (): TimeSerie {
    return new TimeSerie(this.name, this.data, this.metadata)
  }

  sum (): number {
    return this.data.map((p: Point) => p[1]).reduce((p1: number, p2: number) => p1 + p2, 0)
  }

  /**
   *
   * @returns The average of point values
   */
  avg (): number {
    return this.sum() / this.length()
  }

  /**
   * @returns The time weighted average of points. Every point is weighted by the timestamp, in this way we handle "data holes"
   */
  weightedAvg (): number {
    if (this.length() === 0) { return 0 }
    if (this.length() === 1) { return 1 }

    const numerator: number = this.data.map((p: Point) => {
      const t: number = new Date(p[0]).getTime()
      return t * p[1]
    }).reduce((a: number, b: number) => { return a + b }, 0)

    const denominator: number = this.data.map((p: Point) => {
      return new Date(p[0]).getTime()
    }).reduce((a, b) => { return a + b }, 0)

    return numerator / denominator
  }

  delta (): number {
    if (this.length() <= 0) {
      return null
    }
    if (this.length() === 1) {
      return this.data[0][1]
    }

    return this.last()[1] - this.first()[1]
  }

  /**
   *
   * @returns The first point
   */
  first (): Point {
    return this.data[0] || null
  }

  /**
   * Returns the first point at or after a given timestamp
   * @param time
   * @returns
   */
  firstAt (time: DateLike): Point {
    return this.data.find((p: Point) => { return new Date(p[0]).getTime() >= new Date(time).getTime() })
  }

  /**
   *
   * @returns The last point
   */
  last (): Point {
    return this.data[this.length() - 1] || null
  }

  /**
   *
   * @returns The point with max value, or null
   */
  max (): Point | null {
    if (this.length() === 0) {
      return null
    }
    if (this.length() === 1) {
      return this.data[0]
    }
    return this.data.reduce((prev, current) => current[1] > prev[1] ? current : prev, this.data[0])
  }

  /**
   *
   * @returns The point with min value or null
   */
  min (): Point | null {
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
  resample (options: ResampleOptions): TimeseriesResampler {
    return new TimeseriesResampler(this, options)
  }

  removeAt (time: DateLike): TimeSerie {
    return this.recreate(this.data.filter((p: Point) => { return p[0] !== DateLikeToString(time) }))
  }

  removeAtIndex (index: number): TimeSerie {
    return this.recreate(this.data.filter((_: Point, i: number) => { return i !== index }))
  }

  /**
 *
 * @param from start date string in ISO8601 format
 * @param to end date string in ISO8601 format
 * @returns New timeserie without the removed data. Bounds are removed.
 */
  removeBetweenTime (from: DateLike, to: DateLike) {
    const f = new Date(from)
    const t = new Date(to)
    const data = this.data.filter((point: Point) => {
      return new Date(point[0]).getTime() < f.getTime() || new Date(point[0]).getTime() > t.getTime()
    })
    return this.recreate(data)
  }

  dropNaN () {
    return this.filter((p: Point) => isNumeric(p[1]))
  }

  dropNull () {
    return this.filter((p: Point) => p[1] !== null)
  }

  /**
   *
   * @param decimals {Number} the number of decimals to keep
   * @returns {TimeSerie}
   */
  round (decimals: number) {
    return this.map((p: Point) => ([p[0], Number(Number(p[1]).toFixed(decimals))]))
  }

  // Operation between timeseries
  combine (series: TimeSerie[], options: TimeSeriesOperationOptions) : TimeSerie {
    return TimeSerie.internals.add(series.concat(this), options)
  }
}

// Estrae gli indici dalla prima serie o li prende dalle opzioni
// Per ogni elemento dell'indice scorre gli elementi di tutte le timeserie e li combina con una funzione combiner
// Restituisce la funzione
TimeSerie.internals = {}
TimeSerie.internals.combiners = {}
TimeSerie.internals.combine = (series: TimeSerie[], combiner: TimeseriePointCombiner, options: TimeSeriesOperationOptions) : TimeSerie => {
  const indexes: DateLike[] = series[0].data.map((p: Point) => p[0])
  const points = indexes.map((idx: string) => {
    const values = series.map((serie:TimeSerie) => serie.atTime(idx, options.fill))
    return [
      idx,
      combiner(values, idx)
    ] as Point
  })
  return new TimeSerie(options.name, points, options.metadata)
}

TimeSerie.internals.combiners.sum = (points: PointValue[]) => points.reduce((a:PointValue, b:PointValue) => a + b, 0)
TimeSerie.internals.combiners.diff = (points: PointValue[]) => points.reduce((a:PointValue, b:PointValue) => a - b, 0)
TimeSerie.internals.combiners.mul = (points: PointValue[]) => points.reduce((a:PointValue, b:PointValue) => a * b, 0)
TimeSerie.internals.combiners.div = (points: PointValue[]) => points.reduce((a:PointValue, b:PointValue) => a / b, 0)
TimeSerie.internals.combiners.avg = (points: PointValue[]) => (TimeSerie.internals.combiners.sum(points) / points.length)

/**
 * @class TimeseriesResampler
 * Used to resample timeseries, returned by TimeSerie.resample()
 */
class TimeseriesResampler {
  timeserie: TimeSerie
  chunks: TimeSerie[]
  constructor (timeserie: TimeSerie, options: ResampleOptions) {
    this.timeserie = timeserie
    const from = options.from || timeserie.first()?.[0]
    if (!from) {
      throw new Error('Cannot infer a lower bound for resample')
    }
    const to = options.to || timeserie.last()?.[0]
    if (!to) {
      throw new Error('Cannot infer an upper bound for resample')
    }
    const intervals = TimeInterval.generate(from, to, options.size)
    this.chunks = intervals.map((interval: TimeInterval) => {
      return timeserie.betweenTime(interval.from, interval.to, { includeInferior: true, includeSuperior: false })
    })
  }

  sum (): TimeSerie {
    return this.timeserie.recreate(this.chunks.map((ts: TimeSerie) => [ts.first()[0], ts.sum()]))
  }

  avg (): TimeSerie {
    return this.timeserie.recreate(this.chunks.map((ts: TimeSerie) => [ts.first()[0], ts.avg()]))
  }

  delta (): TimeSerie {
    return this.timeserie.recreate(this.chunks.map(
      (ts: TimeSerie) => [ts.first()[0], ts.delta()]
    ))
  }

  first (): TimeSerie {
    return this.timeserie.recreate(this.chunks.map((ts: TimeSerie) => [ts.first()[0], ts.first()[1]]))
  }

  last (): TimeSerie {
    return this.timeserie.recreate(this.chunks.map((ts: TimeSerie) => [ts.first()[0], ts.last()[1]]))
  }

  max (): TimeSerie {
    return this.timeserie.recreate(this.chunks.map((ts: TimeSerie) => [ts.first()[0], ts.max()[1]]))
  }

  min (): TimeSerie {
    return this.timeserie.recreate(this.chunks.map((ts: TimeSerie) => [ts.first()[0], ts.min()[1]]))
  }
}
