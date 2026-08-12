/**
 * Performance benchmark for the audit bottlenecks P1–P8 (see backlog.md).
 *
 * Run with: npm run bench   (builds first, then runs against build/main)
 *
 * Workloads mirror real usage: 15-min × 1 year (35,040 pts) and
 * 1-min × 1 year (525,600 pts).
 *
 * Baseline (after Batch 5, Node 24.16, Apple Silicon; single-shot numbers
 * vary ±40% with GC — v1.16.2 figures in parentheses):
 *   constructor 525k pre-sorted .  30.7 ms  (was 366)
 *   map 525k ....................  64.7 ms  (was 404)
 *   betweenTime 525k ............   0.2 ms  (was 585 first call)
 *   combine add 525k ............ 111.3 ms  (was 2042)
 *   interpolate 525k sparse ..... 156.3 ms  (was O(n²): 26.6 s at just 20k)
 *   resample 525k → 15min ....... 152.0 ms  (was 1743)
 *   reindex next-fill 35k .......  13.4 ms  (was 175)
 *   lastValidValue ×100 @525k ...   0.1 ms  (was 107)
 *   TimeFrame 35k×3 constructor .  24.0 ms  (was 48)
 *   tf.atIndex ×10 @35k .........   2.3 ms  (was 241)
 *   tf.sum() @35k×3 .............  32.9 ms  (was 124)
 * examples/random (525k×6): initTimeFrame 2.95s→0.89s, resample 4.4s→1.9s,
 * aggregate 3.0s→1.2s.
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
const INTERPOLATE_N = LARGE;
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
