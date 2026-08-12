/**
 * Performance benchmark for the audit bottlenecks P1–P8 (see backlog.md).
 *
 * Run with: npm run bench   (builds first, then runs against build/main)
 *
 * Workloads mirror real usage: 15-min × 1 year (35,040 pts) and
 * 1-min × 1 year (525,600 pts).
 *
 * NOTE: interpolate runs on a reduced size (5,000 pts) until Batch 4 lands,
 * because the current implementation is O(n²). Raise INTERPOLATE_N to LARGE
 * afterwards.
 *
 * Baseline (after Batch 3, Node 24.16, Apple Silicon; medians of repeated runs
 * where noted — single-shot numbers vary ±40% with GC):
 *   constructor 525k pre-sorted .  24.3 ms  (was 366.2) | gate ≤ 50 ✓
 *   map 525k ....................  50.9 ms  (was 403.8) | gate ≤ 50 ✓
 *   betweenTime 525k ............   0.03 ms (was 585.2 first call) | gate ≤ 5 ✓
 *   combine add 525k ............  52.4 ms  (was 2041.7) | gate ≤ 50 ✓ (median)
 *   resample 525k → 15min ....... 166.2 ms  (was 1742.9) | gate ≤ 300 ✓
 *   reindex next-fill 35k .......  17.3 ms  (was 175.2 before Batch 2)
 *   interpolate 5k sparse ....... 1662.3 ms | budget ≤ 2 ms at 5k (Batch 4)
 *   lastValidValue ×100 @525k ... 107.1 ms  | budget ≤ 1 ms    (Batch 4)
 *   TimeFrame 35k×3 constructor .  23.1 ms  (was 48.1)
 *   tf.atIndex ×10 @35k ......... 210.8 ms  | budget ≤ 1 ms    (Batch 5)
 *   tf.sum() @35k×3 .............  41.4 ms  (was 124.2)
 */
const path = require("node:path");

let TimeSerie;
let TimeFrame;
try {
	({ TimeSerie, TimeFrame } = require(
		path.join(__dirname, "..", "build", "main", "index.js"),
	));
} catch (_e) {
	console.error("build/main not found — run `npm run build` first.");
	process.exit(1);
}

const SMALL = 35040; // 15-min × 1 year
const LARGE = 525600; // 1-min × 1 year
const INTERPOLATE_N = 5000; // raise to LARGE after Batch 4
const BASE = 1600000000000;

function makePoints(n, stepMs, valueFn) {
	const points = new Array(n);
	for (let i = 0; i < n; i++) {
		points[i] = [new Date(BASE + i * stepMs).toISOString(), valueFn(i)];
	}
	return points;
}

function bench(name, fn) {
	const t0 = process.hrtime.bigint();
	fn();
	const elapsed = Number(process.hrtime.bigint() - t0) / 1e6;
	console.log(name.padEnd(48) + elapsed.toFixed(1).padStart(10) + " ms");
	return elapsed;
}

console.log(`node ${process.version} — SMALL=${SMALL} LARGE=${LARGE}\n`);

// P5: constructor + derived-serie tax
const largePoints = makePoints(LARGE, 60000, (i) => Math.sin(i / 100) * 100);
let serie;
bench(`P5 constructor (${LARGE} pre-sorted pts)`, () => {
	serie = new TimeSerie("s", largePoints);
});
bench(`P5 map x2 (${LARGE} pts)`, () => serie.map((p) => [p[0], p[1] * 2]));

// P4: betweenTime
const from = new Date(BASE + 1000 * 60000);
const to = new Date(BASE + 2000 * 60000);
bench("P4 betweenTime first call", () => serie.betweenTime(from, to));
bench("P4 betweenTime cached", () => serie.betweenTime(from, to));

// P2: combine
const sa = new TimeSerie("a", largePoints);
const sb = new TimeSerie("b", largePoints);
bench(`P2 combine add (${LARGE} pts)`, () => sa.add(sb));

// P1: interpolate (reduced size, see note above)
const holePoints = makePoints(INTERPOLATE_N, 60000, (i) =>
	i % 3 === 0 || i === INTERPOLATE_N - 1 ? i : null,
);
const holeSerie = new TimeSerie("h", holePoints);
bench(`P1 interpolate (${INTERPOLATE_N} pts, 66% null)`, () =>
	holeSerie.interpolate({ method: "linear" }),
);

// P6: resample a 1-min year to 15-min buckets
bench(`P6 resample ${LARGE} pts -> 15min avg`, () =>
	serie.resample({ interval: 15 * 60000, operation: "avg" }),
);

// P8: reindex fill methods
const sparse = new TimeSerie(
	"sp",
	makePoints(SMALL, 60000, (i) => i).filter((_, i) => i % 3 === 0),
);
const reindexTarget = makePoints(SMALL, 60000, () => 0).map((p) => p[0]);
bench(`P8 reindex next-fill (${SMALL} idx)`, () =>
	sparse.reindex([...reindexTarget], { fillMethod: "next" }),
);

// last* accessor waste
bench(`P7 lastValidValue x100 (${LARGE} pts)`, () => {
	for (let i = 0; i < 100; i++) {
		serie.lastValidValue();
	}
});

// P3: TimeFrame row materialization
const rows = new Array(SMALL);
for (let i = 0; i < SMALL; i++) {
	rows[i] = {
		time: new Date(BASE + i * 15 * 60000).toISOString(),
		a: i,
		b: i * 2,
		c: i * 3,
	};
}
let tf;
bench(`P3 TimeFrame constructor (${SMALL} rows x 3)`, () => {
	tf = new TimeFrame({ data: rows });
});
bench("P3 tf.atIndex x10", () => {
	for (let i = 0; i < 10; i++) {
		tf.atIndex(SMALL >> 1);
	}
});
bench("P3 tf.sum()", () => tf.sum());
