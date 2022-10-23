[@apio/timeframes](../README.md) / [Modules](../modules.md) / [lib/timeframe](../modules/lib_timeframe.md) / TimeFrame

# Class: TimeFrame

[lib/timeframe](../modules/lib_timeframe.md).TimeFrame

## Table of contents

### Constructors

- [constructor](lib_timeframe.TimeFrame.md#constructor)

### Properties

- [columnNames](lib_timeframe.TimeFrame.md#columnnames)
- [data](lib_timeframe.TimeFrame.md#data)
- [indexes](lib_timeframe.TimeFrame.md#indexes)
- [metadata](lib_timeframe.TimeFrame.md#metadata)

### Methods

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
- [join](lib_timeframe.TimeFrame.md#join)
- [last](lib_timeframe.TimeFrame.md#last)
- [length](lib_timeframe.TimeFrame.md#length)
- [map](lib_timeframe.TimeFrame.md#map)
- [max](lib_timeframe.TimeFrame.md#max)
- [min](lib_timeframe.TimeFrame.md#min)
- [partition](lib_timeframe.TimeFrame.md#partition)
- [print](lib_timeframe.TimeFrame.md#print)
- [project](lib_timeframe.TimeFrame.md#project)
- [recreate](lib_timeframe.TimeFrame.md#recreate)
- [recreateFromSeries](lib_timeframe.TimeFrame.md#recreatefromseries)
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

[lib/timeframe.ts:34](https://github.com/fatmatto/timeframes/blob/497de10/src/lib/timeframe.ts#L34)

## Properties

### columnNames

• **columnNames**: `string`[] = `[]`

#### Defined in

[lib/timeframe.ts:25](https://github.com/fatmatto/timeframes/blob/497de10/src/lib/timeframe.ts#L25)

___

### data

• `Private` `Readonly` **data**: [`TimeFrameInternal`](../modules/lib_types.md#timeframeinternal) = `{}`

#### Defined in

[lib/timeframe.ts:24](https://github.com/fatmatto/timeframes/blob/497de10/src/lib/timeframe.ts#L24)

___

### indexes

• `Private` **indexes**: `any`

#### Defined in

[lib/timeframe.ts:27](https://github.com/fatmatto/timeframes/blob/497de10/src/lib/timeframe.ts#L27)

___

### metadata

• **metadata**: [`Metadata`](../modules/lib_types.md#metadata) = `{}`

#### Defined in

[lib/timeframe.ts:26](https://github.com/fatmatto/timeframes/blob/497de10/src/lib/timeframe.ts#L26)

## Methods

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

[lib/timeframe.ts:177](https://github.com/fatmatto/timeframes/blob/497de10/src/lib/timeframe.ts#L177)

___

### aggregate

▸ **aggregate**(`aggregations`, `options?`): [`TimeFrame`](lib_timeframe.TimeFrame.md)

Applies transformations to TimeFrame. Each transformation is defined as an operation between columns. Allows, for example, to
aggregate two columns into one by applying scalar operations element-wise.

**`example`**
// Creates a 3 new cilumns named power1,power2 and power3 by  multiplying other columns
// Then combines the 3 powerN by addition
// The resulting TimeFrame has only 1 column named power
tf = tf.aggregate([
  { output: 'power1', columns: ['voltage1', 'current1'], operation: 'mul' },
  { output: 'power2', columns: ['voltage2', 'current2'], operation: 'mul' },
 { output: 'power3', columns: ['voltage3', 'current3'], operation: 'mul' }
])
.aggregate([{ output: 'power', columns: ['power1', 'power2', 'power3'], operation: 'add'}])

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `aggregations` | [`AggregationConfiguration`](../interfaces/lib_types.AggregationConfiguration.md)[] | An array of AggregationConfigurations |
| `options` | [`AggregationOptions`](../interfaces/lib_types.AggregationOptions.md) | - |

#### Returns

[`TimeFrame`](lib_timeframe.TimeFrame.md)

#### Defined in

[lib/timeframe.ts:373](https://github.com/fatmatto/timeframes/blob/497de10/src/lib/timeframe.ts#L373)

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

[lib/timeframe.ts:420](https://github.com/fatmatto/timeframes/blob/497de10/src/lib/timeframe.ts#L420)

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

[lib/timeframe.ts:231](https://github.com/fatmatto/timeframes/blob/497de10/src/lib/timeframe.ts#L231)

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

[lib/timeframe.ts:223](https://github.com/fatmatto/timeframes/blob/497de10/src/lib/timeframe.ts#L223)

___

### avg

▸ **avg**(): [`Row`](../interfaces/lib_types.Row.md)

Reduces the TimeFrame to a single Row representing the average of values in each column. The time is the FIRST index.

#### Returns

[`Row`](../interfaces/lib_types.Row.md)

#### Defined in

[lib/timeframe.ts:281](https://github.com/fatmatto/timeframes/blob/497de10/src/lib/timeframe.ts#L281)

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

[lib/timeframe.ts:320](https://github.com/fatmatto/timeframes/blob/497de10/src/lib/timeframe.ts#L320)

___

### buildTimeCheckpoints

▸ `Private` **buildTimeCheckpoints**(): `void`

#### Returns

`void`

#### Defined in

[lib/timeframe.ts:69](https://github.com/fatmatto/timeframes/blob/497de10/src/lib/timeframe.ts#L69)

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

[lib/timeframe.ts:186](https://github.com/fatmatto/timeframes/blob/497de10/src/lib/timeframe.ts#L186)

___

### columns

▸ **columns**(): [`TimeSerie`](lib_timeserie.TimeSerie.md)[]

#### Returns

[`TimeSerie`](lib_timeserie.TimeSerie.md)[]

#### Defined in

[lib/timeframe.ts:195](https://github.com/fatmatto/timeframes/blob/497de10/src/lib/timeframe.ts#L195)

___

### delta

▸ **delta**(): [`Row`](../interfaces/lib_types.Row.md)

Reduces the TimeFrame to a single Row representing the delta of values in each column. The time is the FIRST index.

#### Returns

[`Row`](../interfaces/lib_types.Row.md)

#### Defined in

[lib/timeframe.ts:290](https://github.com/fatmatto/timeframes/blob/497de10/src/lib/timeframe.ts#L290)

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

[lib/timeframe.ts:401](https://github.com/fatmatto/timeframes/blob/497de10/src/lib/timeframe.ts#L401)

___

### first

▸ **first**(): [`Row`](../interfaces/lib_types.Row.md)

#### Returns

[`Row`](../interfaces/lib_types.Row.md)

The first row

#### Defined in

[lib/timeframe.ts:254](https://github.com/fatmatto/timeframes/blob/497de10/src/lib/timeframe.ts#L254)

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

[lib/timeframe.ts:168](https://github.com/fatmatto/timeframes/blob/497de10/src/lib/timeframe.ts#L168)

___

### last

▸ **last**(): [`Row`](../interfaces/lib_types.Row.md)

#### Returns

[`Row`](../interfaces/lib_types.Row.md)

The last row

#### Defined in

[lib/timeframe.ts:263](https://github.com/fatmatto/timeframes/blob/497de10/src/lib/timeframe.ts#L263)

___

### length

▸ **length**(): `number`

#### Returns

`number`

#### Defined in

[lib/timeframe.ts:238](https://github.com/fatmatto/timeframes/blob/497de10/src/lib/timeframe.ts#L238)

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

[lib/timeframe.ts:410](https://github.com/fatmatto/timeframes/blob/497de10/src/lib/timeframe.ts#L410)

___

### max

▸ **max**(): [`Row`](../interfaces/lib_types.Row.md)

Reduces the TimeFrame to a single Row representing the maximum of values in each column. The time is the FIRST index.

#### Returns

[`Row`](../interfaces/lib_types.Row.md)

#### Defined in

[lib/timeframe.ts:299](https://github.com/fatmatto/timeframes/blob/497de10/src/lib/timeframe.ts#L299)

___

### min

▸ **min**(): [`Row`](../interfaces/lib_types.Row.md)

Reduces the TimeFrame to a single Row representing the minimum of values in each column. The time is the FIRST index.

#### Returns

[`Row`](../interfaces/lib_types.Row.md)

#### Defined in

[lib/timeframe.ts:308](https://github.com/fatmatto/timeframes/blob/497de10/src/lib/timeframe.ts#L308)

___

### partition

▸ **partition**(`options`): [`TimeFrame`](lib_timeframe.TimeFrame.md)[]

Partitions The TimeFrame into multiple sub timeframes by dividing the time column into even groups. Returns an array of sub TimeFrames.

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`TimeFramePartitionOptions`](../interfaces/lib_types.TimeFramePartitionOptions.md) |

#### Returns

[`TimeFrame`](lib_timeframe.TimeFrame.md)[]

#### Defined in

[lib/timeframe.ts:434](https://github.com/fatmatto/timeframes/blob/497de10/src/lib/timeframe.ts#L434)

___

### print

▸ **print**(): `void`

Pretty prints the TimeFrame to the console

#### Returns

`void`

#### Defined in

[lib/timeframe.ts:453](https://github.com/fatmatto/timeframes/blob/497de10/src/lib/timeframe.ts#L453)

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

[lib/timeframe.ts:210](https://github.com/fatmatto/timeframes/blob/497de10/src/lib/timeframe.ts#L210)

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

[lib/timeframe.ts:85](https://github.com/fatmatto/timeframes/blob/497de10/src/lib/timeframe.ts#L85)

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

[lib/timeframe.ts:94](https://github.com/fatmatto/timeframes/blob/497de10/src/lib/timeframe.ts#L94)

___

### resample

▸ **resample**(`options`): `TimeFramesResampler`

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`ResampleOptions`](../modules/lib_types.md#resampleoptions) |

#### Returns

`TimeFramesResampler`

#### Defined in

[lib/timeframe.ts:392](https://github.com/fatmatto/timeframes/blob/497de10/src/lib/timeframe.ts#L392)

___

### rows

▸ **rows**(): readonly [`Row`](../interfaces/lib_types.Row.md)[]

#### Returns

readonly [`Row`](../interfaces/lib_types.Row.md)[]

Array of rows

#### Defined in

[lib/timeframe.ts:203](https://github.com/fatmatto/timeframes/blob/497de10/src/lib/timeframe.ts#L203)

___

### shape

▸ **shape**(): `number`[]

Returns the shape of the timeframe

#### Returns

`number`[]

Array<Number> The shape of the timeframe expressed as [rows,  columns] where columns excludes the time column

#### Defined in

[lib/timeframe.ts:246](https://github.com/fatmatto/timeframes/blob/497de10/src/lib/timeframe.ts#L246)

___

### sum

▸ **sum**(): [`Row`](../interfaces/lib_types.Row.md)

Reduces the TimeFrame to a single Row representing the sum of values in each column. The time is the FIRST index.

#### Returns

[`Row`](../interfaces/lib_types.Row.md)

#### Defined in

[lib/timeframe.ts:272](https://github.com/fatmatto/timeframes/blob/497de10/src/lib/timeframe.ts#L272)

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

[lib/timeframe.ts:159](https://github.com/fatmatto/timeframes/blob/497de10/src/lib/timeframe.ts#L159)

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

[lib/timeframe.ts:128](https://github.com/fatmatto/timeframes/blob/497de10/src/lib/timeframe.ts#L128)

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

[lib/timeframe.ts:105](https://github.com/fatmatto/timeframes/blob/497de10/src/lib/timeframe.ts#L105)

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

[lib/timeframe.ts:141](https://github.com/fatmatto/timeframes/blob/497de10/src/lib/timeframe.ts#L141)
