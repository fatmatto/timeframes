import type { DateLike, Point, PointValue, Row } from "./types";

export function ms(date: Date | string): number {
	return new Date(date).getTime();
}

export function hasValue(v: PointValue): boolean {
	return v !== null && v !== undefined;
}
export function hasValueOr(
	v: PointValue,
	fallbackValue: PointValue = null,
): PointValue {
	if (hasValue(v)) {
		return v;
	} else {
		return fallbackValue;
	}
}

/**
 * True when `t` is already in the canonical form produced by
 * Date.prototype.toISOString() ("YYYY-MM-DDTHH:mm:ss.sssZ"). For canonical
 * strings, lexicographic order equals chronological order, which lets hot
 * paths compare and search times without allocating Date objects.
 */
export function isCanonicalISO(t: unknown): t is string {
	return (
		typeof t === "string" &&
		t.length === 24 &&
		t.charCodeAt(23) === 90 && // 'Z'
		t.charCodeAt(10) === 84 && // 'T'
		t.charCodeAt(4) === 45 // '-'
	);
}

export function DateLikeToString(d: DateLike): string {
	if (isCanonicalISO(d)) {
		return d;
	}
	return new Date(d).toISOString();
}

/**
 * Binary search over a sorted sequence of canonical ISO timestamps.
 * Returns the first index whose time is >= target (inclusive) or > target
 * (exclusive). `timeAt` abstracts the container (Point[] or string[]).
 */
export function firstIndexAfter(
	length: number,
	timeAt: (i: number) => string,
	target: string,
	inclusive: boolean,
): number {
	let lo = 0;
	let hi = length;
	while (lo < hi) {
		const mid = (lo + hi) >>> 1;
		const t = timeAt(mid);
		if (t < target || (!inclusive && t === target)) {
			lo = mid + 1;
		} else {
			hi = mid;
		}
	}
	return lo;
}

export function DateLikeToTimestamp(d: DateLike): number {
	if (typeof d === "string" && !Number.isNaN(new Date(Number(d)).getTime())) {
		return new Date(Number(d)).getTime();
	}
	return new Date(d).getTime();
}

export function chunk(arr: Point[] | Row[], chunk_size: number) {
	return new Array(Math.ceil(arr.length / chunk_size))
		.fill(0)
		.map((_, i: number) => arr.slice(i * chunk_size, (i + 1) * chunk_size));
}

/**
 * Returns the calendar bucket a timestamp belongs to, computed in UTC and
 * composed with every coarser period so buckets never collide across
 * years/months/days: "2021" | "2021-01" | "2021-01-15" | "2021-01-15T10".
 */
export function getBucketKey(ts: DateLike, by: string): string {
	const iso = DateLikeToString(ts);
	if (by === "year") {
		return iso.slice(0, 4);
	} else if (by === "month") {
		return iso.slice(0, 7);
	} else if (by === "day") {
		return iso.slice(0, 10);
	} else if (by === "hour") {
		return iso.slice(0, 13);
	} else {
		throw new Error("Unknown bucket key");
	}
}
