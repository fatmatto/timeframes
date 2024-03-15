### new TimeFrame

Creates a Timeframe instance from a list of rows. It infers the list of column names from each row's fields.
So for example, a single row like 

```typescript
new TimeFrame(options: TimeFrameOptions) : TimeFrame
```

### add

Add a value to every element in the timeframe

```typescript
add(value: number) : TimeFrame
```

### addColumn

Add a column to the timeframe

```typescript
addColumn(serie: TimeSerie) : TimeFrame
```

### aggregate

Applies transformations to TimeFrame. Each transformation is defined as an operation between columns. Allows, for example, to
aggregate two columns into one by applying scalar operations element-wise.

```typescript
aggregate(agg: AggregationConfiguration) : TimeFrame
```

### apply

Applies transformations to the **columns** of the dataframe, each column is passed to the iterator like a timeserie.
If no column is specified, all columns will be used.
For mapping over rows, see map()

```typescript
apply(fn: TimeserieIterator,string[]) : TimeFrame
```

### atIndex

Get the row at the given index (position, not time)

```typescript
atIndex(index: number) : Row
```

### atTime

Returns a row at a given time or null

```typescript
atTime(time: string) : Row
```

### avg

Reduces the TimeFrame to a single Row representing the average of values in each column. The time is the FIRST index.

```typescript
avg() : Row
```

### betweenTime

Returns the subset of points between the two dates. Extremes are included.

```typescript
betweenTime(from: DateLike,to: DateLike,options: BetweenTimeOptions) : TimeFrame
```

### column

Returns the column as timeseries

```typescript
column(name: string) : TimeSerie
```

### columns

Returns every column as array of timeseries

```typescript
columns() : TimeSerie[]
```

### delta

Reduces the TimeFrame to a single Row representing the delta of values in each column. The time is the FIRST index.

```typescript
delta() : Row
```

### filter

Returns a new timeframe where each row satisfies the iterator function

```typescript
filter(fn: TimeframeRowsIterator) : TimeFrame
```

### first

Returns the first row

```typescript
first() : Row
```

### group

MISSING METHOD DESCRIPTION

```typescript
group(options: TimeFrameGroupOptions) : TimeFrame
```

### head

Returns the first 

```typescript
head(n: number) : TimeFrame
```

### indexes

Returns the time index array

```typescript
indexes() : DateLike[]
```

### join

Joins multiple timeframes by adding the columns together and merging indexes (time)

```typescript
join(TimeFrame[]) : TimeFrame
```

### last

Returns the last row

```typescript
last() : Row
```

### length

Returns the number of rows

```typescript
length() : number
```

### map

Returns a new timeframe where each **row** is mapped by the iterator function. For mapping over columns, use apply()

```typescript
map(fn: TimeframeRowsIterator) : TimeFrame
```

### max

Reduces the TimeFrame to a single Row representing the maximum of values in each column. The time is the FIRST index.

```typescript
max() : Row
```

### min

Reduces the TimeFrame to a single Row representing the minimum of values in each column. The time is the FIRST index.

```typescript
min() : Row
```

### mul

Multiply every element in the timeframe by a number

```typescript
mul(value: number) : TimeFrame
```

### partition

Partitions The TimeFrame into multiple sub timeframes by dividing the time column into even groups. Returns an array of sub TimeFrames.

```typescript
partition(options: IntervalOptions) : TimeFrame[]
```

### pipeline

Runs a series of transformations defined as an object. Useful in automation.
A stage is an object with a single key and a value, the key is the name of the method, the value is the params object

```typescript
pipeline(PipelineStage[]) : TimeFrame
```

### print

Pretty prints the TimeFrame to the console

```typescript
print() : void
```

### project

Returns a new timeframe with a subset of columns.

```typescript
project(config: ProjectionOptions) : TimeFrame
```

### recreate

Creates a new timeframe preserving the metadata but replacing data

```typescript
recreate(Row[],metadata: Metadata) : TimeFrame
```

### recreateFromSeries

Creates a new TimeFrame using this timeframe's metadata and using 

```typescript
recreateFromSeries(TimeSerie[]) : TimeFrame
```

### reduce

Reduces the timeframe to a new timeframe of a single row, where each
column is populated with the value of the aggregation function passed as
TimeFrameReduceOptions.defaultOperation or TimeFrameReduceOptions.operations[columnName]

If only operation is provided and it doesn't cover every column, the missing columns will be omitted
in the result timeframe.

```typescript
reduce(options: TimeFrameReduceOptions) : TimeFrame
```

### reindex

Recreates the serie's index

```typescript
reindex(index: Index,options: ReindexOptions) : TimeFrame
```

### resample

Resamples the timeframe by the specified time interval. Each row
of the result TimeFrame will be the result of the selected aggregation.

```typescript
resample(options: TimeFrameResampleOptions) : TimeFrame
```

### rows

Returns all the rows in an array

```typescript
rows() : Row[]
```

### shape

Returns the shape of the timeframe expressed as [rows,  columns] where columns excludes the time column

```typescript
shape() : number[]
```

### split

Splits a timeframe into multiple timeframes where each timeframe has
a maximum of 

```typescript
split(options: SplitOptions) : TimeFrame[]
```

### sum

Reduces the TimeFrame to a single Row representing the sum of values in each column. The time is the FIRST index.

```typescript
sum() : Row
```

### tail

Returns the last 

```typescript
tail(n: number) : TimeFrame
```

### concat

Concatenates timeframes. Throws error if overlapping times are found. Use join() to join together
timeframes with overlapping times

```typescript
concat(TimeFrame[]) : TimeFrame
```

### fromTelemetryV1Output

Creates a TimeFrame from a Telemetry Output Object (Apio private method)

```typescript
fromTelemetryV1Output(data: TelemetryV1Output,metadata: Metadata) : TimeFrame
```

### fromTimeseries

Returns a new TimeFrame, where each input timeserie is used as column

```typescript
fromTimeseries(TimeSerie[],options: FromTimeseriesOptions) : TimeFrame
```

### merge

Merges together rows and columns of the specified timeframes.
If two or more timeframes present a value for the same column at the same time, the first timeframe in the array has priority.

```typescript
merge(TimeFrame[]) : TimeFrame
```