import { DateLike, Point, PointValue, Row } from "./types";

export function ms(date: Date | string): number {
  return new Date(date).getTime();
}

export function hasValue(v: PointValue): boolean {
  return v !== null && v !== undefined
}
export function hasValueOr(v: PointValue, fallbackValue: PointValue = null): PointValue {
  if (hasValue(v)) {
    return v
  } else {
    return fallbackValue
  }
}

export function DateLikeToString(d: DateLike): string {
  // if (typeof d === "string" && !isNaN(new Date(Number(d)).getTime())) {
  //   return new Date(Number(d)).toISOString();
  // }
  return new Date(d).toISOString();
}

export function DateLikeToTimestamp(d: DateLike): number {
  if (typeof d === "string" && !isNaN(new Date(Number(d)).getTime())) {
    return new Date(Number(d)).getTime();
  }
  return new Date(d).getTime();
}

export function chunk(arr: Point[] | Row[], chunk_size: number) {
  return new Array(Math.ceil(arr.length / chunk_size))
    .fill(0)
    .map((_, i: number) => arr.slice(i * chunk_size, (i + 1) * chunk_size));
}


export function buildIndexTest(r, f, t, includeSuperior, includeInferior) {
  if (includeInferior && includeSuperior) {
    return r >= f && r <= t;
  } else if (includeInferior && !includeSuperior) {
    return r >= f && r < t;
  } else if (!includeInferior && includeSuperior) {
    return r > f && r <= t;
  } else {
    return r > f && r < t;
  }
};

export function getBucketKey(ts: DateLike, by: string) {
  if (by === 'year') { return new Date(ts).getFullYear() }
  else if (by === 'month') { return new Date(ts).getMonth() }
  else if (by === 'day') { return new Date(ts).getDay() }
  else if (by === 'hour') { return new Date(ts).getHours() }
  else { throw new Error("Unknown bucket key") }
}