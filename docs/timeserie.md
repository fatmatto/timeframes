### new TimeSerie

Creates a new timeserie.

```typescript
new TimeSerie(name: string,serie: undefined,metadata: Metadata) : TimeSerie
```

### add

Adds values to the timeserie. If a scalar is passed, its value is added to every point in the serie. If another serie
is passed, the two series are combined by addition.

```typescript
add(value: undefined) : TimeSerie
```

### atIndex

Returns the value at the given index.

```typescript
atIndex(index: number) : any
```

### atTime

Returns the value of the timeseries at the given time

```typescript
atTime(time: DateLike,fillValue: number) : any
```

### avg

Returns the average of the values in the serie

```typescript
avg() : Point
```

### betweenIndexes

Returns the subset of points between the two indexes. Extremes are included.

```typescript
betweenIndexes(from: number,to: number) : TimeSerie
```

### betweenTime

Returns the subset of points between the two dates. Extremes are included.

```typescript
betweenTime(from: DateLike,to: DateLike,options: undefined) : TimeSerie
```

### combine

Combine the current serie with an array of series y performing combination operations, such as multiplication, addition ecc.

```typescript
combine(operation: string,series: undefined,options: TimeSeriesOperationOptions) : TimeSerie
```

### copy

Copies the serie to a new serie

```typescript
copy() : TimeSerie
```

### delta

Returns the difference between the last and the first element by performing last value - first value.

```typescript
delta() : Point
```

### div

Divides values of the timeserie. If a scalar is passed, every point in the serie is divided by that value. If another serie
is passed, the two series are combined by division.

```typescript
div(value: undefined) : TimeSerie
```

### dropNaN

Removes points with NaN value from the serie

```typescript
dropNaN() : TimeSerie
```

### dropNull

Removes points with null value from the serie.

```typescript
dropNull() : TimeSerie
```

### filter

Builds a new serie by applying a filter function the current serie's points

```typescript
filter(fn: TimeseriePointIterator) : TimeSerie
```

### first

Returns the first point

```typescript
first() : Point
```

### firstAt

Returns the first point at or after a given timestamp

```typescript
firstAt(time: DateLike) : Point
```

### firstValidIndex

Returns the time of the first non-NaN value

```typescript
firstValidIndex() : string
```

### firstValidValue

Returns the first non-NaN value

```typescript
firstValidValue() : any
```

### indexes

Returns the array of time indexes

```typescript
indexes() : undefined
```

### isEmpty

Returns true if the serie has 0 points

```typescript
isEmpty() : boolean
```

### last

Returns the last point

```typescript
last() : Point
```

### lastValidIndex

Returns the time of the latest non-NaN value

```typescript
lastValidIndex() : string
```

### lastValidValue

Returns the latest non-NaN value

```typescript
lastValidValue() : any
```

### length

Returns the number of points in the serie.

```typescript
length() : number
```

### map

Builds a new serie by applying a map function the current serie's points

```typescript
map(fn: TimeseriePointIterator) : TimeSerie
```

### max

Returns the point with max value, or null

```typescript
max() : Point
```

### min

Returns the point with min value or null

```typescript
min() : Point
```

### mul

Multiplies values of the timeserie. If a scalar is passed, every point in the serie is multiplied times that value. If another serie
is passed, the two series are combined by multiplication.

```typescript
mul(value: undefined) : TimeSerie
```

### partition

Partitions The TimeSerie into multiple sub timeseries by dividing the time column into even groups. Returns an array of sub TimeSeries.

```typescript
partition(options: IntervalOptions) : undefined
```

### recreate

Creates a new serie preserving the name and the metadata but replacing data

```typescript
recreate(serie: undefined) : TimeSerie
```

### reduce

Reduces the timeserie to a new serie of a single point, applying a function

```typescript
reduce(options: TimeSerieReduceOptions) : TimeSerie
```

### reindex

Recreates the serie's index according to `options` and returns the reindexed serie.

```typescript
reindex(index: Index,options: ReindexOptions) : TimeSerie
```

### removeAt

Remove the point at the given time and returns a new serie

```typescript
removeAt(time: DateLike) : TimeSerie
```

### removeAtIndex

Remove the point at the given index and returns a new serie

```typescript
removeAtIndex(index: number) : TimeSerie
```

### removeBetweenTime

Returns the new timeserie without the removed data. Bounds are removed.

```typescript
removeBetweenTime(from: DateLike,to: DateLike) : TimeSerie
```

### rename

Updates (in place) the serie's name. **This method does NOT return a new timeserie**.

```typescript
rename(name: string) : TimeSerie
```

### resample

Resample the timeserie using a new time interval and a point aggregation function

```typescript
resample(options: ResampleOptions) : TimeSerie
```

### round

Rounds the serie's points.

```typescript
round(decimals: number) : TimeSerie
```

### sub

Subtracts values from the timeserie. If a scalar is passed, its value is subtracted from every point in the serie. If another serie
is passed, the two series are combined by subtraction.

```typescript
sub(value: undefined) : TimeSerie
```

### sum

Returns the sum of the values in the serie

```typescript
sum() : Point
```

### toArray

Returns the array of points, where each point is a tuple with ISO8601 timestamp and value

```typescript
toArray() : undefined
```

### values

Returns the array of values

```typescript
values() : undefined
```

### concat

Returns a new serie by appending series to the current one

```typescript
concat(series: undefined) : TimeSerie
```

### fromIndex

Creates a new TimeSerie from the given Index. The new serie's values are all set to `null` unless `options.fill` is passed.

```typescript
fromIndex(index: Index,options: FromIndexOptions) : TimeSerie
```