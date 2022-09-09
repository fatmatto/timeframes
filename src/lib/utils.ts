import { DateLike } from './types'

export function ms (date: Date | string): number {
  return new Date(date).getTime()
}

export function DateLikeToString (d: DateLike): string {
  if (typeof d === 'string' && !isNaN(new Date(Number(d)).getTime())) {
    return new Date(Number(d)).toISOString()
  }
  return new Date(d).toISOString()
}

export function DateLikeToTimestamp (d: DateLike): number {
  if (typeof d === 'string' && !isNaN(new Date(Number(d)).getTime())) {
    return new Date(Number(d)).getTime()
  }
  return new Date(d).getTime()
}
