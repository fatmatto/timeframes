# Remediation backlog — @apio/timeframes

Derived from the v1.16.2 audit (14 confirmed bugs, 8 measured bottlenecks). All findings
were reproduced against `build/main`; finding numbers below (**B1–B14**, **P1–P8**) refer to
the audit report.

## Target workloads

The library's typical inputs drive every priority and performance budget in this plan:

| Workload | Points | Notes |
|---|---|---|
| 15-min serie, 1 year | 35,040 | common case |
| 1-min serie, 1 year | 525,600 | worst common case |

Extrapolating the audit benchmarks to the 1-min/1-year serie (525k points):

| Operation | Today (extrapolated) | Budget after fix |
|---|---|---|
| `new TimeSerie` / `map` / `filter` (pre-sorted input) | ~450 ms **per derived serie** | ≤ 50 ms |
| `betweenTime` (first call) | ~800 ms | ≤ 5 ms |
| `serie.add(serie)` / `combine` | ~2.2 s | ≤ 50 ms |
| `interpolate` (sparse) | **hours** (O(n²)) | ≤ 150 ms |
| `resample` to 15-min buckets | ~2.5 s | ≤ 300 ms |

Every batch below ends with the full test suite green and the benchmark suite re-run.

---

## Batch 0 — Guardrails (do first, no production code changes)

Goal: make every later batch verifiable. Nothing else lands before this.

- [x] **0.1 Regression tests for all 14 bugs.** One failing test per audit finding
      (B1–B14), marked `test.failing` in ava until the fixing batch lands, then flipped.
      The audit repro script is the source for these cases.
- [x] **0.2 Benchmark harness** committed under `scripts/bench.js`, covering P1–P8 at
      35k and 525k points, runnable via `npm run bench`. Record baseline numbers in the
      script's header comment so regressions are visible in review.
- [x] **0.3 Audit existing specs for assertions that encode buggy behavior**
      (e.g. group-by-day, fill semantics). List them in the PR description of each
      later batch rather than silently rewriting them.

*Effort: S (half a day). Risk: none.*

---

## Batch 1 — Numeric correctness (small, isolated, high value)

Goal: aggregations return correct numbers. Fixes **B1, B8**; fixes perf **P2** as a side effect.

- [x] **1.1 Drop the Float32/SIMD path** (B1, P2). Replace `simd.sum_ver` +
      `padArray` + `Float32Array` in `sum()` and the `add`/`avg` combiners with a plain
      Float64 accumulation loop. Audit measured the plain loop ~70× faster at 10k points
      (allocation dominates) — this is a perf win, not a trade-off.
      Remove the `@fatmatto/simd-array` dependency.
- [x] **1.2 Rewrite the `sub`/`div` combiners** without the seed hacks
      (`points[0] * 2`, `points[0] * points[0]`) (B8). `div` of a 0 numerator must
      return 0, not NaN. Use an explicit first-element-then-fold loop.
- [x] **1.3 Optional: Kahan/pairwise summation** — *resolved: plain Float64 is
      sufficient; all reproduced precision cases pass with wide margin. Revisit
      only if very long money series surface drift in practice.*

*Effort: S. Risk: low — outputs change (become correct); flag in changelog.*
*Semver: patch.*

---

## Batch 2 — Fill & reindex semantics

Goal: `0` is a value, `fill` works, `reindex` doesn't crash or mutate inputs.
Fixes **B5, B6, B10**; fixes perf **P8** (O(n²) forward-fill) as a side effect.

- [x] **2.1 Presence checks use `hasValue()`** in `reindexWithBackfill` /
      `reindexWithForwardFill` instead of truthiness (B5). `0`, `false`, `""` are values.
- [x] **2.2 `fill: 0` honored everywhere** (B6): replace `fillValue || null` in
      `atTime` and `options?.fill || null` in `reindex` with `hasValueOr(...)`.
      Sweep for other `|| null` fill sites (`fromTimeseries`, `combine`).
- [x] **2.3 `reindex(idx)` without options works** (B10): default `options = {}`.
- [x] **2.4 Rewrite `reindexWithForwardFill`** (B10, P8): iterate the index backwards
      by position (no `idx.reverse()` mutation of the caller's array), build the output
      array in forward order (no per-element `unshift`), call `atTime` once per element.

*Effort: S–M. Risk: low. Semver: patch.*

---

## Batch 3 — Time core: normalize → sort on numbers (structural)

Goal: one canonical time representation, sorted once, compared numerically.
Fixes **B2**; fixes perf **P4, P5, P7** and most of the constructor tax that every other
operation pays. This is the highest-payoff and highest-risk batch — land it alone,
after Batches 1–2, with the benchmark run in the PR.

- [x] **3.1 Normalize before sorting** (B2). Constructor converts every timestamp to
      epoch-ms first, then sorts numerically, then renders ISO strings. Mixed input
      formats and non-UTC offsets become chronological. `TimeFrame`'s
      `CONSTRUCTOR_SORTER` gets the same treatment.
- [x] **3.2 Single consistent internal index** — *implemented differently than
      planned: instead of a parallel `number[]`, the constructor guarantees every
      stored timestamp is a canonical ISO-UTC string, so lexicographic order equals
      chronological order. All internal comparisons and binary searches run on the
      strings with zero Date allocations; the separately-sorted `_indexes.time` /
      tree pair on TimeSerie is gone entirely.*
- [x] **3.3 Sorted fast path** (P5): O(n) is-sorted check; skip the sort when input is
      already ordered (true for every internal `recreate`/`map`/`filter`/partition
      call). Skip re-normalization when timestamps are already ISO strings.
      Remove the redundant second `.sort()` in the constructor.
- [x] **3.4 Replace the red-black tree with binary search** (P4): `betweenTime` on
      serie and frame becomes two binary searches over the epoch-ms array + one
      `slice`. Delete `buildTimeTree`, drop `functional-red-black-tree` and
      `@types/functional-red-black-tree` dependencies. (Also removes the duplicated
      `test`/`buildIndexTest` helpers — keep one, in `utils.ts`.)
- [x] **3.5 Benchmark gate:** constructor ≤ 50 ms and `betweenTime` ≤ 5 ms at 525k
      points; `resample` 525k → 15-min buckets ≤ 300 ms (P6 falls out of 3.3).

*Effort: L (2–3 days incl. test fallout). Risk: medium — touches every code path;
mitigated by Batch 0 tests + benchmark gate. Semver: minor (behavior only changes
where it was wrong).*

---

## Batch 4 — O(n²) algorithms & accessor waste

Goal: linear-time algorithms for the remaining hot paths.
Fixes **B9, B11**; fixes perf **P1, P3** and the `last*` copy-reverse pattern.

- [ ] **4.1 Rewrite `linearInterpolation` as one forward pass** (B9, P1): carry
      `prevValid` index while walking, look ahead for `nextValid` only when entering a
      hole (resume from there). Explicitly handle boundary holes (leading/trailing
      nulls stay null — no crash) and interpolate `NaN` the same as `null`.
      Budget: ≤ 150 ms at 525k points (from 26.6 s at 20k today).
- [ ] **4.2 `last*` accessors iterate backwards** (`lastValidIndex`, `lastValidValue`,
      `lastValidAt`, `lastAt`) instead of `concat([]).reverse().find(...)`. With 3.2,
      `lastAt`/`firstAt` become binary searches.
- [ ] **4.3 `betweenIndexes` uses `slice`**, not a full-array `filter`.
- [ ] **4.4 `resample`/`first` on empty serie** (B11): use the same guarded
      `first()?.[0]` as `partition` so the intended "Cannot infer a lower bound" error
      is thrown, not a TypeError.

*Effort: M. Risk: low–medium (interpolation edge cases; covered by 0.1 tests).
Semver: patch (crash fixes) — NaN interpolation noted in changelog.*

---

## Batch 5 — TimeFrame integrity

Goal: frames are actually immutable and cheap to read.
Fixes **B3, B4, B12**; fixes perf **P3** (`atIndex`/`rows()` waste).

- [ ] **5.1 `renameColumns` clones** (B4): build new `TimeSerie` instances
      (`recreate` + new name) instead of `rename()`-ing the cached `_columns` of the
      source frame. Audit `rename()` call sites for the same aliasing.
- [ ] **5.2 Fix `fromTelemetryV1Output`** (B3): normalize the timestamp once into a
      variable and use it for both the existence check and the write (currently checks
      the raw key, writes the normalized key → wipes earlier columns). Stop mutating
      the caller's `metadata` argument — copy it.
- [ ] **5.3 Cache `rows()`** (P3) and make `atIndex` O(1) via direct lookup on the
      cached array (`_indexes.time[i]` + `data[time]`), computing `length` without
      materializing rows. Invalidation is trivial: frames are immutable after
      construction once 5.1 lands.
- [ ] **5.4 `reduce` with partial `operations`** (B12): implement the documented
      behavior — columns not covered by `operations` and with no default `operation`
      are omitted from the result.
- [ ] **5.5 `fromTimeseries` merge-walk** (added after Batch 3 profiling of
      examples/random): replace the per-cell `ts.atTime()` hash lookups with the
      same sorted merge-walk used by `TimeSerie.internals.combine`, and cut
      per-partition frame re-derivation in `resample`/`aggregate`. These now
      dominate the example's runtime (initTimeFrame 2.9 s, resample 4.4 s,
      aggregate 3.0 s at 525k×6).

*Effort: M. Risk: low. Semver: patch.*

---

## Batch 6 — API contract decisions (requires review — decide before coding)

These fixes change documented or long-standing observable behavior. Each needs a
decision; recommendations included. Ship together as the semver-major (2.0) if any
breaking option is chosen.

- [ ] **6.1 `group()` semantics** (B7). Three stacked problems: `by: "day"` uses
      `getDay()` (day-of-week, almost certainly a `getDate()` typo); keys are computed
      in **local** server time (results change per deployment TZ); keys don't compose
      across periods (Jan 2020 and Jan 2021 share a "month" bucket).
      **Recommendation:** compute keys in UTC from the epoch-ms index; make buckets
      calendar-composed (`2020-01`, `2020-01-15`, `2020-01-15T10`); keep a documented
      escape hatch if grouping-across-years (e.g. "all Mondays") is a real use case.
      *Breaking.*
- [ ] **6.2 `TimeFrame.concat` overlap** (B13): docs say throw, code merges silently.
      **Recommendation:** implement the throw (cheap with sorted epoch-ms indexes:
      compare boundary timestamps) — silent last-write-wins is the dangerous default.
      *Breaking for anyone relying on the merge; they should use `join`/`merge`.*
- [ ] **6.3 `TimeFrame.atTime` contract** (B14): docs say `Row | null`, code returns
      `{time}` for misses. **Recommendation:** return `null` on miss.
      *Breaking (mildly).*
- [ ] **6.4 Interpolate NaN policy** (ties to 4.1): treat NaN as a hole (recommended,
      pandas-like) — confirm here, implement in Batch 4.

*Effort: S–M once decided. Semver: major (2.0.0).*

---

## Sequencing & release plan

```
Batch 0 (guardrails)
   └─► Batch 1 (numeric)  ─► release 1.16.3 (patch)
   └─► Batch 2 (fill)     ─► release 1.16.4 (patch)   [parallel-safe with 1]
   └─► Batch 3 (time core) ─► release 1.17.0 (minor)  [alone, benchmark-gated]
        └─► Batch 4 (O(n²)) ─► release 1.17.1
        └─► Batch 5 (frames) ─► release 1.17.2        [parallel-safe with 4]
             └─► Batch 6 (contract changes) ─► release 2.0.0
```

- Batches 1 and 2 are independent quick wins; either order.
- Batch 3 is the structural change everything later leans on (binary search in 4.2,
  cheap concat-overlap check in 6.2). It goes in alone with before/after benchmarks
  in the PR.
- Batches 4 and 5 are independent of each other.
- Batch 6 waits for explicit sign-off on each decision.

## Definition of done (whole plan)

- All 14 regression tests from 0.1 pass un-`failing`-ed.
- Benchmark suite meets every budget in the workload table at 35k **and** 525k points.
- `npm test` green; coverage thresholds unchanged.
- Dependencies removed: `@fatmatto/simd-array`, `functional-red-black-tree`,
  `@types/functional-red-black-tree` (and `timsort` if 3.3 makes it redundant —
  native `Array.prototype.sort` is stable in all supported Node versions; note
  `engines.node >= 10` in package.json predates stable sort guarantees (Node 11+)
  and should be bumped anyway).
- CHANGELOG entries per batch, breaking changes called out for 2.0.0.
