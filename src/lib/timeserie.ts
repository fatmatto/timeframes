import parse from "parse-duration";
import {
	type BetweenTimeOptions,
	createIndex,
	type DateLike,
	type FromIndexOptions,
	type Index,
	type InterpolationOptions,
	type Metadata,
	type PartitionOptions,
	type PipelineStage,
	type Point,
	type PointValue,
	type ReindexOptions,
	type ResampleOptions,
	type SeriePipelineStageType,
	type SplitOptions,
	TimeInterval,
	type TimeSerieGroupOptions,
	type TimeSerieReduceOptions,
	type TimeSeriesOperationOptions,
	type TimeseriePointCombiner,
	type TimeseriePointIterator,
} from "./types";
import {
	chunk,
	DateLikeToString,
	firstIndexAfter,
	getBucketKey,
	hasValue,
	hasValueOr,
	isCanonicalISO,
} from "./utils";

const reindexWithBackfill = (
	idx: Index,
	serie: TimeSerie,
	fill: any = null,
) => {
	let lastValidValue: any = fill;
	const points = [];
	idx.forEach((i: string) => {
		const v = serie.atTime(i);
		if (hasValue(v)) {
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
	let nextValidValue: any = fill;
	const points = new Array(idx.length);
	for (let i = idx.length - 1; i >= 0; i--) {
		const time = idx[i];
		const v = serie.atTime(time);
		if (hasValue(v)) {
			points[i] = [time, v];
			nextValidValue = v;
		} else {
			points[i] = [time, nextValidValue];
		}
	}

	return new TimeSerie(serie.name, points, serie.metadata);
};

function isNumeric(str: string | number): boolean {
	if (typeof str === "number") return !Number.isNaN(Number(str));
	if (typeof str !== "string") return false; // we only process strings!
	return (
		!Number.isNaN(Number(str)) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
		!Number.isNaN(Number.parseFloat(str))
	); // ...and ensure strings of whitespace fail
}

/**
 * Normalizes points to canonical ISO timestamps, sorted chronologically.
 * Once stored, every timestamp is a canonical ISO string, so lexicographic
 * comparisons are chronological and the fast path below never allocates a
 * Date: input that is already canonical and sorted (every internally derived
 * serie) is just copied.
 */
function buildSerieData(serie: Point[] | ReadonlyArray<Point>): Point[] {
	const n = serie.length;
	let canonical = true;
	let sorted = true;
	let prev = "";
	for (let i = 0; i < n; i++) {
		const t = serie[i][0] as string;
		if (!isCanonicalISO(t)) {
			canonical = false;
			break;
		}
		if (t < prev) {
			sorted = false;
		}
		prev = t;
	}

	const out: Point[] = new Array(n);
	if (canonical) {
		for (let i = 0; i < n; i++) {
			out[i] = [serie[i][0], serie[i][1]];
		}
		if (!sorted) {
			out.sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0));
		}
		return out;
	}

	// Mixed or non-canonical input: order by epoch milliseconds, then render
	// canonical strings. Sorting on numbers keeps mixed formats and non-UTC
	// offsets chronological.
	const decorated: Array<[number, PointValue]> = new Array(n);
	for (let i = 0; i < n; i++) {
		decorated[i] = [new Date(serie[i][0]).getTime(), serie[i][1]];
	}
	decorated.sort((a, b) => a[0] - b[0]);
	for (let i = 0; i < n; i++) {
		out[i] = [new Date(decorated[i][0]).toISOString(), decorated[i][1]];
	}
	return out;
}

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
		this.data = buildSerieData(serie);
		this.name = name;
		this.metadata = metadata;
		this.index = {};
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
	reindex(index: Index, options: ReindexOptions = {}): TimeSerie {
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
				return [i, this.atTime(i, options.fill)];
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
		for (let i = this.data.length - 1; i >= 0; i--) {
			if (hasValue(this.data[i][1])) {
				return this.data[i][0];
			}
		}
		return null;
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
		for (let i = this.data.length - 1; i >= 0; i--) {
			if (hasValue(this.data[i][1])) {
				return this.data[i][1];
			}
		}
		return null;
	}

	/**
	 * Returns the latest non-NaN value before a given time
	 */
	lastValidAt(time: DateLike): Point {
		const iso = DateLikeToString(time);
		const timeAt = (i: number) => this.data[i][0];
		// last index whose time is <= iso, then walk back to a valid value
		for (
			let i = firstIndexAfter(this.data.length, timeAt, iso, false) - 1;
			i >= 0;
			i--
		) {
			if (hasValue(this.data[i][1])) {
				return this.data[i];
			}
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
		const iso = DateLikeToString(time);
		const timeAt = (i: number) => this.data[i][0];
		for (
			let i = firstIndexAfter(this.data.length, timeAt, iso, true);
			i < this.data.length;
			i++
		) {
			if (hasValue(this.data[i][1])) {
				return this.data[i];
			}
		}
		return null;
	}

	/**
	 * Returns the value of the timeseries at the given time
	 * @returns {PointValue}
	 */
	atTime(time: DateLike, fillValue: PointValue = null): PointValue {
		this._buildIndex();
		return hasValueOr(this.index?.[DateLikeToString(time)]?.[1], fillValue);
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
		const isoFrom = DateLikeToString(from);
		const isoTo = DateLikeToString(to);
		const timeAt = (i: number) => this.data[i][0];
		const start = firstIndexAfter(
			this.data.length,
			timeAt,
			isoFrom,
			includeInferior,
		);
		const end = firstIndexAfter(
			this.data.length,
			timeAt,
			isoTo,
			!includeSuperior,
		);
		return this.recreate(this.data.slice(start, end));
	}

	/**
	 * Returns the subset of points between the two indexes. Extremes are included.
	 *
	 * @param from start positional index
	 * @param to end positional index
	 */
	betweenIndexes(from: number, to: number) {
		return this.recreate(this.data.slice(Math.max(0, from), to + 1));
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
		let tot = 0;
		for (const p of this.data) {
			if (isNumeric(p[1])) {
				tot += Number(p[1]);
			}
		}
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
		const iso = DateLikeToString(time);
		const timeAt = (i: number) => this.data[i][0];
		return this.data[firstIndexAfter(this.data.length, timeAt, iso, true)];
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
		const iso = DateLikeToString(time);
		const timeAt = (i: number) => this.data[i][0];
		return this.data[firstIndexAfter(this.data.length, timeAt, iso, false) - 1];
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
		const from = options.from || this.first()?.[0];
		if (!from) {
			throw new Error("Cannot infer a lower bound for resample");
		}
		const to = options.to || this.last()?.[0];
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
			[this as TimeSerie].concat(series),
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
		const isMissing = (v: PointValue) =>
			!hasValue(v) || (typeof v === "number" && Number.isNaN(v));
		const limitMs: number | null = hasValue(options.limit)
			? typeof options.limit === "string"
				? parse(options.limit)
				: (options.limit as number)
			: null;

		const n = this.data.length;
		const out: Point[] = new Array(n);
		let prevValid = -1;
		let nextValid = -1;
		// Hole parameters, computed once per hole
		let x0 = 0;
		let x1 = 0;
		let y0 = 0;
		let y1 = 0;
		let holeTooBig = false;
		for (let i = 0; i < n; i++) {
			const time = this.data[i][0];
			const value = this.data[i][1];
			if (!isMissing(value)) {
				out[i] = [time, value];
				prevValid = i;
				continue;
			}
			if (nextValid <= i) {
				nextValid = i + 1;
				while (nextValid < n && isMissing(this.data[nextValid][1])) {
					nextValid++;
				}
				if (prevValid !== -1 && nextValid < n) {
					x0 = new Date(this.data[prevValid][0]).getTime();
					x1 = new Date(this.data[nextValid][0]).getTime();
					y0 = this.data[prevValid][1] as number;
					y1 = this.data[nextValid][1] as number;
					holeTooBig = limitMs !== null && x1 - x0 > limitMs;
				}
			}
			// Boundary holes (no valid neighbor on one side) and holes wider
			// than the limit are left untouched
			if (prevValid === -1 || nextValid >= n || holeTooBig) {
				out[i] = [time, value];
				continue;
			}
			const x = new Date(time).getTime();
			out[i] = [time, (y0 * (x1 - x) + y1 * (x - x0)) / (x1 - x0)];
		}

		return this.recreate(out);
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
	// Every serie's data is sorted on canonical ISO timestamps, so values are
	// aligned with a linear merge-walk (one cursor per serie) instead of
	// per-point hash lookups.
	const base = series[0].data;
	const fill = hasValueOr(options.fill, null);
	const cursors = new Array(series.length).fill(0);
	const points: Point[] = new Array(base.length);
	for (let i = 0; i < base.length; i++) {
		const time = base[i][0];
		const values = new Array(series.length);
		for (let s = 0; s < series.length; s++) {
			const data = series[s].data;
			let c = cursors[s];
			while (c < data.length && data[c][0] < time) {
				c++;
			}
			cursors[s] = c;
			values[s] =
				c < data.length && data[c][0] === time
					? hasValueOr(data[c][1], fill)
					: fill;
		}
		points[i] = [time, combiner(values, time)];
	}
	return new TimeSerie(options.name, points, options.metadata);
};

TimeSerie.internals.combiners.add = (points: PointValue[]) => {
	let tot = 0;
	for (let i = 0; i < points.length; i++) {
		tot += Number(points[i]);
	}
	return tot;
};

TimeSerie.internals.combiners.sub = (points: PointValue[]) => {
	let acc = Number(points[0]);
	for (let i = 1; i < points.length; i++) {
		acc -= Number(points[i]);
	}
	return acc;
};
TimeSerie.internals.combiners.mul = (points: PointValue[]) =>
	points.reduce((a: PointValue, b: PointValue) => a * b, 1);
TimeSerie.internals.combiners.div = (points: PointValue[]) => {
	let acc = Number(points[0]);
	for (let i = 1; i < points.length; i++) {
		acc /= Number(points[i]);
	}
	return acc;
};
TimeSerie.internals.combiners.avg = (points: PointValue[]) =>
	TimeSerie.internals.combiners.add(points) / points.length;

TimeSerie.createIndex = createIndex;
