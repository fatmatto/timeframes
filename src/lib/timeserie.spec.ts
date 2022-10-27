import test from 'ava'

import { TimeSerie } from './timeserie'
import { Point } from './types'

test('TimeSerie.atTime() should return the correct point or null', (t) => {
  const data: Point[] = [
    ['2021-01-01T00:00:00.000Z', 4],
    ['2021-01-02T00:00:00.000Z', 5],
    ['2021-01-03T00:00:00.000Z', 6]
  ]
  const ts = new TimeSerie('energy', data)

  t.is(ts.atTime('2021-01-02T00:00:00.000Z'), 5)
  t.is(ts.atTime('2021-01-22T00:00:00.000Z'), null)
})

test('TimeSerie.atIndex() should return the correct point', (t) => {
  const data: Point[] = [
    ['2021-01-01T00:00:00.000Z', 4],
    ['2021-01-02T00:00:00.000Z', 5],
    ['2021-01-03T00:00:00.000Z', 6]
  ]
  const ts = new TimeSerie('energy', data)

  t.is(ts.atIndex(1), 5)
})

test('TimeSerie.atIndex() should throw when the index is out of bounds', (t) => {
  const data: Point[] = [
    ['2021-01-01T00:00:00.000Z', 4],
    ['2021-01-02T00:00:00.000Z', 5],
    ['2021-01-03T00:00:00.000Z', 6]
  ]
  const ts = new TimeSerie('energy', data)

  t.throws(() => {
    ts.atIndex(100)
  })
})

test('TimeSerie.toArray() should return the whole data', (t) => {
  const data: Point[] = [
    ['2021-01-01T00:00:00.000Z', 4],
    ['2021-01-02T00:00:00.000Z', 5],
    ['2021-01-03T00:00:00.000Z', 6]
  ]
  const ts = new TimeSerie('energy', data)
  t.deepEqual(data, ts.toArray())
})

test('TimeSerie.firstValidIndex() should return the first valid value index', (t) => {
  const data: Point[] = [
    ['2021-01-01T00:00:00.000Z', null],
    ['2021-01-02T00:00:00.000Z', null],
    ['2021-01-03T00:00:00.000Z', 6],
    ['2021-01-04T00:00:00.000Z', 7],
    ['2021-01-05T00:00:00.000Z', 8],
    ['2021-01-06T00:00:00.000Z', null]
  ]
  const ts = new TimeSerie('energy', data)

  t.is(ts.firstValidIndex(), '2021-01-03T00:00:00.000Z')
})

test('TimeSerie.lastValidIndex() should return the last valid value index', (t) => {
  const data: Point[] = [
    ['2021-01-01', null],
    ['2021-01-02', null],
    ['2021-01-03', 6],
    ['2021-01-04', 7],
    ['2021-01-05', 8],
    ['2021-01-06', null]
  ]
  const ts = new TimeSerie('energy', data)

  t.is(ts.lastValidIndex(), '2021-01-05T00:00:00.000Z')
})

test('TimeSerie.firstValidValue() should return the first valid value index or null', (t) => {
  const data: Point[] = [
    ['2021-01-01', null],
    ['2021-01-02', null],
    ['2021-01-03', 6],
    ['2021-01-04', 7],
    ['2021-01-05', 8],
    ['2021-01-06', null]
  ]
  const ts = new TimeSerie('energy', data)

  t.is(ts.firstValidValue(), 6)

  const data2: Point[] = [
    ['2021-01-01', null],
    ['2021-01-02', null]
  ]
  const ts2 = new TimeSerie('energy2', data2)
  t.is(ts2.firstValidValue(), null)
})

test('TimeSerie.lastValidValue() should return the last valid value index', (t) => {
  const data: Point[] = [
    ['2021-01-01', null],
    ['2021-01-02', null],
    ['2021-01-03', 6],
    ['2021-01-04', 7],
    ['2021-01-05', 8],
    ['2021-01-06', null]
  ]
  const ts = new TimeSerie('energy', data)

  t.is(ts.lastValidValue(), 8)
})

test('TimeSerie.betweenTime() should return the correct timeserie subset', (t) => {
  const data: Point[] = [
    ['2021-01-01', 4],
    ['2021-01-02', 5],
    ['2021-01-03', 6],
    ['2021-01-04', 7],
    ['2021-01-05', 8],
    ['2021-01-06', 9]
  ]
  const ts = new TimeSerie('energy', data)

  const subset = ts.betweenTime('2021-01-03', '2021-01-05')

  t.is(subset.length(), 3)
  t.is(subset.firstValidValue(), 6)
  t.is(subset.lastValidValue(), 8)
})

test('TimeSerie.filter() should allow to pass custom filtering logic', (t) => {
  const data: Point[] = [
    ['2021-01-01', 4],
    ['2021-01-02', 5],
    ['2021-01-03', 6],
    ['2021-01-04', 7],
    ['2021-01-05', 8],
    ['2021-01-06', 9]
  ]
  const ts = new TimeSerie('energy', data)

  const filtered = ts.filter((p: Point) => {
    return p[1] % 2 === 0
  })

  t.is(filtered.length(), 3)
  t.is(filtered.firstValidValue(), 4)
  t.is(filtered.lastValidValue(), 8)
})

test('TimeSerie.map() should allow to pass custom mapping logic', (t) => {
  const data: Point[] = [
    ['2021-01-01', 4],
    ['2021-01-02', 5],
    ['2021-01-03', 6],
    ['2021-01-04', 7],
    ['2021-01-05', 8],
    ['2021-01-06', 9]
  ]
  const ts = new TimeSerie('energy', data)

  const mapped = ts.map((p: Point) => {
    return [p[0], p[1] * 2]
  })

  t.is(mapped.length(), ts.length())
  t.is(mapped.firstValidValue(), 8)
  t.is(mapped.lastValidValue(), 18)
})

test('TimeSerie.isEmpty() should behave correctly', (t) => {
  const data: Point[] = [
    ['2021-01-01', 4]
  ]
  const ts1 = new TimeSerie('energy', data)
  const ts2 = new TimeSerie('energy', [])

  t.is(ts1.isEmpty(), false)
  t.is(ts2.isEmpty(), true)
})

test('Timeserie.sum() should return the sum of the values', (t) => {
  const data: Point[] = [
    ['2021-01-01', 4],
    ['2021-01-02', 5],
    ['2021-01-03', 6],
    ['2021-01-04', 7],
    ['2021-01-05', 8],
    ['2021-01-06', 9]
  ]
  const ts = new TimeSerie('energy', data)
  t.is(ts.sum(), 39)
})

test('Timeserie.avg() should return the average of the values', (t) => {
  const data: Point[] = [
    ['2021-01-01', 4],
    ['2021-01-02', 4],
    ['2021-01-03', 8],
    ['2021-01-04', 8]
  ]
  const ts = new TimeSerie('energy', data)
  t.is(ts.avg(), 6)
})

test('Timeserie.first() should return the first point or null', (t) => {
  const ts1 = new TimeSerie('ts1', [['2021-01-01', 4]])
  const ts2 = new TimeSerie('ts2', [])
  t.is(ts1.first()[1], 4)
  t.is(ts2.first(), null)
})

test('Timeserie.firstAt() should return the first point with time >= the given', (t) => {
  const data: Point[] = [
    ['2021-01-01', 4],
    ['2021-01-02', 4],
    ['2021-01-04', 8],
    ['2021-01-05', 8]
  ]
  const ts = new TimeSerie('energy', data)
  t.is(ts.firstAt('2021-01-02')[1], 4)
  t.is(ts.firstAt('2021-01-03')[1], 8)
})

test('Timeserie.last() should return the last point or null', (t) => {
  const ts1 = new TimeSerie('ts1', [['2021-01-01', 4], ['2021-01-02', 5]])
  const ts2 = new TimeSerie('ts2', [])
  t.is(ts1.last()[1], 5)
  t.is(ts2.last(), null)
})

test('Timeserie.max() should return the point with maximum value', (t) => {
  const data: Point[] = [
    ['2021-01-01', 4],
    ['2021-01-02', 11],
    ['2021-01-04', 8],
    ['2021-01-05', 8]
  ]
  const ts = new TimeSerie('energy', data)
  t.is(ts.max()[1], 11)
})

test('Timeserie.min() should return the point with minimum value', (t) => {
  const data: Point[] = [
    ['2021-01-01', 4],
    ['2021-01-02', 11],
    ['2021-01-04', 8],
    ['2021-01-05', 8]
  ]
  const ts = new TimeSerie('energy', data)
  t.is(ts.min()[1], 4)
})

test('Timeserie.resample().sum() should provide the correct timeserie', (t) => {
  const data: Point[] = [
    ['2021-01-01T12:00:00.000Z', 4],
    ['2021-01-01T20:00:00.000Z', 4],
    ['2021-01-02T12:00:00.000Z', 4],
    ['2021-01-02T20:00:00.000Z', 4],
    ['2021-01-03T12:00:00.000Z', 4],
    ['2021-01-03T13:00:00.000Z', 4],
    ['2021-01-03T20:00:00.000Z', 4],
    ['2021-01-04T12:00:00.000Z', 4],
    ['2021-01-04T16:00:00.000Z', 4],
    ['2021-01-04T20:00:00.000Z', 4]
  ]

  const ts = new TimeSerie('energy', data)
  const daily = ts.resample({ interval: 1000 * 60 * 60 * 24 }).sum()

  t.is(daily.length(), 4)
  t.is(daily.atIndex(0), 8)
  t.is(daily.atIndex(1), 8)
  t.is(daily.atIndex(2), 12)
  t.is(daily.atIndex(3), 12)
})

test('Timeserie.resample().avg() should provide the correct timeserie', (t) => {
  const data: Point[] = [
    ['2021-01-01T12:00:00.000Z', 4],
    ['2021-01-01T20:00:00.000Z', 4],
    ['2021-01-02T12:00:00.000Z', 4],
    ['2021-01-02T20:00:00.000Z', 4],
    ['2021-01-03T12:00:00.000Z', 4],
    ['2021-01-03T13:00:00.000Z', 4],
    ['2021-01-03T20:00:00.000Z', 4],
    ['2021-01-04T12:00:00.000Z', 4],
    ['2021-01-04T16:00:00.000Z', 4],
    ['2021-01-04T20:00:00.000Z', 4]
  ]

  const ts = new TimeSerie('energy', data)
  const daily = ts.resample({ interval: 1000 * 60 * 60 * 24 }).avg()

  t.is(daily.length(), 4)
  t.is(daily.atIndex(0), 4)
  t.is(daily.atIndex(1), 4)
  t.is(daily.atIndex(2), 4)
  t.is(daily.atIndex(3), 4)
})

test('Timeserie.resample().first() should provide the correct timeserie', (t) => {
  const data: Point[] = [
    ['2021-01-01T12:00:00.000Z', 1],
    ['2021-01-01T20:00:00.000Z', 2],
    ['2021-01-02T12:00:00.000Z', 1],
    ['2021-01-02T20:00:00.000Z', 2],
    ['2021-01-03T12:00:00.000Z', 1],
    ['2021-01-03T13:00:00.000Z', 2],
    ['2021-01-03T20:00:00.000Z', 3],
    ['2021-01-04T12:00:00.000Z', 1],
    ['2021-01-04T16:00:00.000Z', 2],
    ['2021-01-04T20:00:00.000Z', 3]
  ]

  const ts = new TimeSerie('energy', data)
  const daily = ts.resample({ interval: 1000 * 60 * 60 * 24 }).first()

  t.is(daily.length(), 4)
  t.is(daily.atIndex(0), 1)
  t.is(daily.atIndex(1), 1)
  t.is(daily.atIndex(2), 1)
  t.is(daily.atIndex(3), 1)
})

test('Timeserie.resample().last() should provide the correct timeserie', (t) => {
  const data: Point[] = [
    ['2021-01-01T12:00:00.000Z', 1],
    ['2021-01-01T20:00:00.000Z', 2],
    ['2021-01-02T12:00:00.000Z', 1],
    ['2021-01-02T20:00:00.000Z', 2],
    ['2021-01-03T12:00:00.000Z', 1],
    ['2021-01-03T13:00:00.000Z', 2],
    ['2021-01-03T20:00:00.000Z', 3],
    ['2021-01-04T12:00:00.000Z', 1],
    ['2021-01-04T16:00:00.000Z', 2],
    ['2021-01-04T20:00:00.000Z', 3]
  ]

  const ts = new TimeSerie('energy', data)
  const daily = ts.resample({ interval: 1000 * 60 * 60 * 24 }).last()

  t.is(daily.length(), 4)
  t.is(daily.atIndex(0), 2)
  t.is(daily.atIndex(1), 2)
  t.is(daily.atIndex(2), 3)
  t.is(daily.atIndex(3), 3)
})

test('Timeserie.resample().max() should provide the correct timeserie', (t) => {
  const data: Point[] = [
    ['2021-01-01T12:00:00.000Z', 1],
    ['2021-01-01T20:00:00.000Z', 2],
    ['2021-01-02T12:00:00.000Z', 4],
    ['2021-01-02T20:00:00.000Z', 2],
    ['2021-01-03T12:00:00.000Z', 8],
    ['2021-01-03T13:00:00.000Z', 11],
    ['2021-01-03T20:00:00.000Z', 3],
    ['2021-01-04T12:00:00.000Z', 100],
    ['2021-01-04T16:00:00.000Z', 2],
    ['2021-01-04T20:00:00.000Z', 3]
  ]

  const ts = new TimeSerie('energy', data)
  const daily = ts.resample({ interval: 1000 * 60 * 60 * 24 }).max()

  t.is(daily.length(), 4)
  t.is(daily.atIndex(0), 2)
  t.is(daily.atIndex(1), 4)
  t.is(daily.atIndex(2), 11)
  t.is(daily.atIndex(3), 100)
})

test('Timeserie.resample().min() should provide the correct timeserie', (t) => {
  const data: Point[] = [
    ['2021-01-01T12:00:00.000Z', 1],
    ['2021-01-01T20:00:00.000Z', 2],
    ['2021-01-02T12:00:00.000Z', 4],
    ['2021-01-02T20:00:00.000Z', 2],
    ['2021-01-03T12:00:00.000Z', 8],
    ['2021-01-03T13:00:00.000Z', 11],
    ['2021-01-03T20:00:00.000Z', 3],
    ['2021-01-04T12:00:00.000Z', 100],
    ['2021-01-04T16:00:00.000Z', 2],
    ['2021-01-04T20:00:00.000Z', 3]
  ]

  const ts = new TimeSerie('energy', data)
  const daily = ts.resample({ interval: 1000 * 60 * 60 * 24 }).min()

  t.is(daily.length(), 4)
  t.is(daily.atIndex(0), 1)
  t.is(daily.atIndex(1), 2)
  t.is(daily.atIndex(2), 3)
  t.is(daily.atIndex(3), 2)
})

test('Timeserie.resample().delta() should provide the correct timeserie', (t) => {
  const data: Point[] = [
    ['2021-01-01T12:00:00.000Z', 1],
    ['2021-01-01T20:00:00.000Z', 2],
    ['2021-01-02T12:00:00.000Z', 3],
    ['2021-01-02T20:00:00.000Z', 4],
    ['2021-01-03T12:00:00.000Z', 5],
    ['2021-01-03T13:00:00.000Z', 8],
    ['2021-01-03T20:00:00.000Z', 9],
    ['2021-01-04T12:00:00.000Z', 10],
    ['2021-01-04T16:00:00.000Z', 12],
    ['2021-01-04T20:00:00.000Z', 15]
  ]

  const ts = new TimeSerie('energy', data)
  const daily = ts.resample({ interval: 1000 * 60 * 60 * 24 }).delta()
  t.is(daily.length(), 4)
  t.is(daily.data[0][0], data[0][0]) // The resampling should start at the first time index
  t.is(daily.atIndex(0), 1)
  t.is(daily.atIndex(1), 1)
  t.is(daily.atIndex(2), 4)
  t.is(daily.atIndex(3), 5)
})

test('Timeserie.removeAt() should remove points from the timeserie', (t) => {
  const data: Point[] = [
    ['2021-01-01T00:00:00.000Z', 1],
    ['2021-01-02T00:00:00.000Z', 2],
    ['2021-01-03T00:00:00.000Z', 3],
    ['2021-01-04T00:00:00.000Z', 4]
  ]

  const ts = new TimeSerie('energy', data)
  const filtered = ts.removeAt('2021-01-03T00:00:00.000Z')

  t.is(filtered.length(), 3)
  t.is(filtered.atIndex(2), 4)
})

test('Timeserie.removeAtIndex() should remove points from the timeserie', (t) => {
  const data: Point[] = [
    ['2021-01-01T00:00:00.000Z', 1],
    ['2021-01-02T00:00:00.000Z', 2],
    ['2021-01-03T00:00:00.000Z', 3],
    ['2021-01-04T00:00:00.000Z', 4]
  ]

  const ts = new TimeSerie('energy', data)
  const filtered = ts.removeAtIndex(0)

  t.is(filtered.length(), 3)
  t.is(filtered.atIndex(0), 2)
})

test('Timeserie.removeBetweenTime() should remove points from the timeserie', (t) => {
  const data: Point[] = [
    ['2021-01-01T00:00:00.000Z', 1],
    ['2021-01-02T00:00:00.000Z', 2],
    ['2021-01-03T00:00:00.000Z', 3],
    ['2021-01-04T00:00:00.000Z', 4]
  ]

  const ts = new TimeSerie('energy', data)
  const filtered = ts.removeBetweenTime('2021-01-02T00:00:00.000Z', '2021-01-03T00:00:00.000Z')

  t.is(filtered.length(), 2)
  t.is(filtered.atIndex(1), 4)
})

test('Timeserie.dropNaN() should remove points from the timeserie', (t) => {
  const data: Point[] = [
    ['2021-01-01T00:00:00.000Z', 1],
    ['2021-01-01T00:00:00.000Z', NaN],
    ['2021-01-02T00:00:00.000Z', 'hello'],
    ['2021-01-03T00:00:00.000Z', {}],
    ['2021-01-04T00:00:00.000Z', 4]
  ]

  const ts = new TimeSerie('energy', data)
  const filtered = ts.dropNaN()

  t.is(filtered.length(), 2)
  t.is(filtered.atIndex(1), 4)
})

test('Timeserie.dropNull() should remove points from the timeserie', (t) => {
  const data: Point[] = [
    ['2021-01-01T00:00:00.000Z', 1],
    ['2021-01-02T00:00:00.000Z', 'hello'],
    ['2021-01-03T00:00:00.000Z', null],
    ['2021-01-04T00:00:00.000Z', 4]
  ]

  const ts = new TimeSerie('energy', data)
  const filtered = ts.dropNull()

  t.is(filtered.length(), 3)
  t.is(filtered.atIndex(1), 'hello')
  t.is(filtered.atIndex(2), 4)
})

test('Timeserie.indexes() and Timeserie.values() should return correct values', (t) => {
  const data: Point[] = [
    ['2021-01-01T00:00:00.000Z', 1],
    ['2021-01-02T00:00:00.000Z', 'hello']
  ]

  const ts = new TimeSerie('energy', data)
  const indexes = ts.indexes()
  const values = ts.values()

  t.is(indexes[0], '2021-01-01T00:00:00.000Z')
  t.is(indexes[1], '2021-01-02T00:00:00.000Z')
  t.is(values[0], 1)
  t.is(values[1], 'hello')
})

test('Timeserie.reindex() should correctly replace the series index', (t) => {
  const data: Point[] = [
    ['2021-01-01T00:00:00.000Z', 1],
    ['2021-01-02T00:00:00.000Z', 2]
  ]

  const ts = new TimeSerie('energy', data)

  const reindexed = ts.reindex(TimeSerie.createIndex({ from: ts.firstValidIndex(), to: ts.lastValidIndex(), interval: '1h' }), { fill: 0 })
  t.is(reindexed.length(), 25)
})

test('Timeserie.fromIndex() should correctly create the series', (t) => {
  const idx = TimeSerie.createIndex({ from: '2022-01-01', to: '2022-01-01T23:00:00.000Z', interval: '1h' })
  const ts = TimeSerie.fromIndex(idx, { fill: 1, name: 'ts' })

  t.is(ts.length(), 24)
  t.is(true, ts.toArray().every((item:Point) => item[1] === 1))
})

test('Timeserie.combine() should correctly combine the series', (t) => {
  const idx = TimeSerie.createIndex({ from: '2022-01-01', to: '2022-01-01T23:00:00.000Z', interval: '1h' })
  const ts1 = TimeSerie.fromIndex(idx, { fill: 1, name: 'ts1' })
  const ts2 = TimeSerie.fromIndex(idx, { fill: 2, name: 'ts2' })
  const result = ts1.combine('add', [ts2])

  t.is(result.length(), ts1.length())
  t.is(true, result.toArray().every((item:Point) => item[1] === 3))
})

test('Timeserie.add() should correctly add the series to numbers and other series', (t) => {
  const idx = TimeSerie.createIndex({ from: '2022-01-01', to: '2022-01-01T23:00:00.000Z', interval: '1h' })
  const ts1 = TimeSerie.fromIndex(idx, { fill: 1, name: 'ts1' })
  const ts2 = TimeSerie.fromIndex(idx, { fill: 2, name: 'ts2' })
  const ts3 = ts1.add(ts2).add(7)

  t.is(ts3.length(), ts1.length())
  t.is(true, ts3.toArray().every((item:Point) => item[1] === 10))
})

test('Timeserie.sub() should correctly diff the series to numbers and other series', (t) => {
  const idx = TimeSerie.createIndex({ from: '2022-01-01', to: '2022-01-01T23:00:00.000Z', interval: '1h' })
  const ts1 = TimeSerie.fromIndex(idx, { fill: 8, name: 'ts1' })
  const ts2 = TimeSerie.fromIndex(idx, { fill: 4, name: 'ts2' })
  const ts3 = ts1.sub(ts2).sub(7)

  t.is(ts3.length(), ts1.length())
  t.is(true, ts3.toArray().every((item:Point) => item[1] === -3))
})

test('Timeserie.mul() should correctly multiply the series to numbers and other series', (t) => {
  const idx = TimeSerie.createIndex({ from: '2022-01-01', to: '2022-01-01T23:00:00.000Z', interval: '1h' })
  const ts1 = TimeSerie.fromIndex(idx, { fill: 1, name: 'ts1' })
  const ts2 = TimeSerie.fromIndex(idx, { fill: 2, name: 'ts2' })
  const ts3 = ts1.mul(ts2).mul(7)

  t.is(ts3.length(), ts1.length())
  t.is(true, ts3.toArray().every((item:Point) => item[1] === 14))
})

test('Timeserie.div() should correctly divide the series to numbers and other series', (t) => {
  const idx = TimeSerie.createIndex({ from: '2022-01-01', to: '2022-01-01T23:00:00.000Z', interval: '1h' })
  const ts1 = TimeSerie.fromIndex(idx, { fill: 16, name: 'ts1' })
  const ts2 = TimeSerie.fromIndex(idx, { fill: 4, name: 'ts2' })
  const ts3 = ts1.div(ts2).div(4)

  t.is(ts3.length(), ts1.length())
  t.is(true, ts3.toArray().every((item:Point) => item[1] === 1))
})
