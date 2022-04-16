@apio/timeframes / [Exports](modules.md)

# timeframes

Library for dealing with timeseries data with an api similar to pandas

## TimeSeries

```javascript
// Pass an array of points
// a point is a tuple [DateLike, PointValue]
// DateLike is value that can be passed to new Date()
// PointValue is any value, but preferably a number (to compute sums averages ecc)
const ts = new TimeSerie([["2022-01-01", 12],["2022-01-02", 13]])
const sum = ts.sum()
const avg = ts.avg()
```

## TimeFrames

```javascript

// Each item is a row
const rows = [
  {time: "2022-01-01", value1:10, value2:140},
  {time: "2022-01-02", value1:41}, // here value2 is null
  {time: "2022-01-03", value1:78, value2:301},
]
const ts = new TimeFrame(rows)
// column() extracts columns as timeseries
const total1 = ts.column("value1").sum()
```
