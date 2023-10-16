import test from 'ava'
import { TimeInterval } from './types'

test('TimeInterval::generate() should generate correct intervals', t => {
  const from = '2022-01-01T00:00:00.000Z'
  const to = '2022-01-01T06:34:00.000Z'
  const size = 1000 * 60 * 60
  const intervals: TimeInterval[] = TimeInterval.generate(from, to, size)
  t.is(intervals[0].from.toISOString(), from)
  t.is(intervals.pop().to.toISOString(), '2022-01-01T07:00:00.000Z')


  const intervals2: TimeInterval[] = TimeInterval.generate('2019-12-31T23:00:00.000Z', '2020-12-31T23:00:00.000Z', { months: 1 })
  t.is(intervals2.length, 12)
})
