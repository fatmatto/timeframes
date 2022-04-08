import test from 'ava';

import { TimeFrame } from './timeframe';
import { TimeSerie } from './timeserie';
import { TelemetryV1Output } from './types';


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

  const rows = tf.toArray()

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