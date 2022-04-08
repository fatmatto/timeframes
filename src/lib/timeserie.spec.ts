import test from 'ava';

import { TimeSerie } from './timeserie';
import { Point } from './types';


test('TimeSerie::atTime() should return the correct point', (t) => {
  const data: Point[] = [
    ["2021-01-01",4],
    ["2021-01-02",5],
    ["2021-01-03",6]
  ]
  const ts = new TimeSerie("energy",data)

  t.is(ts.atTime("2021-01-02"),5)
});


test('TimeSerie::toArray() should return the whole data', (t) => {
  const data: Point[] = [
    ["2021-01-01", 4],
    ["2021-01-02", 5],
    ["2021-01-03", 6]
  ]
  const ts = new TimeSerie("energy", data)

  t.deepEqual(data, ts.toArray())
});


test('TimeSerie::firstValidIndex() should return the first valid value index', (t) => {
  const data: Point[] = [
    ["2021-01-01", null],
    ["2021-01-02", null],
    ["2021-01-03", 6],
    ["2021-01-04", 7],
    ["2021-01-05", 8],
    ["2021-01-06", null]
  ]
  const ts = new TimeSerie("energy", data)

  t.is(ts.firstValidIndex(), "2021-01-03")
});


test('TimeSerie::lastValidIndex() should return the last valid value index', (t) => {
  const data: Point[] = [
    ["2021-01-01", null],
    ["2021-01-02", null],
    ["2021-01-03", 6],
    ["2021-01-04", 7],
    ["2021-01-05", 8],
    ["2021-01-06", null]
  ]
  const ts = new TimeSerie("energy", data)

  t.is(ts.lastValidIndex(), "2021-01-05")
});

test('TimeSerie::firstValidValue() should return the first valid value index', (t) => {
  const data: Point[] = [
    ["2021-01-01", null],
    ["2021-01-02", null],
    ["2021-01-03", 6],
    ["2021-01-04", 7],
    ["2021-01-05", 8],
    ["2021-01-06", null]
  ]
  const ts = new TimeSerie("energy", data)

  t.is(ts.firstValidValue(), 6)
});


test('TimeSerie::lastValidValue() should return the last valid value index', (t) => {
  const data: Point[] = [
    ["2021-01-01", null],
    ["2021-01-02", null],
    ["2021-01-03", 6],
    ["2021-01-04", 7],
    ["2021-01-05", 8],
    ["2021-01-06", null]
  ]
  const ts = new TimeSerie("energy", data)

  t.is(ts.lastValidValue(), 8)
});

test('TimeSerie::betweenTime() should return the correct timeserie subset', (t) => {
  const data: Point[] = [
    ["2021-01-01", 4],
    ["2021-01-02", 5],
    ["2021-01-03", 6],
    ["2021-01-04", 7],
    ["2021-01-05", 8],
    ["2021-01-06", 9]
  ]
  const ts = new TimeSerie("energy", data)

  const subset = ts.betweenTime("2021-01-03", "2021-01-05")

  t.is(subset.length(),3)
  t.is(subset.firstValidValue(),6)
  t.is(subset.lastValidValue(),8)
});


test('TimeSerie::filter() should allow to pass custom filtering logic', (t) => {
  const data: Point[] = [
    ["2021-01-01", 4],
    ["2021-01-02", 5],
    ["2021-01-03", 6],
    ["2021-01-04", 7],
    ["2021-01-05", 8],
    ["2021-01-06", 9]
  ]
  const ts = new TimeSerie("energy", data)

  const filtered = ts.filter((p : Point) => {
    return p[1] % 2 === 0
  })

  t.is(filtered.length(), 3)
  t.is(filtered.firstValidValue(), 4)
  t.is(filtered.lastValidValue(), 8)
});

test('TimeSerie::map() should allow to pass custom mapping logic', (t) => {
  const data: Point[] = [
    ["2021-01-01", 4],
    ["2021-01-02", 5],
    ["2021-01-03", 6],
    ["2021-01-04", 7],
    ["2021-01-05", 8],
    ["2021-01-06", 9]
  ]
  const ts = new TimeSerie("energy", data)

  const mapped = ts.map((p: Point) => {
    return [p[0], p[1] * 2]
  })

  t.is(mapped.length(), ts.length())
  t.is(mapped.firstValidValue(), 8)
  t.is(mapped.lastValidValue(), 18)
});