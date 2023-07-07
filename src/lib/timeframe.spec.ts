import test from "ava";

import { TimeFrame } from "./timeframe";
import { TimeSerie } from "./timeserie";
import { Point, TelemetryV1Output } from "./types";
import { DateLikeToString } from "./utils";

test("TimeFrame.column() should return the correct timeserie", (t) => {
  const data = [
    { time: "2021-01-01", energy: 1, power: 4 },
    { time: "2021-01-02", energy: 2, power: 8 },
  ];
  const tf = new TimeFrame({ data });

  const energy = tf.column("energy");

  t.is(true, energy instanceof TimeSerie);
  t.is(2, energy.length());
  t.is(energy.atTime("2021-01-01"), 1);
  t.is(energy.atTime("2021-01-02"), 2);
});

test("TimeFrame.length() should return the correct value", (t) => {
  const data = [
    { time: "2021-01-01", energy: 1, power: 4 },
    { time: "2021-01-01", energy: 1, power: 5 },
    { time: "2021-01-02", energy: 2, power: 8 },
  ];
  const tf = new TimeFrame({ data });

  t.is(tf.length(), 2);
});
test("TimeFrame.shape() should return the correct value", (t) => {
  const data = [
    { time: "2021-01-01", energy: 1, power: 4 },
    { time: "2021-01-02", energy: 1, power: 5 },
    { time: "2021-01-03", energy: 2, power: 8 },
  ];
  const tf = new TimeFrame({ data });
  t.deepEqual(tf.shape(), [3, 2]);
});

test("TimeFrame.indexes() should return the correct value", (t) => {
  const data = [
    { time: "2021-01-03", energy: 1, power: 4 },
    { time: "2021-01-01", energy: 1, power: 5 },
    { time: "2021-01-02", energy: 2, power: 8 },
  ];
  const tf = new TimeFrame({ data });
  t.deepEqual(tf.indexes(), [
    DateLikeToString("2021-01-01"),
    DateLikeToString("2021-01-02"),
    DateLikeToString("2021-01-03"),
  ]);
});

test("TimeFrame.atTime() should return the correct row", (t) => {
  const data = [
    { time: "2021-01-01", energy: 1, power: 4 },
    { time: "2021-01-02", energy: 2, power: 8 },
  ];
  const tf = new TimeFrame({ data });

  const row = tf.atTime("2021-01-02");

  t.is(row.energy, 2);
  t.is(row.power, 8);
});

test("TimeFrame.toArray() should return an array of rows", (t) => {
  const data = [
    { time: "2021-01-01T00:00:00.000Z", energy: 1, power: 4 },
    { time: "2021-01-02T00:00:00.000Z", energy: 2, power: 8 },
  ];
  const tf = new TimeFrame({ data });

  const rows = tf.rows();

  t.is(rows.length, 2);
  t.is(rows[0].time, data[0].time);
});

test("TimeFrame.fromTelemetryV1Output() should return the correct timeframe", (t) => {
  const data: TelemetryV1Output = {
    device1: {
      energy: [
        ["2021-01-01T00:00:00.000Z", 1],
        ["2021-01-02T00:00:00.000Z", 2],
      ],
      power: [
        ["2021-01-01T00:00:00.000Z", 4],
        ["2021-01-02T00:00:00.000Z", 8],
      ],
    },
    device2: {
      energy: [
        ["2021-01-01T00:00:00.000Z", 1],
        ["2021-01-02T00:00:00.000Z", 2],
      ],
      power: [
        ["2021-01-01T00:00:00.000Z", 4],
        ["2021-01-02T00:00:00.000Z", 8],
      ],
    },
  };

  const tf = TimeFrame.fromTelemetryV1Output(data);

  const row = tf.atTime("2021-01-01T00:00:00.000Z");
  t.is(row["device1:energy"], 1);
  t.is(row["device1:power"], 4);

  const d2energy = tf.column("device2:energy");
  t.is(d2energy.metadata.deviceId, "device2");
  t.is(d2energy.metadata.propertyName, "energy");
});

test("TimeFrame.fromTimeseries() should return the correct timeframe", (t) => {
  const energyData: Point[] = [
    ["2021-01-01T00:00:00.000Z", 4],
    ["2021-01-02T00:00:00.000Z", 4],
    ["2021-01-03T00:00:00.000Z", 4],
  ];
  const powerData: Point[] = [
    ["2021-01-01T00:00:00.000Z", 16],
    ["2021-01-02T00:00:00.000Z", 16],
    ["2021-01-03T00:00:00.000Z", 16],
  ];
  const energyTS = new TimeSerie("energy", energyData, { deviceId: "d1" });
  const powerTS = new TimeSerie("power", powerData, { deviceId: "d2" });

  const tf = TimeFrame.fromTimeseries([energyTS, powerTS]);
  const row = tf.atTime("2021-01-01T00:00:00.000Z");
  t.is(row.energy, 4);
  t.is(row.power, 16);
  // We ensure that metadata is propagated to each timeserie
  t.is(tf.metadata?.energy?.deviceId, "d1");
  t.is(tf.metadata?.power?.deviceId, "d2");
});

test("TimeFrame.filter() should return the correct timeframe", (t) => {
  const data = [
    { time: "2021-01-01", energy: 1, power: 4 },
    { time: "2021-01-01", energy: 1, power: 5 },
    { time: "2021-01-02", energy: 2, power: 8 },
  ];
  const tf = new TimeFrame({ data });

  const filtered = tf.filter((row) => {
    return row.power > 4;
  });

  t.is(filtered.length(), 2);
});

test("TimeFrame.join() should return the correct timeframe", (t) => {
  const data1 = [{ time: "2021-01-01", energy: 1, power: 4, voltage1: 7 }];
  const data2 = [
    { time: "2021-01-02", energy: 1, power: 5, voltage2: 4 },
    { time: "2021-01-03", energy: 2, power: 8, voltage3: 5 },
  ];
  const data3 = [
    { time: "2021-01-01", cosphi: 1 },
    { time: "2021-01-04", energy: 2, power: 2, cosphi: 1 },
  ];
  const tf1 = new TimeFrame({ data: data1 });
  const tf2 = new TimeFrame({ data: data2 });
  const tf3 = new TimeFrame({ data: data3 });

  // We want join to be not be dependant to the ordering of timeframes
  const joined1 = tf1.join([tf2, tf3]);
  const joined2 = tf2.join([tf1, tf3]);
  const joined3 = tf3.join([tf1, tf2]);
  [joined1, joined2, joined3].forEach((joined) => {
    t.is(joined.length(), 4);
    t.is(joined.atTime("2021-01-01T00:00:00.000Z").energy, 1);
    t.is(joined.atTime("2021-01-01T00:00:00.000Z").power, 4);
    t.is(joined.atTime("2021-01-01T00:00:00.000Z").voltage1, 7);
    t.is(joined.atTime("2021-01-01T00:00:00.000Z").voltage2, undefined);
    t.is(joined.atTime("2021-01-01T00:00:00.000Z").voltage3, undefined);
    t.is(joined.atTime("2021-01-02T00:00:00.000Z").energy, 1);
    t.is(joined.atTime("2021-01-02T00:00:00.000Z").power, 5);
    t.is(joined.atTime("2021-01-02T00:00:00.000Z").voltage1, undefined);
    t.is(joined.atTime("2021-01-02T00:00:00.000Z").voltage2, 4);
    t.is(joined.atTime("2021-01-02T00:00:00.000Z").voltage3, undefined);
  });
});

test("TimeFrame.merge() should return the correct timeframe", (t) => {
  const data1 = [{ time: "2021-01-01", energy: 1, power: 4, voltage1: 7 }];
  const data2 = [
    { time: "2021-01-02", energy: 1, power: 5, voltage2: 4 },
    { time: "2021-01-03", energy: 2, power: 8, voltage3: 5 },
  ];
  const data3 = [
    { time: "2021-01-01", cosphi: 1, energy: 41 },
    { time: "2021-01-02", power: 11 },
    { time: "2021-01-04", energy: 2, power: 2, cosphi: 1 },
  ];
  const tf1 = new TimeFrame({ data: data1 });
  const tf2 = new TimeFrame({ data: data2 });
  const tf3 = new TimeFrame({ data: data3 });

  // We want join to be not be dependant to the ordering of timeframes
  const merged = TimeFrame.merge([tf3, tf2, tf1]);
  t.is(merged.length(), 4);
  t.is(merged.atTime("2021-01-01T00:00:00.000Z").energy, 41);
  t.is(merged.atTime("2021-01-01T00:00:00.000Z").cosphi, 1);
  t.is(merged.atTime("2021-01-01T00:00:00.000Z").power, 4);
  t.is(merged.atTime("2021-01-01T00:00:00.000Z").voltage1, 7);

  t.is(merged.atTime("2021-01-02T00:00:00.000Z").energy, 1);
  t.is(merged.atTime("2021-01-02T00:00:00.000Z").power, 11);
  t.is(merged.atTime("2021-01-02T00:00:00.000Z").voltage2, 4);

  t.is(merged.atTime("2021-01-03T00:00:00.000Z").energy, 2);
  t.is(merged.atTime("2021-01-03T00:00:00.000Z").power, 8);
  t.is(merged.atTime("2021-01-03T00:00:00.000Z").voltage3, 5);

  t.deepEqual(merged.columnNames, [
    'power',
    'energy',
    'voltage2',
    'voltage3',
    'cosphi',
    'voltage1',
  ])
});

test("TimeFrame.apply() should correctly modify columns", (t) => {
  const energyData: Point[] = [
    ["2021-01-01T00:00:00.000Z", 4],
    ["2021-01-02T00:00:00.000Z", 4],
    ["2021-01-03T00:00:00.000Z", 4],
  ];
  const powerData: Point[] = [
    ["2021-01-01T00:00:00.000Z", 16],
    ["2021-01-02T00:00:00.000Z", 16],
    ["2021-01-03T00:00:00.000Z", 16],
  ];
  const energyTS = new TimeSerie("energy", energyData, { deviceId: "d1" });
  const powerTS = new TimeSerie("power", powerData, { deviceId: "d2" });

  const tf = TimeFrame.fromTimeseries([energyTS, powerTS]);

  const tf2 = tf.apply((ts) => ts.map((p: Point) => [p[0], 0]), ["power"]);

  t.is(tf.column("energy").sum()[1], 12);
  t.is(tf2.column("power").sum()[1], 0);

  t.is(tf2.metadata.energy.deviceId, "d1");
  t.is(tf2.metadata.power.deviceId, "d2");
});

test("TimeFrame.resample(sum) should correctly resample and aggregate data", (t) => {
  const data = [
    { time: "2021-01-01T00:00:00.000Z", energy: 1, power: 1 },
    { time: "2021-01-01T00:01:00.000Z", energy: 1, power: 1 },
    { time: "2021-01-01T00:59:00.000Z", energy: 1, power: 1 },
    { time: "2021-01-01T01:01:00.000Z", energy: 1, power: 1 },
    { time: "2021-01-01T01:59:00.000Z", energy: 1, power: 1 },
    { time: "2021-01-01T02:00:00.000Z", energy: 1, power: 1 },
    { time: "2021-01-01T02:01:00.000Z", energy: 1, power: 1 },
    { time: "2021-01-01T02:59:00.000Z", energy: 1, power: 1 },
    { time: "2021-01-01T03:01:00.000Z", energy: 1, power: 1 },
  ];
  const tf = new TimeFrame({ data, metadata: { hello: "world" } });

  const resampled = tf.resample({
    interval: 1000 * 60 * 60,
    from: "2021-01-01T00:00:00.000Z",
    to: "2021-01-01T04:00:00.000Z",
    operation: "sum",
  });

  t.is(resampled.length(), 4);
  t.is(resampled.rows()[0].time, "2021-01-01T00:00:00.000Z");
  t.is(resampled.rows()[0].power, 3);
  t.is(resampled.rows()[0].energy, 3);
  t.is(resampled.rows()[1].time, "2021-01-01T01:00:00.000Z");
  t.is(resampled.rows()[1].power, 2);
  t.is(resampled.rows()[1].energy, 2);
  t.is(resampled.rows()[2].time, "2021-01-01T02:00:00.000Z");
  t.is(resampled.rows()[2].power, 3);
  t.is(resampled.rows()[2].energy, 3);
  t.is(resampled.rows()[3].time, "2021-01-01T03:00:00.000Z");
  t.is(resampled.rows()[3].power, 1);
  t.is(resampled.rows()[3].energy, 1);

  t.is(resampled.metadata.hello, "world");
});

test("TimeFrame.sum() should correctly sum all columns", (t) => {
  const data = [
    { time: "2021-01-01T00:00:00.000Z", energy: 1, power: 4 },
    { time: "2021-01-02T00:00:00.000Z", energy: 1, power: 3 },
    { time: "2021-01-03T00:00:00.000Z", energy: 2, power: 2 },
    { time: "2021-01-04T00:00:00.000Z", energy: 1, power: 9 },
  ];
  const row = new TimeFrame({ data }).sum();

  t.is(row.time, "2021-01-01T00:00:00.000Z");
  t.is(row.energy, 5);
  t.is(row.power, 18);
});

test("TimeFrame.delta() should correctly delta all columns", (t) => {
  const data = [
    { time: "2021-01-01T00:00:00.000Z", energy: 1, expenergy: 4 },
    { time: "2021-01-02T00:00:00.000Z", energy: 2, expenergy: 8 },
    { time: "2021-01-03T00:00:00.000Z", energy: 3, expenergy: 12 },
    { time: "2021-01-04T00:00:00.000Z", energy: 4, expenergy: 16 },
  ];
  const row = new TimeFrame({ data }).delta();

  t.is(row.time, "2021-01-01T00:00:00.000Z");
  t.is(row.energy, 3);
  t.is(row.expenergy, 12);
});

test("TimeFrame.max() should correctly max() all columns", (t) => {
  const data = [
    { time: "2021-01-01T00:00:00.000Z", energy: 1, power: 4 },
    { time: "2021-01-02T00:00:00.000Z", energy: 7, power: 3 },
    { time: "2021-01-03T00:00:00.000Z", energy: 2, power: 2 },
    { time: "2021-01-04T00:00:00.000Z", energy: 1, power: 9 },
  ];
  const row = new TimeFrame({ data }).max();

  t.is(row.time, "2021-01-01T00:00:00.000Z");
  t.is(row.energy, 7);
  t.is(row.power, 9);
});

test("TimeFrame.min() should correctly min() all columns", (t) => {
  const data = [
    { time: "2021-01-01T00:00:00.000Z", energy: 3, power: 1 },
    { time: "2021-01-02T00:00:00.000Z", energy: 7, power: 3 },
    { time: "2021-01-03T00:00:00.000Z", energy: 2, power: 2 },
    { time: "2021-01-04T00:00:00.000Z", energy: 1, power: 9 },
  ];
  const row = new TimeFrame({ data }).min();

  t.is(row.time, "2021-01-01T00:00:00.000Z");
  t.is(row.energy, 1);
  t.is(row.power, 1);
});

test("TimeFrame.avg() should correctly avg() all columns", (t) => {
  const data = [
    { time: "2021-01-01T00:00:00.000Z", energy: 4, power: 1 },
    { time: "2021-01-02T00:00:00.000Z", energy: 4, power: 1 },
    { time: "2021-01-03T00:00:00.000Z", energy: 8, power: 11 },
    { time: "2021-01-04T00:00:00.000Z", energy: 8, power: 11 },
  ];
  const row = new TimeFrame({ data }).avg();

  t.is(row.time, "2021-01-01T00:00:00.000Z");
  t.is(row.energy, 6);
  t.is(row.power, 6);
});

test("TimeFrame.aggregate() should correctly aggregate columns", (t) => {
  const data = [
    { time: "2021-01-01T00:00:00.000Z", energy1: 1, energy2: 4 },
    { time: "2021-01-02T00:00:00.000Z", energy1: 2, energy2: 8 },
    { time: "2021-01-03T00:00:00.000Z", energy1: 3, energy2: 12 },
    { time: "2021-01-04T00:00:00.000Z", energy1: 4, energy2: 16 },
  ];
  const agg = new TimeFrame({ data, metadata: { hello: "world" } }).aggregate({
    output: "totalenergy",
    columns: ["energy1", "energy2"],
    operation: "add",
  });

  t.is(agg.atIndex(0).totalenergy, 5);
  t.is(agg.atIndex(1).totalenergy, 10);
  t.is(agg.atIndex(2).totalenergy, 15);
  t.is(agg.atIndex(3).totalenergy, 20);
  t.is(agg.metadata.hello, "world");
});

test("TimeFrame.project() should correctly aggregate columns", (t) => {
  const data = [
    { time: "2021-01-01T00:00:00.000Z", energy1: 1, energy2: 4 },
    { time: "2021-01-02T00:00:00.000Z", energy1: 2, energy2: 8 },
    { time: "2021-01-03T00:00:00.000Z", energy1: 3, energy2: 12 },
    { time: "2021-01-04T00:00:00.000Z", energy1: 4, energy2: 16 },
  ];
  const tf = new TimeFrame({ data, metadata: { hello: "world" } });
  const projected = tf.project({ columns: ["energy1"] });

  t.is(tf.columns().length, 2);
  t.is(projected.columns().length, 1);
  t.is(projected.metadata.hello, "world");
});

test("TimeFrame.mul() should correctly multiply values", (t) => {
  const data = [
    { time: "2021-01-01T00:00:00.000Z", energy1: 1, energy2: 4 },
    { time: "2021-01-02T00:00:00.000Z", energy1: 2, energy2: 8 },
    { time: "2021-01-03T00:00:00.000Z", energy1: 3, energy2: 12 },
    { time: "2021-01-04T00:00:00.000Z", energy1: 4, energy2: 16 },
  ];
  const tf = new TimeFrame({ data, metadata: { hello: "world" } });
  const multiplied = tf.mul(2);

  t.is(multiplied.atTime("2021-01-01T00:00:00.000Z").energy1, 2);
  t.is(multiplied.atTime("2021-01-01T00:00:00.000Z").energy2, 8);

  t.is(multiplied.atTime("2021-01-02T00:00:00.000Z").energy1, 4);
  t.is(multiplied.atTime("2021-01-02T00:00:00.000Z").energy2, 16);
});

test("TimeFrame.add() should correctly add values", (t) => {
  const data = [
    { time: "2021-01-01T00:00:00.000Z", energy1: 1, energy2: 4 },
    { time: "2021-01-02T00:00:00.000Z", energy1: 2, energy2: 8 },
    { time: "2021-01-03T00:00:00.000Z", energy1: 3, energy2: 12 },
    { time: "2021-01-04T00:00:00.000Z", energy1: 4, energy2: 16 },
  ];
  const tf = new TimeFrame({ data, metadata: { hello: "world" } });
  const added = tf.add(2);

  t.is(added.atTime("2021-01-01T00:00:00.000Z").energy1, 3);
  t.is(added.atTime("2021-01-01T00:00:00.000Z").energy2, 6);

  t.is(added.atTime("2021-01-02T00:00:00.000Z").energy1, 4);
  t.is(added.atTime("2021-01-02T00:00:00.000Z").energy2, 10);
});

test("TimeFrame.reduce() should correctly reduce the timeframe", (t) => {
  const data = [
    { time: "2021-01-01T00:00:00.000Z", energy: 1, power: 4 },
    { time: "2021-01-02T00:00:00.000Z", energy: 1, power: 4 },
    { time: "2021-01-03T00:00:00.000Z", energy: 1, power: 2 },
    { time: "2021-01-04T00:00:00.000Z", energy: 1, power: 2 },
  ];
  const tf = new TimeFrame({ data });

  const reduced = tf.reduce({
    operation: "avg",
    operations: { energy: "sum" },
  });
  const rows = reduced.rows();
  t.is(rows.length, 1);
  t.is(rows[0].energy, 4);
  t.is(rows[0].power, 3);
});

test("TimeFrame.pipeline() should correctly run all the stages", (t) => {
  const data = [
    {
      time: "2021-01-01T00:00:00.000Z",
      voltage1: 1,
      current1: 1,
      voltage2: 2,
      current2: 2,
      voltage3: 3,
      current3: 3,
    },
    {
      time: "2021-01-01T00:01:00.000Z",
      voltage1: 1,
      current1: 1,
      voltage2: 2,
      current2: 2,
      voltage3: 3,
      current3: 3,
    },
    {
      time: "2021-01-01T00:59:00.000Z",
      voltage1: 1,
      current1: 1,
      voltage2: 2,
      current2: 2,
      voltage3: 3,
      current3: 3,
    },
    {
      time: "2021-01-01T01:01:00.000Z",
      voltage1: 1,
      current1: 1,
      voltage2: 2,
      current2: 2,
      voltage3: 3,
      current3: 3,
    },
    {
      time: "2021-01-01T01:59:00.000Z",
      voltage1: 1,
      current1: 1,
      voltage2: 2,
      current2: 2,
      voltage3: 3,
      current3: 3,
    },
    {
      time: "2021-01-01T02:00:00.000Z",
      voltage1: 1,
      current1: 1,
      voltage2: 2,
      current2: 2,
      voltage3: 3,
      current3: 3,
    },
    {
      time: "2021-01-01T02:01:00.000Z",
      voltage1: 1,
      current1: 1,
      voltage2: 2,
      current2: 2,
      voltage3: 3,
      current3: 3,
    },
    {
      time: "2021-01-01T02:59:00.000Z",
      voltage1: 1,
      current1: 1,
      voltage2: 2,
      current2: 2,
      voltage3: 3,
      current3: 3,
    },
    {
      time: "2021-01-01T03:01:00.000Z",
      voltage1: 1,
      current1: 1,
      voltage2: 2,
      current2: 2,
      voltage3: 3,
      current3: 3,
    },
  ];
  const tf = new TimeFrame({ data, metadata: { hello: "world" } });

  const processed = tf.pipeline([
    {
      aggregate: {
        columns: ["voltage1", "current1"],
        operation: "mul",
        output: "power1",
      },
    },
    {
      aggregate: {
        columns: ["voltage2", "current2"],
        operation: "mul",
        output: "power2",
      },
    },
    {
      aggregate: {
        columns: ["voltage3", "current3"],
        operation: "mul",
        output: "power3",
      },
    },
    {
      aggregate: {
        columns: ["power1", "power2", "power3"],
        operation: "add",
        output: "powertot",
      },
    },
    { project: { columns: ["powertot"] } },
    {
      resample: {
        interval: 1000 * 60 * 60,
        operation: "avg",
        from: "2021-01-01T00:00:00.000Z",
      },
    },
  ]);

  t.is(processed.length(), 4);
  t.is(processed.columnNames.length, 1);
  t.is(processed.columnNames[0], "powertot");

  t.is(processed.metadata.hello, "world");
});

test("TimeFrame.split() should split a timeframe into sub timeframes of fixed size", (t) => {
  const data = [
    {
      time: "2021-01-01T00:00:00.000Z",
      voltage1: 1,
      current1: 1,
      voltage2: 2,
      current2: 2,
      voltage3: 3,
      current3: 3,
    },
    {
      time: "2021-01-01T00:01:00.000Z",
      voltage1: 1,
      current1: 1,
      voltage2: 2,
      current2: 2,
      voltage3: 3,
      current3: 3,
    },
    {
      time: "2021-01-01T00:59:00.000Z",
      voltage1: 1,
      current1: 1,
      voltage2: 2,
      current2: 2,
      voltage3: 3,
      current3: 3,
    },
    {
      time: "2021-01-01T01:01:00.000Z",
      voltage1: 1,
      current1: 1,
      voltage2: 2,
      current2: 2,
      voltage3: 3,
      current3: 3,
    },
    {
      time: "2021-01-01T01:59:00.000Z",
      voltage1: 1,
      current1: 1,
      voltage2: 2,
      current2: 2,
      voltage3: 3,
      current3: 3,
    },
    {
      time: "2021-01-01T02:00:00.000Z",
      voltage1: 1,
      current1: 1,
      voltage2: 2,
      current2: 2,
      voltage3: 3,
      current3: 3,
    },
    {
      time: "2021-01-01T02:01:00.000Z",
      voltage1: 1,
      current1: 1,
      voltage2: 2,
      current2: 2,
      voltage3: 3,
      current3: 3,
    },
    {
      time: "2021-01-01T02:59:00.000Z",
      voltage1: 1,
      current1: 1,
      voltage2: 2,
      current2: 2,
      voltage3: 3,
      current3: 3,
    },
    {
      time: "2021-01-01T03:01:00.000Z",
      voltage1: 1,
      current1: 1,
      voltage2: 2,
      current2: 2,
      voltage3: 3,
      current3: 3,
    },
  ];

  const tf = new TimeFrame({ data, metadata: { hello: "world" } });

  const chunks = tf.split({ chunks: 3 });

  t.is(chunks.length, 3);
  t.deepEqual(
    chunks.map((tf: TimeFrame) => tf.shape()),
    [
      [3, 6],
      [3, 6],
      [3, 6],
    ],
  );
});
