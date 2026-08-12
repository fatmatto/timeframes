import test from "ava";

import { TimeFrame } from "./timeframe";
import { TimeSerie } from "./timeserie";
import type { Point, TelemetryV1Output } from "./types";

/**
 * Regression suite for the v1.16.2 audit findings (see backlog.md).
 * Tests for findings not yet fixed are marked `test.failing`: they pass while
 * the bug exists and ava will flag them as soon as the fixing batch lands,
 * at which point the `.failing` modifier must be removed.
 *
 * B<n> numbers refer to the audit report / backlog.md.
 */

const T = (m: number) => new Date(1600000000000 + m * 60000).toISOString();

// B1 — fixed in Batch 1
test("B1: sum() is exact beyond Float32 precision", (t) => {
	const ts = new TimeSerie("t", [
		[T(0), 16777216],
		[T(1), 1],
		[T(2), 1],
	]);
	t.is(ts.sum()[1], 16777218);
});

test("B1: sum() of many small increments does not drift", (t) => {
	const points: Point[] = [];
	for (let i = 0; i < 1000; i++) {
		points.push([T(i), 0.01]);
	}
	const ts = new TimeSerie("t", points);
	t.true(Math.abs((ts.sum()[1] as number) - 10) < 1e-9);
});

test("B1: serie-to-serie add() keeps Float64 precision", (t) => {
	const a = new TimeSerie("a", [[T(0), 0.1]]);
	const b = new TimeSerie("b", [[T(0), 0.2]]);
	t.true(Math.abs((a.add(b).atIndex(0) as number) - 0.3) < 1e-9);
});

// B2 — Batch 3
test("B2: ISO timestamps with UTC offsets sort chronologically", (t) => {
	const ts = new TimeSerie("t", [
		["2021-01-01T10:00:00+05:00", 1], // 05:00Z
		["2021-01-01T08:00:00+01:00", 2], // 07:00Z
	]);
	t.is(ts.toArray()[0][0], "2021-01-01T05:00:00.000Z");
	t.is(ts.toArray()[0][1], 1);
});

// B3 — Batch 5
test.failing(
	"B3: fromTelemetryV1Output keeps every property with numeric timestamps",
	(t) => {
		const telemetry = {
			dev1: {
				temp: [[1600000000000, 10]],
				hum: [[1600000000000, 55]],
			},
		} as unknown as TelemetryV1Output;
		const row = TimeFrame.fromTelemetryV1Output(telemetry).rows()[0];
		t.is(row["dev1:temp"], 10);
		t.is(row["dev1:hum"], 55);
	},
);

// B4 — Batch 5
test.failing("B4: renameColumns() does not mutate the source frame", (t) => {
	const tf = new TimeFrame({
		data: [{ time: T(0), a: 1, b: 2 }],
	});
	tf.column("a");
	tf.renameColumns({ a: "x" });
	t.is(tf.column("a").name, "a");
	t.deepEqual(Object.keys(tf.sum()).sort(), ["a", "b", "time"]);
});

// B5 — Batch 2
test("B5: backfill reindex preserves zero values", (t) => {
	const ts = new TimeSerie("t", [
		[T(0), 5],
		[T(1), 0],
	]);
	const reindexed = ts.reindex([T(0), T(1), T(2)], {
		fillMethod: "previous",
	});
	t.is(reindexed.atIndex(1), 0);
	t.is(reindexed.atIndex(2), 0);
});

// B6 — Batch 2
test("B6: fill value 0 is honored by reindex() and atTime()", (t) => {
	const ts = new TimeSerie("t", [[T(0), 1]]);
	const reindexed = ts.reindex([T(0), T(1)], { fill: 0 });
	t.is(reindexed.atIndex(1), 0);
	t.is(ts.atTime(T(5), 0), 0);
});

// B7 — Batch 6 (approved: calendar-composed UTC bucket keys)
test.failing("B7: group by day buckets by calendar day, not weekday", (t) => {
	const ts = new TimeSerie("t", [
		["2021-01-04T10:00:00.000Z", 1], // Monday
		["2021-01-11T10:00:00.000Z", 2], // Monday, one week later
		["2021-01-05T10:00:00.000Z", 4], // Tuesday
	]);
	const grouped = ts.group({ by: "day", operation: "sum" });
	t.is(grouped.length(), 3);
	t.deepEqual(grouped.values().sort(), [1, 2, 4]);
});

// B8 — fixed in Batch 1
test("B8: dividing a zero serie returns 0, not NaN", (t) => {
	const a = new TimeSerie("a", [[T(0), 0]]);
	const b = new TimeSerie("b", [[T(0), 4]]);
	t.is(a.div(b).atIndex(0), 0);
});

// B9 — Batch 4
test.failing(
	"B9: interpolate() handles boundary holes without crashing",
	(t) => {
		const ts = new TimeSerie("t", [
			[T(0), null],
			[T(1), 1],
			[T(2), 3],
		]);
		let interpolated: TimeSerie;
		t.notThrows(() => {
			interpolated = ts.interpolate({ method: "linear" });
		});
		t.is(interpolated.atIndex(0), null);
		t.is(interpolated.atIndex(1), 1);
	},
);

test.failing("B9: interpolate() treats NaN as a hole", (t) => {
	const ts = new TimeSerie("t", [
		[T(0), 1],
		[T(1), Number.NaN],
		[T(2), 3],
	]);
	t.is(ts.interpolate({ method: "linear" }).atIndex(1), 2);
});

// B10 — Batch 2
test("B10: reindex() works without an options argument", (t) => {
	const ts = new TimeSerie("t", [[T(0), 1]]);
	t.notThrows(() => ts.reindex([T(0), T(1)]));
});

test("B10: forward-fill reindex does not mutate the caller's index", (t) => {
	const ts = new TimeSerie("t", [[T(1), 1]]);
	const idx = [T(0), T(1)];
	const copy = [...idx];
	ts.reindex(idx, { fillMethod: "next" });
	t.deepEqual(idx, copy);
});

// B11 — Batch 4
test.failing(
	"B11: resample() on an empty serie throws the intended error",
	(t) => {
		const ts = new TimeSerie("t", []);
		t.throws(() => ts.resample({ interval: 60000, operation: "avg" }), {
			message: /Cannot infer a lower bound/,
		});
	},
);

// B12 — Batch 5
test.failing(
	"B12: reduce() with a partial operations map omits uncovered columns",
	(t) => {
		const tf = new TimeFrame({
			data: [
				{ time: T(0), a: 1, b: 2 },
				{ time: T(1), a: 3, b: 4 },
			],
		});
		const reduced = tf.reduce({ operations: { a: "sum" } } as any);
		t.deepEqual(reduced.columnNames, ["a"]);
		t.is(reduced.column("a").atIndex(0), 4);
	},
);

// B13 — Batch 6 (approved: implement the documented throw)
test.failing("B13: TimeFrame.concat() throws on overlapping times", (t) => {
	const a = new TimeFrame({ data: [{ time: T(0), a: 1 }] });
	const b = new TimeFrame({ data: [{ time: T(0), a: 99 }] });
	t.throws(() => TimeFrame.concat([a, b]));
});

// B14 — Batch 6 (approved: return null on miss)
test.failing("B14: TimeFrame.atTime() returns null for a missing time", (t) => {
	const tf = new TimeFrame({ data: [{ time: T(0), a: 1 }] });
	t.is(tf.atTime(T(99)), null);
});
