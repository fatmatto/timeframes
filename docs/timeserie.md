### new TimeSerie

MISSING METHOD DESCRIPTION

```typescript
new TimeSerie(name: string,serie: undefined,metadata: Metadata) : TimeSerie
```

### add

MISSING METHOD DESCRIPTION

```typescript
add(value: undefined) : TimeSerie
```

### atIndex

MISSING METHOD DESCRIPTION

```typescript
atIndex(index: number) : any
```

### atTime

MISSING METHOD DESCRIPTION

```typescript
atTime(time: DateLike,fillValue: number) : any
```

### avg

MISSING METHOD DESCRIPTION

```typescript
avg() : Point
```

### betweenIndexes

MISSING METHOD DESCRIPTION

```typescript
betweenIndexes(from: number,to: number) : TimeSerie
```

### betweenTime

MISSING METHOD DESCRIPTION

```typescript
betweenTime(from: DateLike,to: DateLike,options: undefined) : TimeSerie
```

### combine

MISSING METHOD DESCRIPTION

```typescript
combine(operation: string,series: undefined,options: TimeSeriesOperationOptions) : TimeSerie
```

### copy

MISSING METHOD DESCRIPTION

```typescript
copy() : TimeSerie
```

### delta

MISSING METHOD DESCRIPTION

```typescript
delta() : Point
```

### div

MISSING METHOD DESCRIPTION

```typescript
div(value: undefined) : TimeSerie
```

### dropNaN

MISSING METHOD DESCRIPTION

```typescript
dropNaN() : TimeSerie
```

### dropNull

MISSING METHOD DESCRIPTION

```typescript
dropNull() : TimeSerie
```

### filter

MISSING METHOD DESCRIPTION

```typescript
filter(fn: TimeseriePointIterator) : TimeSerie
```

### first

MISSING METHOD DESCRIPTION

```typescript
first() : Point
```

### firstAt

Returns the first point at or after a given timestamp

```typescript
firstAt(time: DateLike) : Point
```

### firstValidIndex

MISSING METHOD DESCRIPTION

```typescript
firstValidIndex() : string
```

### firstValidValue

MISSING METHOD DESCRIPTION

```typescript
firstValidValue() : any
```

### indexes

MISSING METHOD DESCRIPTION

```typescript
indexes() : undefined
```

### isEmpty

MISSING METHOD DESCRIPTION

```typescript
isEmpty() : boolean
```

### last

MISSING METHOD DESCRIPTION

```typescript
last() : Point
```

### lastValidIndex

MISSING METHOD DESCRIPTION

```typescript
lastValidIndex() : string
```

### lastValidValue

MISSING METHOD DESCRIPTION

```typescript
lastValidValue() : any
```

### length

MISSING METHOD DESCRIPTION

```typescript
length() : number
```

### map

MISSING METHOD DESCRIPTION

```typescript
map(fn: TimeseriePointIterator) : TimeSerie
```

### max

MISSING METHOD DESCRIPTION

```typescript
max() : Point
```

### min

MISSING METHOD DESCRIPTION

```typescript
min() : Point
```

### mul

MISSING METHOD DESCRIPTION

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

Recreates the serie's index

```typescript
reindex(index: Index,options: ReindexOptions) : TimeSerie
```

### removeAt

MISSING METHOD DESCRIPTION

```typescript
removeAt(time: DateLike) : TimeSerie
```

### removeAtIndex

MISSING METHOD DESCRIPTION

```typescript
removeAtIndex(index: number) : TimeSerie
```

### removeBetweenTime

MISSING METHOD DESCRIPTION

```typescript
removeBetweenTime(from: DateLike,to: DateLike) : TimeSerie
```

### rename

MISSING METHOD DESCRIPTION

```typescript
rename(name: string) : TimeSerie
```

### resample

Resample the timeserie using a new time interval and a point aggregation function

```typescript
resample(options: ResampleOptions) : TimeSerie
```

### round

MISSING METHOD DESCRIPTION

```typescript
round(decimals: number) : TimeSerie
```

### sub

MISSING METHOD DESCRIPTION

```typescript
sub(value: undefined) : TimeSerie
```

### sum

MISSING METHOD DESCRIPTION

```typescript
sum() : Point
```

### toArray

MISSING METHOD DESCRIPTION

```typescript
toArray() : undefined
```

### values

MISSING METHOD DESCRIPTION

```typescript
values() : undefined
```

### concat

Returns a new serie by appending series to the current one

```typescript
concat(series: undefined) : TimeSerie
```

### fromIndex

MISSING METHOD DESCRIPTION

```typescript
fromIndex(index: Index,options: FromIndexOptions) : TimeSerie
```