[@apio/timeframes](../README.md) / [Modules](../modules.md) / [lib/timeframe](../modules/lib_timeframe.md) / TimeFrame

# Class: TimeFrame

[lib/timeframe](../modules/lib_timeframe.md).TimeFrame

## Table of contents

### Constructors

- [constructor](lib_timeframe.TimeFrame.md#constructor)

### Properties

- [\_indexes](lib_timeframe.TimeFrame.md#_indexes)
- [columnNames](lib_timeframe.TimeFrame.md#columnnames)
- [data](lib_timeframe.TimeFrame.md#data)
- [metadata](lib_timeframe.TimeFrame.md#metadata)

### Methods

- [add](lib_timeframe.TimeFrame.md#add)
- [addColumn](lib_timeframe.TimeFrame.md#addcolumn)
- [aggregate](lib_timeframe.TimeFrame.md#aggregate)
- [apply](lib_timeframe.TimeFrame.md#apply)
- [atIndex](lib_timeframe.TimeFrame.md#atindex)
- [atTime](lib_timeframe.TimeFrame.md#attime)
- [avg](lib_timeframe.TimeFrame.md#avg)
- [betweenTime](lib_timeframe.TimeFrame.md#betweentime)
- [buildTimeCheckpoints](lib_timeframe.TimeFrame.md#buildtimecheckpoints)
- [column](lib_timeframe.TimeFrame.md#column)
- [columns](lib_timeframe.TimeFrame.md#columns)
- [delta](lib_timeframe.TimeFrame.md#delta)
- [filter](lib_timeframe.TimeFrame.md#filter)
- [first](lib_timeframe.TimeFrame.md#first)
- [indexes](lib_timeframe.TimeFrame.md#indexes)
- [join](lib_timeframe.TimeFrame.md#join)
- [last](lib_timeframe.TimeFrame.md#last)
- [length](lib_timeframe.TimeFrame.md#length)
- [map](lib_timeframe.TimeFrame.md#map)
- [max](lib_timeframe.TimeFrame.md#max)
- [min](lib_timeframe.TimeFrame.md#min)
- [mul](lib_timeframe.TimeFrame.md#mul)
- [partition](lib_timeframe.TimeFrame.md#partition)
- [print](lib_timeframe.TimeFrame.md#print)
- [project](lib_timeframe.TimeFrame.md#project)
- [recreate](lib_timeframe.TimeFrame.md#recreate)
- [recreateFromSeries](lib_timeframe.TimeFrame.md#recreatefromseries)
- [reduce](lib_timeframe.TimeFrame.md#reduce)
- [reindex](lib_timeframe.TimeFrame.md#reindex)
- [resample](lib_timeframe.TimeFrame.md#resample)
- [rows](lib_timeframe.TimeFrame.md#rows)
- [shape](lib_timeframe.TimeFrame.md#shape)
- [sum](lib_timeframe.TimeFrame.md#sum)
- [concat](lib_timeframe.TimeFrame.md#concat)
- [fromInternalFormat](lib_timeframe.TimeFrame.md#frominternalformat)
- [fromTelemetryV1Output](lib_timeframe.TimeFrame.md#fromtelemetryv1output)
- [fromTimeseries](lib_timeframe.TimeFrame.md#fromtimeseries)

## Constructors

### constructor

• **new TimeFrame**(`options`)

Creates a Timeframe instance from a list of rows. It infers the list of column names from each row's fields.
So for example, a single row like `{time: Date.now(), temperature:20, humidity: 40}` would create two columns

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `TimeFrameOptions` |

#### Defined in

[lib/timeframe.ts:35](https://github.com/fatmatto/timeframes/blob/a240807/src/lib/timeframe.ts#L35)

## Properties

### \_indexes

• `Private` **\_indexes**: `any`

#### Defined in

[lib/timeframe.ts:28](https://github.com/fatmatto/timeframes/blob/a240807/src/lib/timeframe.ts#L28)

___

### columnNames

• **columnNames**: `string`[] = `[]`

#### Defined in

[lib/timeframe.ts:26](https://github.com/fatmatto/timeframes/blob/a240807/src/lib/timeframe.ts#L26)

___

### data

• `Private` `Readonly` **data**: [`TimeFrameInternal`](../modules/lib_types.md#timeframeinternal) = `{}`

#### Defined in

[lib/timeframe.ts:25](https://github.com/fatmatto/timeframes/blob/a240807/src/lib/timeframe.ts#L25)

___

### metadata

• **metadata**: [`Metadata`](../modules/lib_types.md#metadata) = `{}`

#### Defined in

[lib/timeframe.ts:27](https://github.com/fatmatto/timeframes/blob/a240807/src/lib/timeframe.ts#L27)

## Methods

### add

▸ **add**(`value`): [`TimeFrame`](lib_timeframe.TimeFrame.md)

Add a value to every element in the timeframe

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |

#### Returns

[`TimeFrame`](lib_timeframe.TimeFrame.md)

#### Defined in

[lib/timeframe.ts:336](https://github.com/fatmatto/timeframes/blob/a240807/src/lib/timeframe.ts#L336)

___

### addColumn

▸ **addColumn**(`serie`): [`TimeFrame`](lib_timeframe.TimeFrame.md)

Add a column to the timeframe

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `serie` | [`TimeSerie`](lib_timeserie.TimeSerie.md) | The new column |

#### Returns

[`TimeFrame`](lib_timeframe.TimeFrame.md)

#### Defined in

[lib/timeframe.ts:192](https://github.com/fatmatto/timeframes/blob/a240807/src/lib/timeframe.ts#L192)

___

### aggregate

▸ **aggregate**(`agg`): [`TimeFrame`](lib_timeframe.TimeFrame.md)

Applies transformations to TimeFrame. Each transformation is defined as an operation between columns. Allows, for example, to
aggregate two columns into one by applying scalar operations element-wise.

**`example`**
// Creates a 3 new cilumns named power1,power2 and power3 by  multiplying other columns
// Then combines the 3 powerN by addition
// The resulting TimeFrame has only 1 column named power
tf = tf.aggregate({ output: 'power1', columns: ['voltage1', 'current1'], operation: 'mul' })
.aggregate({ output: 'power', columns: ['power1', 'power2', 'power3'], operation: 'add'})

#### Parameters

| Name | Type |
| :------ | :------ |
| `agg` | [`AggregationConfiguration`](../interfaces/lib_types.AggregationConfiguration.md) |

#### Returns

[`TimeFrame`](lib_timeframe.TimeFrame.md)

#### Defined in

[lib/timeframe.ts:406](https://github.com/fatmatto/timeframes/blob/a240807/src/lib/timeframe.ts#L406)

___

### apply

▸ **apply**(`fn`, `columns?`): [`TimeFrame`](lib_timeframe.TimeFrame.md)

Applies transformations to the **columns** of the dataframe, each column is passed to the iterator like a timeserie.
If no column is specified, all columns will be used.
For mapping over rows, see map()

#### Parameters

| Name | Type |
| :------ | :------ |
| `fn` | [`TimeserieIterator`](../modules/lib_types.md#timeserieiterator) |
| `columns` | `string`[] |

#### Returns

[`TimeFrame`](lib_timeframe.TimeFrame.md)

#### Defined in

[lib/timeframe.ts:478](https://github.com/fatmatto/timeframes/blob/a240807/src/lib/timeframe.ts#L478)

___

### atIndex

▸ **atIndex**(`index`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `index` | `number` |

#### Returns

`any`

The row at the given index (position, not time)

#### Defined in

[lib/timeframe.ts:250](https://github.com/fatmatto/timeframes/blob/a240807/src/lib/timeframe.ts#L250)

___

### atTime

▸ **atTime**(`time`): [`Row`](../interfaces/lib_types.Row.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `time` | `string` |

#### Returns

[`Row`](../interfaces/lib_types.Row.md)

A row at a given time or null

#### Defined in

[lib/timeframe.ts:242](https://github.com/fatmatto/timeframes/blob/a240807/src/lib/timeframe.ts#L242)

___

### avg

▸ **avg**(): [`Row`](../interfaces/lib_types.Row.md)

Reduces the TimeFrame to a single Row representing the average of values in each column. The time is the FIRST index.

#### Returns

[`Row`](../interfaces/lib_types.Row.md)

#### Defined in

[lib/timeframe.ts:300](https://github.com/fatmatto/timeframes/blob/a240807/src/lib/timeframe.ts#L300)

___

### betweenTime

▸ **betweenTime**(`from`, `to`, `options?`): [`TimeFrame`](lib_timeframe.TimeFrame.md)

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `from` | [`DateLike`](../modules/lib_types.md#datelike) | `undefined` | start date string in ISO8601 format |
| `to` | [`DateLike`](../modules/lib_types.md#datelike) | `undefined` | end date string in ISO8601 format |
| `options` | `Object` | `undefined` | - |
| `options.includeInferior` | `boolean` | `true` | - |
| `options.includeSuperior` | `boolean` | `true` | - |

#### Returns

[`TimeFrame`](lib_timeframe.TimeFrame.md)

The subset of points between the two dates. Extremes are included.

#### Defined in

[lib/timeframe.ts:357](https://github.com/fatmatto/timeframes/blob/a240807/src/lib/timeframe.ts#L357)

___

### buildTimeCheckpoints

▸ `Private` **buildTimeCheckpoints**(): `void`

#### Returns

`void`

#### Defined in

[lib/timeframe.ts:70](https://github.com/fatmatto/timeframes/blob/a240807/src/lib/timeframe.ts#L70)

___

### column

▸ **column**(`name`): [`TimeSerie`](lib_timeserie.TimeSerie.md)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | The name of the wanted column |

#### Returns

[`TimeSerie`](lib_timeserie.TimeSerie.md)

The column as timeseries

#### Defined in

[lib/timeframe.ts:201](https://github.com/fatmatto/timeframes/blob/a240807/src/lib/timeframe.ts#L201)

___

### columns

▸ **columns**(): [`TimeSerie`](lib_timeserie.TimeSerie.md)[]

#### Returns

[`TimeSerie`](lib_timeserie.TimeSerie.md)[]

#### Defined in

[lib/timeframe.ts:210](https://github.com/fatmatto/timeframes/blob/a240807/src/lib/timeframe.ts#L210)

___

### delta

▸ **delta**(): [`Row`](../interfaces/lib_types.Row.md)

Reduces the TimeFrame to a single Row representing the delta of values in each column. The time is the FIRST index.

#### Returns

[`Row`](../interfaces/lib_types.Row.md)

#### Defined in

[lib/timeframe.ts:309](https://github.com/fatmatto/timeframes/blob/a240807/src/lib/timeframe.ts#L309)

___

### filter

▸ **filter**(`fn`): [`TimeFrame`](lib_timeframe.TimeFrame.md)

Returns a new timeframe where each row satisfies the iterator function

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fn` | [`TimeframeRowsIterator`](../modules/lib_types.md#timeframerowsiterator) | Iterator function |

#### Returns

[`TimeFrame`](lib_timeframe.TimeFrame.md)

#### Defined in

[lib/timeframe.ts:459](https://github.com/fatmatto/timeframes/blob/a240807/src/lib/timeframe.ts#L459)

___

### first

▸ **first**(): [`Row`](../interfaces/lib_types.Row.md)

#### Returns

[`Row`](../interfaces/lib_types.Row.md)

The first row

#### Defined in

[lib/timeframe.ts:273](https://github.com/fatmatto/timeframes/blob/a240807/src/lib/timeframe.ts#L273)

___

### indexes

▸ **indexes**(): [`DateLike`](../modules/lib_types.md#datelike)[]

#### Returns

[`DateLike`](../modules/lib_types.md#datelike)[]

#### Defined in

[lib/timeframe.ts:222](https://github.com/fatmatto/timeframes/blob/a240807/src/lib/timeframe.ts#L222)

___

### join

▸ **join**(`timeframes`): [`TimeFrame`](lib_timeframe.TimeFrame.md)

Joins multiple timeframes by adding the columns together and merging indexes (time)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `timeframes` | [`TimeFrame`](lib_timeframe.TimeFrame.md)[] | Array of timeframes to join together |

#### Returns

[`TimeFrame`](lib_timeframe.TimeFrame.md)

A timeframe with joined columns

#### Defined in

[lib/timeframe.ts:183](https://github.com/fatmatto/timeframes/blob/a240807/src/lib/timeframe.ts#L183)

___

### last

▸ **last**(): [`Row`](../interfaces/lib_types.Row.md)

#### Returns

[`Row`](../interfaces/lib_types.Row.md)

The last row

#### Defined in

[lib/timeframe.ts:282](https://github.com/fatmatto/timeframes/blob/a240807/src/lib/timeframe.ts#L282)

___

### length

▸ **length**(): `number`

#### Returns

`number`

#### Defined in

[lib/timeframe.ts:257](https://github.com/fatmatto/timeframes/blob/a240807/src/lib/timeframe.ts#L257)

___

### map

▸ **map**(`fn`): [`TimeFrame`](lib_timeframe.TimeFrame.md)

Returns a new timeframe where each **row** is mapped by the iterator function. For mapping over columns, use apply()

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fn` | [`TimeframeRowsIterator`](../modules/lib_types.md#timeframerowsiterator) | Iterator function |

#### Returns

[`TimeFrame`](lib_timeframe.TimeFrame.md)

#### Defined in

[lib/timeframe.ts:468](https://github.com/fatmatto/timeframes/blob/a240807/src/lib/timeframe.ts#L468)

___

### max

▸ **max**(): [`Row`](../interfaces/lib_types.Row.md)

Reduces the TimeFrame to a single Row representing the maximum of values in each column. The time is the FIRST index.

#### Returns

[`Row`](../interfaces/lib_types.Row.md)

#### Defined in

[lib/timeframe.ts:318](https://github.com/fatmatto/timeframes/blob/a240807/src/lib/timeframe.ts#L318)

___

### min

▸ **min**(): [`Row`](../interfaces/lib_types.Row.md)

Reduces the TimeFrame to a single Row representing the minimum of values in each column. The time is the FIRST index.

#### Returns

[`Row`](../interfaces/lib_types.Row.md)

#### Defined in

[lib/timeframe.ts:327](https://github.com/fatmatto/timeframes/blob/a240807/src/lib/timeframe.ts#L327)

___

### mul

▸ **mul**(`value`): [`TimeFrame`](lib_timeframe.TimeFrame.md)

Multiply every element in the timeframe by a number

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |

#### Returns

[`TimeFrame`](lib_timeframe.TimeFrame.md)

#### Defined in

[lib/timeframe.ts:345](https://github.com/fatmatto/timeframes/blob/a240807/src/lib/timeframe.ts#L345)

___

### partition

▸ **partition**(`options`): [`TimeFrame`](lib_timeframe.TimeFrame.md)[]

Partitions The TimeFrame into multiple sub timeframes by dividing the time column into even groups. Returns an array of sub TimeFrames.

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`IntervalOptions`](../modules/lib_types.md#intervaloptions) |

#### Returns

[`TimeFrame`](lib_timeframe.TimeFrame.md)[]

#### Defined in

[lib/timeframe.ts:492](https://github.com/fatmatto/timeframes/blob/a240807/src/lib/timeframe.ts#L492)

___

### print

▸ **print**(): `void`

Pretty prints the TimeFrame to the console

#### Returns

`void`

#### Defined in

[lib/timeframe.ts:520](https://github.com/fatmatto/timeframes/blob/a240807/src/lib/timeframe.ts#L520)

___

### project

▸ **project**(`columns`): [`TimeFrame`](lib_timeframe.TimeFrame.md)

Returns a new timeframe with a subset of columns.

#### Parameters

| Name | Type |
| :------ | :------ |
| `columns` | `string`[] |

#### Returns

[`TimeFrame`](lib_timeframe.TimeFrame.md)

#### Defined in

[lib/timeframe.ts:229](https://github.com/fatmatto/timeframes/blob/a240807/src/lib/timeframe.ts#L229)

___

### recreate

▸ **recreate**(`data`): [`TimeFrame`](lib_timeframe.TimeFrame.md)

Creates a new timeframe preserving the metadata but replacing data

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | [`Row`](../interfaces/lib_types.Row.md)[] | The new data to recreate the serie from |

#### Returns

[`TimeFrame`](lib_timeframe.TimeFrame.md)

#### Defined in

[lib/timeframe.ts:86](https://github.com/fatmatto/timeframes/blob/a240807/src/lib/timeframe.ts#L86)

___

### recreateFromSeries

▸ **recreateFromSeries**(`series`): [`TimeFrame`](lib_timeframe.TimeFrame.md)

Creates a new TimeFrame using this timeframe's metadata and using `series` as columns.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `series` | [`TimeSerie`](lib_timeserie.TimeSerie.md)[] | Array of timeseries which will be used as timeframe columns |

#### Returns

[`TimeFrame`](lib_timeframe.TimeFrame.md)

#### Defined in

[lib/timeframe.ts:95](https://github.com/fatmatto/timeframes/blob/a240807/src/lib/timeframe.ts#L95)

___

### reduce

▸ **reduce**(`options`): [`TimeFrame`](lib_timeframe.TimeFrame.md)

Reduces the timeframe to a new timeframe of a single row, where each
column is populated with the value of the aggregation function passed as
TimeFrameReduceOptions.defaultOperation or TimeFrameReduceOptions.operations[columnName]

If only operation is provided and it doesn't cover every column, the missing columns will be omitted
in the result timeframe.

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`TimeFrameReduceOptions`](../modules/lib_types.md#timeframereduceoptions) |

#### Returns

[`TimeFrame`](lib_timeframe.TimeFrame.md)

#### Defined in

[lib/timeframe.ts:431](https://github.com/fatmatto/timeframes/blob/a240807/src/lib/timeframe.ts#L431)

___

### reindex

▸ **reindex**(`index`, `options?`): [`TimeFrame`](lib_timeframe.TimeFrame.md)

Recreates the serie's index

**`see`** createIndex

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `index` | [`Index`](../modules/lib_types.md#index) | The new index to use. Can be created with createIndex() |
| `options?` | [`ReindexOptions`](../interfaces/lib_types.ReindexOptions.md) |  |

#### Returns

[`TimeFrame`](lib_timeframe.TimeFrame.md)

The reindexed timeserie

#### Defined in

[lib/timeframe.ts:108](https://github.com/fatmatto/timeframes/blob/a240807/src/lib/timeframe.ts#L108)

___

### resample

▸ **resample**(`options`): [`TimeFrame`](lib_timeframe.TimeFrame.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`TimeFrameResampleOptions`](../modules/lib_types.md#timeframeresampleoptions) |

#### Returns

[`TimeFrame`](lib_timeframe.TimeFrame.md)

#### Defined in

[lib/timeframe.ts:441](https://github.com/fatmatto/timeframes/blob/a240807/src/lib/timeframe.ts#L441)

___

### rows

▸ **rows**(): [`Row`](../interfaces/lib_types.Row.md)[]

#### Returns

[`Row`](../interfaces/lib_types.Row.md)[]

Array of rows

#### Defined in

[lib/timeframe.ts:218](https://github.com/fatmatto/timeframes/blob/a240807/src/lib/timeframe.ts#L218)

___

### shape

▸ **shape**(): `number`[]

Returns the shape of the timeframe

#### Returns

`number`[]

Array<Number> The shape of the timeframe expressed as [rows,  columns] where columns excludes the time column

#### Defined in

[lib/timeframe.ts:265](https://github.com/fatmatto/timeframes/blob/a240807/src/lib/timeframe.ts#L265)

___

### sum

▸ **sum**(): [`Row`](../interfaces/lib_types.Row.md)

Reduces the TimeFrame to a single Row representing the sum of values in each column. The time is the FIRST index.

#### Returns

[`Row`](../interfaces/lib_types.Row.md)

#### Defined in

[lib/timeframe.ts:291](https://github.com/fatmatto/timeframes/blob/a240807/src/lib/timeframe.ts#L291)

___

### concat

▸ `Static` **concat**(`timeframes`): [`TimeFrame`](lib_timeframe.TimeFrame.md)

Concatenates timeframes. Throws error if overlapping times are found. Use join() to join together
timeframes with overlapping times

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `timeframes` | [`TimeFrame`](lib_timeframe.TimeFrame.md)[] | Array of timeframes to concatenate |

#### Returns

[`TimeFrame`](lib_timeframe.TimeFrame.md)

#### Defined in

[lib/timeframe.ts:171](https://github.com/fatmatto/timeframes/blob/a240807/src/lib/timeframe.ts#L171)

___

### fromInternalFormat

▸ `Static` **fromInternalFormat**(`data`, `metadata?`): [`TimeFrame`](lib_timeframe.TimeFrame.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [`TimeFrameInternal`](../modules/lib_types.md#timeframeinternal) |
| `metadata?` | [`Metadata`](../modules/lib_types.md#metadata) |

#### Returns

[`TimeFrame`](lib_timeframe.TimeFrame.md)

#### Defined in

[lib/timeframe.ts:140](https://github.com/fatmatto/timeframes/blob/a240807/src/lib/timeframe.ts#L140)

___

### fromTelemetryV1Output

▸ `Static` **fromTelemetryV1Output**(`data?`, `metadata?`): [`TimeFrame`](lib_timeframe.TimeFrame.md)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | [`TelemetryV1Output`](../interfaces/lib_types.TelemetryV1Output.md) | An object which is telemetry V1 output (Apio Internal) |
| `metadata` | [`Metadata`](../modules/lib_types.md#metadata) | - |

#### Returns

[`TimeFrame`](lib_timeframe.TimeFrame.md)

#### Defined in

[lib/timeframe.ts:117](https://github.com/fatmatto/timeframes/blob/a240807/src/lib/timeframe.ts#L117)

___

### fromTimeseries

▸ `Static` **fromTimeseries**(`timeseries`, `options?`): [`TimeFrame`](lib_timeframe.TimeFrame.md)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `timeseries` | [`TimeSerie`](lib_timeserie.TimeSerie.md)[] | An array of TimeSerie objects |
| `options?` | [`FromTimeseriesOptions`](../interfaces/lib_types.FromTimeseriesOptions.md) | - |

#### Returns

[`TimeFrame`](lib_timeframe.TimeFrame.md)

A new TimeFrame, where each timeserie represent a column

#### Defined in

[lib/timeframe.ts:153](https://github.com/fatmatto/timeframes/blob/a240807/src/lib/timeframe.ts#L153)
