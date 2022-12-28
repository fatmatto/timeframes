import { DateLike } from "./types";

export function ms(date: Date | string): number {
  return new Date(date).getTime();
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

export function chunk(arr: any[], chunk_size: number) {
  return new Array(Math.ceil(arr.length / chunk_size))
    .fill(0)
    .map((_, i: number) => arr.slice(i * chunk_size, (i + 1) * chunk_size));
}
