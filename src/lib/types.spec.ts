import test from 'ava'
import { TimeInterval } from './types'

test('TimeInterval::generate() should generate correct intervals', t => {
  const from = '2022-01-01T00:00:00.000Z'
  const to = '2022-01-01T06:34:00.000Z'
  const size = 1000 * 60 * 15
  const intervals: TimeInterval[] = TimeInterval.generate(from, to, size)

  t.is(intervals[0].from.toISOString(), from)
  t.is(intervals.pop().to.toISOString(), '2022-01-01T06:45:00.000Z')
})
