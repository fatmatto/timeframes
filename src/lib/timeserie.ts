import makeTree from "functional-red-black-tree";
import {
  BetweenTimeOptions,
  DateLike,
  FromIndexOptions,
  Index,
  InterpolationOptions,
  Metadata,
  PartitionOptions,
  PipelineStage,
  Point,
  PointValue,
  ReindexOptions,
  ResampleOptions,
  SeriePipelineStageType,
  SplitOptions,
  TimeInterval,
  TimeSerieGroupOptions,
  TimeSerieReduceOptions,
  TimeSeriesOperationOptions,
  TimeseriePointCombiner,
  TimeseriePointIterator,
  createIndex
} from "./types";
import {
  DateLikeToString,
  buildIndexTest,
  chunk,
  getBucketKey,
  hasValue,
  hasValueOr,
} from "./utils";

import * as simd from "@fatmatto/simd-array";
import parse from "parse-duration";
import * as Timsort from "timsort";


const reindexWithBackfill = (
  idx: Index,
  serie: TimeSerie,
  fill: any = null,
) => {
  let lastValidValue: any = fill;
  const points = [];
  idx.forEach((i: string) => {
    const v = serie.atTime(i);
    if (v) {
      points.push([i, v]);
      lastValidValue = v;
    } else {
      points.push([i, lastValidValue]);
    }
  });
  return new TimeSerie(serie.name, points, serie.metadata);
};

const reindexWithForwardFill = (
  idx: Index,
  serie: TimeSerie,
  fill: any = null,
) => {
  let firstValidValue: any = fill;
  const points = [];
  const reversedIndex = idx.reverse();
  for (const i of reversedIndex) {
    if (serie.atTime(i)) {
      points.unshift([i, serie.atTime(i)]);
      firstValidValue = serie.atTime(i);
    } else {
      points.unshift([i, firstValidValue]);
    }
  }

  return new TimeSerie(serie.name, points, serie.metadata);
};

function padArray(arr: any[]): any[] {
  const adjustments = [];
  while ((arr.length + adjustments.length) % 8 !== 0) {
    adjustments.push(0);
  }
  const toReturn = arr.concat(adjustments);
  return toReturn;
}

function isNumeric(str: string | number): boolean {
  if (typeof str === "number") return !Number.isNaN(Number(str));
  if (typeof str !== "string") return false; // we only process strings!
  return (
    !Number.isNaN(Number(str)) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !Number.isNaN(Number.parseFloat(str))
  ); // ...and ensure strings of whitespace fail
}

/**
 * Makes sure every point comes with time in the correct format
 */
function normalizeSerie(ts: Point[]): Point[] {
  const o = [];
  for (let i = 0; i < ts.length; i++) {
    o.push([DateLikeToString(ts[i][0]), ts[i][1]]);
  }
  return o;
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
  _indexWasBuilt = false;
  private _indexes: any;

  /**
   * Creates a new timeserie.
   * @param name {String} The name of the serie
   * @param serie {Point[]} The points in the serie
   * @param metadata {Metadata} Optional metadata
   */
  constructor(
    name: string,
    serie: Point[] | ReadonlyArray<Point> = [],
    metadata: Metadata = {},
  ) {
    // PERF hot point: not normalizing leads to big perf increase
    // this.data = sortPoints(serie).map(normalizePoint);
    this.data = normalizeSerie(sortPoints(serie));
    this.name = name;
    this.metadata = metadata;
    this.index = {};
    this._indexes = {
      time: this.data.map((p) => p[0]).sort(),
      tree: null,
    };
  }

  _buildIndex() {
    if (this._indexWasBuilt) {
      return;
    }

    this.data.forEach((p: Point) => {
      this.index[p[0]] = p;
    });
    this._indexWasBuilt = true;
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
    let idx: Index = index;

    if (options.mergeIndexes === true) {
      idx = [...new Set(this.indexes().concat(index))] as Index;
    }
    if (options.fillMethod === "previous") {
      return reindexWithBackfill(idx as Index, this, options?.fill);
    }

    if (options.fillMethod === "next") {
      return reindexWithForwardFill(idx as Index, this, options?.fill);
    }

    return new TimeSerie(
      this.name,
      idx.map((i: string) => {
        return [i, hasValueOr(this.atTime(i), options?.fill || null)];
      }),
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
   * Updates (in place) the serie's name. **This method does NOT return a new timeserie, but the serie itself**.
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
        return hasValue(point[1]);
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
      return hasValue(point[1]);
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
        return hasValue(point[1]);
      });
    if (result) {
      return result[1];
    } else {
      return null;
    }
  }

  /**
   * Returns the latest non-NaN value before a given time
   */
  lastValidAt(time: DateLike): Point {
    const result = this.data
      .concat([])
      .reverse()
      .find((point: Point) => {
        return (
          hasValue(point[1]) &&
          new Date(point[0]).getTime() <= new Date(time).getTime()
        );
      });
    if (result) {
      return result;
    }

    return null;
  }

  /**
   * Returns the first non-NaN value
   */
  firstValidValue(): PointValue {
    const result = this.data.find((point: Point) => {
      return hasValue(point[1]);
    });
    if (result) {
      return result[1];
    }
    return null;
  }

  /**
   * Returns the first non-NaN value after a given time
   */
  firstValidAt(time: DateLike): Point {
    const result = this.data.concat([]).find((point: Point) => {
      return (
        hasValue(point[1]) &&
        new Date(point[0]).getTime() >= new Date(time).getTime()
      );
    });
    if (result) {
      return result;
    } else {
      return null;
    }
  }

  /**
   * Returns the value of the timeseries at the given time
   * @returns {PointValue}
   */
  atTime(time: DateLike, fillValue: number = null): PointValue {
    this._buildIndex();
    return hasValueOr(
      this.index?.[DateLikeToString(time)]?.[1],
      fillValue || null,
    );
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
    this.buildTimeTree();
    const { includeInferior, includeSuperior } = options;
    const f = new Date(from).getTime();
    const t = new Date(to).getTime();
    const goodRows = [];
    const iter = this._indexes.tree.ge(f);
    while (iter && new Date(iter.key).getTime() <= t) {
      if (buildIndexTest(iter.key, f, t, includeSuperior, includeInferior)) {
        const kk = new Date(iter.key).toISOString();
        goodRows.push([kk, this.atTime(kk)]);
      }
      iter.next();
    }
    return this.recreate(goodRows);
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

  private buildTimeTree() {
    if (!this._indexes.tree) {
      let tree = makeTree<DateLike, DateLike>((a: number, b: number) => a - b);
      this._indexes.time.forEach((time: string) => {
        const t = new Date(time).getTime();
        tree = tree.insert(t, t);
      });
      this._indexes.tree = tree;
    }
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
    const arr = new Float32Array(padArray(copy.values()) as number[]);
    const tot = simd.sum_ver(arr);
    return [this.first()[0], tot];
  }

  /**
   * @alias length
   */
  count(): Point {
    return [this.first()[0], this.data.length];
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

  // timeWeightedAvg(): Point {
  //   if (this.length() === 0) {
  //     return [null, null];
  //   }
  //   if (this.length() === 1) {
  //     return this.first();
  //   }
  //   const copy = this.dropNaN().toArray();
  //   const numeratore = copy.map((v: Point) => {
  //     const t = new Date(v[0]).getTime()
  //     return t * v[1]
  //   })
  //   const denominatore = copy.map(v => { return new Date(v[0]).getTime() })
  //   const totNumeratore = simd.sum_ver(new Float32Array(padArray(numeratore) as number[]))
  //   const totDenominatore = simd.sum_ver(new Float32Array(padArray(denominatore) as number[]))
  //   return [this.first()[0], totNumeratore / totDenominatore]
  // }

  /**
   * Returns the difference between the last and the first element by performing last value - first value.
   */
  delta(): Point {
    if (this.length() <= 0) {
      return [null, null];
    }
    const copy = this.dropNaN();
    if (copy.length() === 0) {
      return [this.first()[0], null];
    }
    if (copy.length() === 1) {
      return copy.data[0];
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
   * Returns the last point at or before a given timestamp
   * @param time
   */
  lastAt(time: DateLike): Point {
    return this.data
      .concat([])
      .reverse()
      .find((p: Point) => {
        return new Date(p[0]).getTime() <= new Date(time).getTime();
      });
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

    const intervals =
      typeof options.interval === "number"
        ? TimeInterval.generate(from, to, options.interval)
        : options.interval;
    const partitions = intervals.map((interval: TimeInterval) => {
      return this.betweenTime(interval.from, interval.to, {
        includeInferior: true,
        includeSuperior: false,
      });
    });
    return partitions.map((p: TimeSerie, idx: number) => {
      if (p.length() === 0) {
        return p.recreate([[intervals[idx].from.toISOString(), null]]);
      }

      if (p.first()[0] !== intervals[idx].from.toISOString()) {
        const newPoint: Point = [intervals[idx].from.toISOString(), null];
        return p.recreate([newPoint].concat(p.toArray()));
      }

      return p;
    });
  }

  group(options: TimeSerieGroupOptions): TimeSerie {
    const buckets = {};
    this.data.forEach((point: Point) => {
      const key = getBucketKey(point[0], options.by);
      buckets[key] = buckets[key] || [];
      buckets[key].push(point);
    });

    return TimeSerie.concat(
      Object.entries(buckets).map(([_, points]: [string, Point[]]) =>
        this.recreate(points).reduce(options),
      ),
    );
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

  /**
   * Runs a series of transformations defined as an object. Useful in automation.
   * A stage is an object with a single key and a value, the key is the name of the method, the value is the params object
   * @param stages
   */
  pipeline(stages: PipelineStage[]) {
    return stages.reduce((serie: TimeSerie, stage: PipelineStage) => {
      const fn: SeriePipelineStageType = Object.keys(
        stage,
      )[0] as SeriePipelineStageType;
      return serie[fn](stage[fn] as any);
    }, this);
  }

  /**
   * Pretty prints the serie to the console
   */
  print() {
    console.table(this.data);
  }

  interpolate(options: InterpolationOptions): TimeSerie {
    if (options.method === "linear") {
      return this.linearInterpolation(options);
    }
    throw new Error("Unknown interpolation method");
  }

  private linearInterpolation(options: InterpolationOptions): TimeSerie {
    const data = this.toArray().map((point: Point) => [point[0], point[1]]);

    for (let i = 0; i < data.length; i++) {
      const point = data[i];
      if (!point) {
        continue;
      }

      if (!Number.isNaN(point[1]) && hasValue(point[1])) {
        continue;
      }

      const nextPoint = this.firstValidAt(point[0]);
      const prevPoint = this.lastValidAt(point[0]);

      if (options.limit) {
        const holeSize: number = new Date(nextPoint[0]).getTime() - new Date(prevPoint[0]).getTime();
        const limitMs: number = typeof options.limit === "string" ? parse(options.limit) : options.limit;
        if (holeSize > limitMs) {
          // Hole size is too big, skipping interpolation
          continue;
        }
      }

      if (point[1] === null || point[1] === undefined) {
        const x: number = new Date(point[0]).getTime();
        const x0: number = new Date(prevPoint[0]).getTime();
        const x1: number = new Date(nextPoint[0]).getTime();
        const y0: number = prevPoint[1];
        const y1: number = nextPoint[1];
        const interpolatedValue = (y0 * (x1 - x) + y1 * (x - x0)) / (x1 - x0);
        data[i][1] = interpolatedValue;
      }
    }

    return this.recreate(data.map((item: any[]) => [item[0], item[1]]));
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
  simd.sum_ver(new Float32Array(padArray(points) as number[]));

TimeSerie.internals.combiners.sub = (points: PointValue[]) =>
  points.reduce((a: PointValue, b: PointValue) => a - b, points[0] * 2);
TimeSerie.internals.combiners.mul = (points: PointValue[]) =>
  points.reduce((a: PointValue, b: PointValue) => a * b, 1);
TimeSerie.internals.combiners.div = (points: PointValue[]) =>
  points.reduce((a: PointValue, b: PointValue) => a / b, points[0] * points[0]);
TimeSerie.internals.combiners.avg = (points: PointValue[]) =>
  TimeSerie.internals.combiners.add(points) / points.length;

TimeSerie.createIndex = createIndex;
