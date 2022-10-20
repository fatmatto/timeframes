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

export function getOrderOfMagnitude (n:number):number {
  const order = Math.floor(Math.log(n) / Math.LN10 +
                       0.000000001) // because float math sucks like that
  return Math.pow(10, order)
}
