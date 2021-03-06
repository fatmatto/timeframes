import test from 'ava';

import { TimeFrame } from './timeframe';
import { TimeSerie } from './timeserie';
import { Point, TelemetryV1Output } from './types';

test('TimeFrame::length() should return the correct value', (t) => {
  const data = [
    { time: "2021-01-01", energy: 1, power: 4 },
    { time: "2021-01-01", energy: 1, power: 5 },
    { time: "2021-01-02", energy: 2, power: 8 },
  ]
  const tf = new TimeFrame(data)

  t.is(tf.length(), 2)
});
test('TimeFrame::shape() should return the correct value', (t) => {
  const data = [
    { time: "2021-01-01", energy: 1, power: 4 },
    { time: "2021-01-02", energy: 1, power: 5 },
    { time: "2021-01-03", energy: 2, power: 8 },
  ]
  const tf = new TimeFrame(data)
  t.deepEqual(tf.shape(), [3,2])
});


test('TimeFrame::atTime() should return the correct row', (t) => {
  const data = [
    {time:"2021-01-01", energy:1,power:4},
    {time:"2021-01-02", energy:2,power:8},
  ]
  const tf = new TimeFrame(data)

  const row = tf.atTime("2021-01-02")

  t.is(row.energy,2)
  t.is(row.power,8)
});


test('TimeFrame::toArray() should return an array of rows', (t) => {
  const data = [
    { time: "2021-01-01", energy: 1, power: 4 },
    { time: "2021-01-02", energy: 2, power: 8 },
  ]
  const tf = new TimeFrame(data)

  const rows = tf.rows()

  t.is(rows.length,2)
  t.is(rows[0].time, data[0].time)
});


test('TimeFrame::column() should return the correct timeserie', (t) => {
  const data = [
    { time: "2021-01-01", energy: 1, power: 4 },
    { time: "2021-01-02", energy: 2, power: 8 },
  ]
  const tf = new TimeFrame(data)

  const energy = tf.column("energy")

  t.is(true, energy instanceof TimeSerie)
  t.is(2, energy.length())
  t.is(energy.atTime("2021-01-01"),1)
  t.is(energy.atTime("2021-01-02"),2)
});


test('TimeFrame::fromTelemetryV1Output() should return the correct timeframe', (t) => {
  const data: TelemetryV1Output = {
    "device1": { 
      "energy": [["2021-01-01", 1], ["2021-01-02",2]],
      "power": [["2021-01-01", 4], ["2021-01-02",8]],
    },
  }

  const tf = TimeFrame.fromTelemetryV1Output(data)

  const row = tf.atTime("2021-01-01")
  t.is(row["device1:energy"],1)
  t.is(row["device1:power"],4)
});

test('TimeFrame::fromTimeseries() should return the correct timeframe', (t) => {
  const energyData: Point[] = [
    ["2021-01-01T00:00:00.000Z", 4],
    ["2021-01-02T00:00:00.000Z", 4],
    ["2021-01-03T00:00:00.000Z", 4]
  ]
  const powerData: Point[] = [
    ["2021-01-01T00:00:00.000Z", 16],
    ["2021-01-02T00:00:00.000Z", 16],
    ["2021-01-03T00:00:00.000Z", 16]
  ]
  const energyTS = new TimeSerie("energy", energyData)
  const powerTS = new TimeSerie("power", powerData)

  const tf = TimeFrame.fromTimeseries([energyTS,powerTS])

  const row = tf.atTime("2021-01-01T00:00:00.000Z")
  t.is(row["energy"], 4)
  t.is(row["power"], 16)
});

test('TimeFrame::filter() should return the correct timeframe', (t) => {
  const data = [
    { time: "2021-01-01", energy: 1, power: 4 },
    { time: "2021-01-01", energy: 1, power: 5 },
    { time: "2021-01-02", energy: 2, power: 8 },
  ]
  const tf = new TimeFrame(data)

  const filtered = tf.filter(row => { return row.power > 4})

  t.is(filtered.length(),2)
});



test('TimeFrame::join() should return the correct timeframe', (t) => {
  const data1 = [
    { time: "2021-01-01", energy: 1, power: 4 },
  ]
  const data2 = [
    { time: "2021-01-02", energy: 1, power: 5 },
    { time: "2021-01-03", energy: 2, power: 8 },
  ]
  const tf1 = new TimeFrame(data1)
  const tf2 = new TimeFrame(data2)

  const joined = TimeFrame.join([tf1,tf2])

  t.is(joined.length(), 3)
});

test('TimeFrame::resample().sum() should return the correct timeframes', (t) => {
  const data = [
    { time: "2021-01-01T00:00:00.000Z", energy: 1, power: -4 },
    { time: "2021-01-02T00:00:00.000Z", energy: 1, power: 3 },
    { time: "2021-01-03T00:00:00.000Z", energy: 1, power: -4 },
    { time: "2021-01-04T00:00:00.000Z", energy: 1, power: 5 },
  ]
  const tf = new TimeFrame(data)

  const resampled = tf.resample(1000*60*60*48,{
    aggregations: {
      energy: 'sum',
      power: 'avg'
    }
  })

  t.is(resampled.length(), 2)
  t.is(resampled.rows()[0].energy,2)
  t.is(resampled.rows()[0].power,-0.5)
  t.is(resampled.rows()[1].energy, 2)
  t.is(resampled.rows()[1].power, 0.5)
});