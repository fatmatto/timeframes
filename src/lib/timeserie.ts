import {
  BetweenTimeOptions,
  createIndex,
  DateLike,
  FromIndexOptions,
  Index,
  Metadata,
  PartitionOptions,
  Point,
  PointValue,
  ReindexOptions,
  ResampleOptions,
  SplitOptions,
  TimeInterval,
  TimeseriePointCombiner,
  TimeseriePointIterator,
  TimeSerieReduceOptions,
  TimeSeriesOperationOptions,
} from "./types";
import { chunk, DateLikeToString, hasValueOr } from "./utils";

import * as Timsort from "timsort";

function isNumeric(str: string | number): boolean {
  if (typeof str === "number") return !isNaN(str);
  if (typeof str !== "string") return false; // we only process strings!
  return (
    !isNaN(str as any) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(str))
  ); // ...and ensure strings of whitespace fail
}

function normalizePoint(p: Point): Point {
  return [DateLikeToString(p[0]), p[1]];
}

function sortPoints(points: Point[] | ReadonlyArray<Point>) {
  const arr = [].concat(points);
  Timsort.sort(arr, (a: Point, b: Point) => {
    if (a[0] > b[0]) {
      return 1;
    } else {
      return -1;
    }
  });
  return arr;
}

// function normalizePoint(p: Point): Point {
//   return [DateLikeToString(p[0]), p[1]];
// }

/**
 * A data structure for a time serie.
 */
export class TimeSerie {
  public static internals: any = {};
  public static createIndex: Function;
  readonly data: Point[];
  name: string;
  metadata: Metadata;
  index: { [key: string]: PointValue };
  _indexWasBuilt: boolean = false;

  /**
   * Creates a new timeserie.
   * @param name {String} The name of the serie
   * @param serie {Point[]} The points in the serie
   * @param metadata {Metadata} Optional metadata
   */
  constructor(
    name: string,
    serie: Point[] | ReadonlyArray<Point> = [],
    metadata: Metadata = {}
  ) {
    // PERF hot point: not normalizing leads to big perf increase
    this.data = sortPoints(serie).map(normalizePoint);
    this.name = name;
    this.metadata = metadata;
    this.index = {}
  }


  _buildIndex() {
    if (this._indexWasBuilt) { return }
    this.data.forEach((p: Point) => {
      this.index[p[0]] = p
    })
    this._indexWasBuilt = true
  }

  /**
   * Creates a new TimeSerie from the given Index. The new serie's values are all set to `null` unless `options.fill` is passed.
   * @param index
   * @param options
   */
  static fromIndex(index: Index, options: FromIndexOptions): TimeSerie {
    return new TimeSerie(
      options.name,
      index.map((i: string) => [i, hasValueOr(options?.fill, null)]),
      options.metadata,
    );
  }

  /**
   * Recreates the serie's index according to `options` and returns the reindexed serie.
   *
   * @param index The new index to use. Can be created with createIndex()
   * @see createIndex
   * @param options
   * @return The reindexed timeserie
   */
  reindex(index: Index, options?: ReindexOptions): TimeSerie {
    if (options.mergeIndexes === true) {
      const idx = [...new Set(this.indexes().concat(index))];
      return new TimeSerie(
        this.name,
        idx.map((i: string) => [i, hasValueOr(this.atTime(i), options?.fill || null)]),
        this.metadata,
      );
    }
    return new TimeSerie(
      this.name,
      index.map((i: string) => [i, hasValueOr(this.atTime(i), options?.fill || null)]),
      this.metadata,
    );
  }

  /**
   *
   * Returns the array of points, where each point is a tuple with ISO8601 timestamp and value
   */
  toArray() {
    return this.data;
  }

  /**
   * Updates (in place) the serie's name. **This method does NOT return a new timeserie**.
   * @param name
   */
  rename(name: string) {
    this.name = name;
    return this;
  }

  /**
   * Creates a new serie preserving the name and the metadata but replacing data
   * @param serie The new data to recreate the serie from
   * @returns
   */
  recreate(serie: Point[] | ReadonlyArray<Point>) {
    return new TimeSerie(this.name, serie, this.metadata);
  }

  /**
   *
   * Returns the array of time indexes
   */
  indexes(): DateLike[] {
    return this.data.map((p: Point) => p[0]);
  }

  /**
   *
   * Returns the array of values
   */
  values(): PointValue[] {
    return this.data.map((p: Point) => p[1]);
  }

  /**
   * Returns a new serie by appending series to the current one
   */
  static concat(series: TimeSerie[]): TimeSerie {
    return new TimeSerie(
      series[0].name,
      series.flatMap((serie) => serie.toArray()),
      Object.assign({}, ...series.map((serie) => serie.metadata)),
    );
  }

  /**
   *
   * Returns the time of the latest non-NaN value
   */
  lastValidIndex(): string | null {
    const result = this.data
      .concat([])
      .reverse()
      .find((point: Point) => {
        return !!point[1];
      });
    if (result) {
      return result[0];
    } else {
      return null;
    }
  }

  /**
   *
   * Returns the time of the first non-NaN value
   */
  firstValidIndex(): string | null {
    const result = this.data.find((point: Point) => {
      return !!point[1];
    });
    if (result) {
      return result[0];
    } else {
      return null;
    }
  }

  /**
   * Returns the latest non-NaN value
   */
  lastValidValue(): PointValue {
    const result = this.data
      .concat([])
      .reverse()
      .find((point: Point) => {
        return !!point[1];
      });
    if (result) {
      return result[1];
    } else {
      return null;
    }
  }

  /**
   * Returns the first non-NaN value
   */
  firstValidValue(): PointValue {
    const result = this.data.find((point: Point) => {
      return !!point[1];
    });
    if (result) {
      return result[1];
    } else {
      return null;
    }
  }

  /**
   * Returns the value of the timeseries at the given time
   * @returns {PointValue}
   */
  atTime(time: DateLike, fillValue: number = null): PointValue {
    this._buildIndex()
    return hasValueOr(this.index?.[DateLikeToString(time)]?.[1], fillValue || null);
  }

  /**
   *
   * Returns the value at the given index.
   */
  atIndex(index: number): PointValue {
    if (index >= this.data.length) {
      throw new Error("Index out of bounds");
    }
    return this.data[index][1];
  }

  /**
   * Returns the subset of points between the two dates. Extremes are included.
   *
   * @param from start date string in ISO8601 format
   * @param to end date string in ISO8601 format
   */
  betweenTime(
    from: DateLike,
    to: DateLike,
    options: BetweenTimeOptions = {
      includeInferior: true,
      includeSuperior: true,
    },
  ) {
    const { includeInferior, includeSuperior } = options;
    const f = new Date(from);
    const t = new Date(to);
    const data: Point[] = this.data.filter((point: Point) => {
      if (includeInferior && includeSuperior) {
        return (
          new Date(point[0]).getTime() >= f.getTime() &&
          new Date(point[0]).getTime() <= t.getTime()
        );
      } else if (includeInferior && !includeSuperior) {
        return (
          new Date(point[0]).getTime() >= f.getTime() &&
          new Date(point[0]).getTime() < t.getTime()
        );
      } else if (!includeInferior && includeSuperior) {
        return (
          new Date(point[0]).getTime() > f.getTime() &&
          new Date(point[0]).getTime() <= t.getTime()
        );
      } else {
        return (
          new Date(point[0]).getTime() > f.getTime() &&
          new Date(point[0]).getTime() < t.getTime()
        );
      }
    });
    return this.recreate(data);
  }

  /**
   * Returns the subset of points between the two indexes. Extremes are included.
   *
   * @param from start positional index
   * @param to end positional index
   */
  betweenIndexes(from: number, to: number) {
    return this.filter((_: Point, i: number) => {
      return i >= from && i <= to;
    });
  }

  /**
   * Builds a new serie by applying a filter function the current serie's points
   * @params fn {Function}
   */
  filter(fn: TimeseriePointIterator) {
    return this.recreate(this.data.filter(fn));
  }

  /**
   * Builds a new serie by applying a map function the current serie's points
   * @param fn {Function}
   */
  map(fn: TimeseriePointIterator) {
    return this.recreate(this.data.map(fn));
  }

  /**
   * Returns the number of points in the serie.
   */
  length(): number {
    return this.data.length;
  }

  /**
   * Returns true if the serie has 0 points
   */
  isEmpty(): boolean {
    return this.data.length === 0;
  }

  /**
   * Copies the serie to a new serie
   */
  copy(): TimeSerie {
    return new TimeSerie(this.name, this.data, this.metadata);
  }

  /**
   * Returns the sum of the values in the serie
   */
  sum(): Point {
    if (this.length() === 0) {
      return [null, null];
    }
    const copy = this.dropNaN();
    let tot = 0;
    const l = copy.length();
    const data = copy.toArray();
    for (let i = l - 1; i >= 0; i--) {
      tot += data[i][1];
    }
    return [this.first()[0], tot];
  }

  /**
   * Returns the average of the values in the serie
   */
  avg(): Point {
    if (this.length() === 0) {
      return [null, null];
    }
    const copy = this.dropNaN();
    return [this.first()[0], copy.sum()[1] / copy.length()];
  }

  /**
   * Returns the difference between the last and the first element by performing last value - first value.
   */
  delta(): Point {
    if (this.length() <= 0) {
      return [null, null];
    }
    const copy = this.dropNaN();
    if (copy.length() === 1) {
      return copy.data[0][1];
    }

    return [this.first()[0], copy.last()[1] - copy.first()[1]];
  }

  /**
   * Returns the first point
   *
   */
  first(): Point {
    return hasValueOr(this.data[0], null);
  }

  /**
   * Returns the first point at or after a given timestamp
   * @param time
   */
  firstAt(time: DateLike): Point {
    return this.data.find((p: Point) => {
      return new Date(p[0]).getTime() >= new Date(time).getTime();
    });
  }

  /**
   *
   * Returns the last point
   */
  last(): Point {
    return hasValueOr(this.data[this.length() - 1], null);
  }

  /**
   *
   * Returns the point with max value, or null
   */
  max(): Point | null {
    if (this.length() === 0) {
      return [null, null];
    }
    if (this.length() === 1) {
      return this.data[0];
    }
    return this.data.reduce(
      (prev, current) => (current[1] > prev[1] ? current : prev),
      this.data[0],
    );
  }

  /**
   *
   * Returns the point with min value or null
   */
  min(): Point | null {
    if (this.length() === 0) {
      return [null, null];
    }
    if (this.length() === 1) {
      return this.data[0];
    }
    return this.data.reduce(
      (prev, current) => (current[1] < prev[1] ? current : prev),
      this.data[0],
    );
  }

  /**
   * Reduces the timeserie to a new serie of a single point, applying a function
   */
  reduce(options: TimeSerieReduceOptions): TimeSerie {
    return this.recreate([this[options.operation]()]);
  }

  /**
   * Partitions The TimeSerie into multiple sub timeseries by dividing the time column into even groups. Returns an array of sub TimeSeries.
   * @param options
   */
  partition(options: PartitionOptions): TimeSerie[] {
    const from = options.from || this.first()?.[0];
    if (!from) {
      throw new Error("Cannot infer a lower bound for resample");
    }
    const to = options.to || this.last()?.[0];
    if (!to) {
      throw new Error("Cannot infer an upper bound for resample");
    }

    const intervals = TimeInterval.generate(from, to, options.interval);
    const partitions = intervals.map((interval: TimeInterval) => {
      return this.betweenTime(interval.from, interval.to, {
        includeInferior: true,
        includeSuperior: false,
      });
    });
    return partitions.map((p: TimeSerie, idx: number) => {
      if (p.length() === 0) {
        return p.recreate([[intervals[idx].from.toISOString(), null]]);
      } else if (p.first()[0] !== intervals[idx].from.toISOString()) {
        const newPoint: Point = [intervals[idx].from.toISOString(), null];
        return p.recreate([newPoint].concat(p.toArray()));
      } else {
        return p;
      }
    });
  }

  /**
   * Splits a timeserie into multiple timeseries where each timeserie has
   * a maximum of `options.chunks` points.
   */
  split(options: SplitOptions): TimeSerie[] {
    return chunk(this.toArray(), options.chunks).map((points: Point[]) => {
      return this.recreate(points);
    });
  }

  /**
   * Resample the timeserie using a new time interval and a point aggregation function
   * @param options
   */
  resample(options: ResampleOptions): TimeSerie {
    const from = options.from || this.first()[0];
    if (!from) {
      throw new Error("Cannot infer a lower bound for resample");
    }
    const to = options.to || this.last()[0];
    if (!to) {
      throw new Error("Cannot infer an upper bound for resample");
    }

    return TimeSerie.concat(
      this.partition(options).map((chunk: TimeSerie) => chunk.reduce(options)),
    );
  }

  /**
   * Remove the point at the given time and returns a new serie
   */
  removeAt(time: DateLike): TimeSerie {
    return this.recreate(
      this.data.filter((p: Point) => {
        return p[0] !== DateLikeToString(time);
      }),
    );
  }

  /**
   * Remove the point at the given index and returns a new serie
   */
  removeAtIndex(index: number): TimeSerie {
    return this.recreate(
      this.data.filter((_: Point, i: number) => {
        return i !== index;
      }),
    );
  }

  /**
   * Returns the new timeserie without the removed data. Bounds are removed.
   *
   * @param from start date string in ISO8601 format
   * @param to end date string in ISO8601 format
   */
  removeBetweenTime(from: DateLike, to: DateLike) {
    const f = new Date(from);
    const t = new Date(to);
    const data = this.data.filter((point: Point) => {
      return (
        new Date(point[0]).getTime() < f.getTime() ||
        new Date(point[0]).getTime() > t.getTime()
      );
    });
    return this.recreate(data);
  }

  /**
   * Removes points with NaN value from the serie
   */
  dropNaN(): TimeSerie {
    return this.filter((p: Point) => isNumeric(p[1]));
  }

  /**
   * Removes points with null value from the serie.
   */
  dropNull() {
    return this.filter((p: Point) => p[1] !== null);
  }

  /**
   * Rounds the serie's points.
   * @param decimals {Number} the number of decimals to keep
   * @returns {TimeSerie}
   */
  round(decimals: number) {
    return this.map((p: Point) => [
      p[0],
      Number(Number(p[1]).toFixed(decimals)),
    ]);
  }

  /**
   * Combine the current serie with an array of series y performing combination operations, such as multiplication, addition ecc.
   * @param operation {string}
   * @param series {TimeSerie[]}
   * @param options {TimeSeriesOperationOptions}
   */
  combine(
    operation: string,
    series: TimeSerie[],
    options: TimeSeriesOperationOptions = {},
  ): TimeSerie {
    options.name = options.name || this.name;
    options.metadata = options.metadata || this.metadata;
    return TimeSerie.internals.combine(
      [this.recreate(this.data)].concat(series),
      TimeSerie.internals.combiners[operation],
      options,
    );
  }

  /**
   * Adds values to the timeserie. If a scalar is passed, its value is added to every point in the serie. If another serie
   * is passed, the two series are combined by addition.
   * @see combine
   */
  add(value: number | TimeSerie): TimeSerie {
    if (typeof value === "number") {
      return this.map((point: Point) => [point[0], point[1] + value]);
    } else {
      return this.combine("add", [value]);
    }
  }

  /**
   * Subtracts values from the timeserie. If a scalar is passed, its value is subtracted from every point in the serie. If another serie
   * is passed, the two series are combined by subtraction.
   * @see combine
   */
  sub(value: number | TimeSerie): TimeSerie {
    if (typeof value === "number") {
      return this.map((point: Point) => [point[0], point[1] - value]);
    } else {
      return this.combine("sub", [value]);
    }
  }

  /**
   * Multiplies values of the timeserie. If a scalar is passed, every point in the serie is multiplied times that value. If another serie
   * is passed, the two series are combined by multiplication.
   * @see combine
   */
  mul(value: number | TimeSerie): TimeSerie {
    if (typeof value === "number") {
      return this.map((point: Point) => [point[0], point[1] * value]);
    } else {
      return this.combine("mul", [value]);
    }
  }

  /**
   * Divides values of the timeserie. If a scalar is passed, every point in the serie is divided by that value. If another serie
   * is passed, the two series are combined by division.
   * @see combine
   */
  div(value: number | TimeSerie): TimeSerie {
    if (typeof value === "number") {
      return this.map((point: Point) => [point[0], point[1] / value]);
    } else {
      return this.combine("div", [value]);
    }
  }
}

// Estrae gli indici dalla prima serie o li prende dalle opzioni
// Per ogni elemento dell'indice scorre gli elementi di tutte le timeserie e li combina con una funzione combiner
// Restituisce la funzione
TimeSerie.internals = {};
TimeSerie.internals.combiners = {};
TimeSerie.internals.combine = (
  series: TimeSerie[],
  combiner: TimeseriePointCombiner,
  options: TimeSeriesOperationOptions,
): TimeSerie => {
  const points = series[0].data
    .map((p: Point) => p[0])
    .map((idx: string) => {
      const values = series.map((serie: TimeSerie) =>
        serie.atTime(idx, options.fill),
      );
      return [idx, combiner(values, idx)] as Point;
    });
  return new TimeSerie(options.name, points, options.metadata);
};

TimeSerie.internals.combiners.add = (points: PointValue[]) =>
  points.reduce((a: PointValue, b: PointValue) => a + b, 0);
TimeSerie.internals.combiners.sub = (points: PointValue[]) =>
  points.reduce((a: PointValue, b: PointValue) => a - b, points[0] * 2);
TimeSerie.internals.combiners.mul = (points: PointValue[]) =>
  points.reduce((a: PointValue, b: PointValue) => a * b, 1);
TimeSerie.internals.combiners.div = (points: PointValue[]) =>
  points.reduce((a: PointValue, b: PointValue) => a / b, points[0] * points[0]);
TimeSerie.internals.combiners.avg = (points: PointValue[]) =>
  TimeSerie.internals.combiners.add(points) / points.length;

TimeSerie.createIndex = createIndex;
