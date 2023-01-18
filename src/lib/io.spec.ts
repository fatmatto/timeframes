import test from "ava";
import { fromArrow, fromParquet, toArrow, toParquet } from "./io";

import { TimeFrame } from "./timeframe";

test('fromParquet() and toParquet() should correctly build a timeframe', async t => {
  const data = [
    { time: "2021-01-01", energy: 1, power: 5 },
    { time: "2021-01-02", energy: 2, power: 8 },
  ];
  const tf = new TimeFrame({ data });


  const parquetBuffer = toParquet(tf)

  const tf2 = fromParquet(parquetBuffer)

  t.is(tf2.rows().length, 2)
  t.is(tf2.atTime('2021-01-01').energy, 1)
  t.is(tf2.atTime('2021-01-01').power, 5)
})

test('fromArrow() and toArrow() should correctly build a timeframe', async t => {
  const data = [
    { time: "2021-01-01", energy: 1, power: 5 },
    { time: "2021-01-02", energy: 2, power: 8 },
  ];
  const tf = new TimeFrame({ data });


  const arrowBuffer = toArrow(tf)

  const tf2 = fromArrow(arrowBuffer)

  t.is(tf2.rows().length, 2)
  t.is(tf2.atTime('2021-01-01').energy, 1)
  t.is(tf2.atTime('2021-01-01').power, 5)
})