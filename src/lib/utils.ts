import { DateLike } from "./types"

export function ms(date: Date | string) : number {
  return new Date(date).getTime()
}

export function DateLikeToString(d: DateLike) : string {
  return new Date(d).toISOString()
}
