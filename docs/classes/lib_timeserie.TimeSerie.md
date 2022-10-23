[@apio/timeframes](../README.md) / [Modules](../modules.md) / [lib/timeserie](../modules/lib_timeserie.md) / TimeSerie

# Class: TimeSerie

[lib/timeserie](../modules/lib_timeserie.md).TimeSerie

A data structure for a time serie.

## Table of contents

### Constructors

- [constructor](lib_timeserie.TimeSerie.md#constructor)

### Properties

- [data](lib_timeserie.TimeSerie.md#data)
- [index](lib_timeserie.TimeSerie.md#index)
- [metadata](lib_timeserie.TimeSerie.md#metadata)
- [name](lib_timeserie.TimeSerie.md#name)
- [createIndex](lib_timeserie.TimeSerie.md#createindex)
- [internals](lib_timeserie.TimeSerie.md#internals)

### Methods

- [add](lib_timeserie.TimeSerie.md#add)
- [atIndex](lib_timeserie.TimeSerie.md#atindex)
- [atTime](lib_timeserie.TimeSerie.md#attime)
- [avg](lib_timeserie.TimeSerie.md#avg)
- [betweenIndexes](lib_timeserie.TimeSerie.md#betweenindexes)
- [betweenTime](lib_timeserie.TimeSerie.md#betweentime)
- [combine](lib_timeserie.TimeSerie.md#combine)
- [copy](lib_timeserie.TimeSerie.md#copy)
- [delta](lib_timeserie.TimeSerie.md#delta)
- [div](lib_timeserie.TimeSerie.md#div)
- [dropNaN](lib_timeserie.TimeSerie.md#dropnan)
- [dropNull](lib_timeserie.TimeSerie.md#dropnull)
- [filter](lib_timeserie.TimeSerie.md#filter)
- [first](lib_timeserie.TimeSerie.md#first)
- [firstAt](lib_timeserie.TimeSerie.md#firstat)
- [firstValidIndex](lib_timeserie.TimeSerie.md#firstvalidindex)
- [firstValidValue](lib_timeserie.TimeSerie.md#firstvalidvalue)
- [indexes](lib_timeserie.TimeSerie.md#indexes)
- [isEmpty](lib_timeserie.TimeSerie.md#isempty)
- [last](lib_timeserie.TimeSerie.md#last)
- [lastValidIndex](lib_timeserie.TimeSerie.md#lastvalidindex)
- [lastValidValue](lib_timeserie.TimeSerie.md#lastvalidvalue)
- [length](lib_timeserie.TimeSerie.md#length)
- [map](lib_timeserie.TimeSerie.md#map)
- [max](lib_timeserie.TimeSerie.md#max)
- [min](lib_timeserie.TimeSerie.md#min)
- [mul](lib_timeserie.TimeSerie.md#mul)
- [recreate](lib_timeserie.TimeSerie.md#recreate)
- [reindex](lib_timeserie.TimeSerie.md#reindex)
- [removeAt](lib_timeserie.TimeSerie.md#removeat)
- [removeAtIndex](lib_timeserie.TimeSerie.md#removeatindex)
- [removeBetweenTime](lib_timeserie.TimeSerie.md#removebetweentime)
- [rename](lib_timeserie.TimeSerie.md#rename)
- [resample](lib_timeserie.TimeSerie.md#resample)
- [round](lib_timeserie.TimeSerie.md#round)
- [sub](lib_timeserie.TimeSerie.md#sub)
- [sum](lib_timeserie.TimeSerie.md#sum)
- [toArray](lib_timeserie.TimeSerie.md#toarray)
- [values](lib_timeserie.TimeSerie.md#values)
- [fromIndex](lib_timeserie.TimeSerie.md#fromindex)

## Constructors

### constructor

• **new TimeSerie**(`name`, `serie`, `metadata?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `serie` | [`Point`](../modules/lib_types.md#point)[] \| readonly [`Point`](../modules/lib_types.md#point)[] |
| `metadata` | [`Metadata`](../modules/lib_types.md#metadata) |

#### Defined in

[lib/timeserie.ts:35](https://github.com/fatmatto/timeframes/blob/497de10/src/lib/timeserie.ts#L35)

## Properties

### data

• `Readonly` **data**: [`Point`](../modules/lib_types.md#point)[]

#### Defined in

[lib/timeserie.ts:31](https://github.com/fatmatto/timeframes/blob/497de10/src/lib/timeserie.ts#L31)

___

### index

• **index**: `Object`

#### Index signature

▪ [key: `string`]: [`PointValue`](../modules/lib_types.md#pointvalue)

#### Defined in

[lib/timeserie.ts:34](https://github.com/fatmatto/timeframes/blob/497de10/src/lib/timeserie.ts#L34)

___

### metadata

• **metadata**: [`Metadata`](../modules/lib_types.md#metadata)

#### Defined in

[lib/timeserie.ts:33](https://github.com/fatmatto/timeframes/blob/497de10/src/lib/timeserie.ts#L33)

___

### name

• **name**: `string`

#### Defined in

[lib/timeserie.ts:32](https://github.com/fatmatto/timeframes/blob/497de10/src/lib/timeserie.ts#L32)

___

### createIndex

▪ `Static` **createIndex**: `Function`

#### Defined in

[lib/timeserie.ts:30](https://github.com/fatmatto/timeframes/blob/497de10/src/lib/timeserie.ts#L30)

___

### internals

▪ `Static` **internals**: `any` = `{}`

#### Defined in

[lib/timeserie.ts:29](https://github.com/fatmatto/timeframes/blob/497de10/src/lib/timeserie.ts#L29)

## Methods

### add

▸ **add**(`value`): [`TimeSerie`](lib_timeserie.TimeSerie.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` \| [`TimeSerie`](lib_timeserie.TimeSerie.md) |

#### Returns

[`TimeSerie`](lib_timeserie.TimeSerie.md)

#### Defined in

[lib/timeserie.ts:366](https://github.com/fatmatto/timeframes/blob/497de10/src/lib/timeserie.ts#L366)

___

### atIndex

▸ **atIndex**(`index`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `index` | `number` |

#### Returns

`any`

The value at the given index (position, not time)

#### Defined in

[lib/timeserie.ts:170](https://github.com/fatmatto/timeframes/blob/497de10/src/lib/timeserie.ts#L170)

___

### atTime

▸ **atTime**(`time`, `fillValue?`): `any`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `time` | [`DateLike`](../modules/lib_types.md#datelike) | `undefined` |
| `fillValue` | `number` | `null` |

#### Returns

`any`

The value of the timeseries at the given time

#### Defined in

[lib/timeserie.ts:162](https://github.com/fatmatto/timeframes/blob/497de10/src/lib/timeserie.ts#L162)

___

### avg

▸ **avg**(): `number`

#### Returns

`number`

The average of point values

#### Defined in

[lib/timeserie.ts:239](https://github.com/fatmatto/timeframes/blob/497de10/src/lib/timeserie.ts#L239)

___

### betweenIndexes

▸ **betweenIndexes**(`from`, `to`): [`TimeSerie`](lib_timeserie.TimeSerie.md)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `from` | `number` | start positional index |
| `to` | `number` | end positional index |

#### Returns

[`TimeSerie`](lib_timeserie.TimeSerie.md)

The subset of points between the two indexes. Extremes are included.

#### Defined in

[lib/timeserie.ts:207](https://github.com/fatmatto/timeframes/blob/497de10/src/lib/timeserie.ts#L207)

___

### betweenTime

▸ **betweenTime**(`from`, `to`, `options?`): [`TimeSerie`](lib_timeserie.TimeSerie.md)

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `from` | [`DateLike`](../modules/lib_types.md#datelike) | `undefined` | start date string in ISO8601 format |
| `to` | [`DateLike`](../modules/lib_types.md#datelike) | `undefined` | end date string in ISO8601 format |
| `options` | `Object` | `undefined` | - |
| `options.includeInferior` | `boolean` | `true` | - |
| `options.includeSuperior` | `boolean` | `true` | - |

#### Returns

[`TimeSerie`](lib_timeserie.TimeSerie.md)

The subset of points between the two dates. Extremes are included.

#### Defined in

[lib/timeserie.ts:183](https://github.com/fatmatto/timeframes/blob/497de10/src/lib/timeserie.ts#L183)

___

### combine

▸ **combine**(`operation`, `series`, `options?`): [`TimeSerie`](lib_timeserie.TimeSerie.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `operation` | `string` |
| `series` | [`TimeSerie`](lib_timeserie.TimeSerie.md)[] |
| `options` | [`TimeSeriesOperationOptions`](../interfaces/lib_types.TimeSeriesOperationOptions.md) |

#### Returns

[`TimeSerie`](lib_timeserie.TimeSerie.md)

#### Defined in

[lib/timeserie.ts:360](https://github.com/fatmatto/timeframes/blob/497de10/src/lib/timeserie.ts#L360)

___

### copy

▸ **copy**(): [`TimeSerie`](lib_timeserie.TimeSerie.md)

#### Returns

[`TimeSerie`](lib_timeserie.TimeSerie.md)

#### Defined in

[lib/timeserie.ts:227](https://github.com/fatmatto/timeframes/blob/497de10/src/lib/timeserie.ts#L227)

___

### delta

▸ **delta**(): `number`

#### Returns

`number`

#### Defined in

[lib/timeserie.ts:243](https://github.com/fatmatto/timeframes/blob/497de10/src/lib/timeserie.ts#L243)

___

### div

▸ **div**(`value`): [`TimeSerie`](lib_timeserie.TimeSerie.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` \| [`TimeSerie`](lib_timeserie.TimeSerie.md) |

#### Returns

[`TimeSerie`](lib_timeserie.TimeSerie.md)

#### Defined in

[lib/timeserie.ts:390](https://github.com/fatmatto/timeframes/blob/497de10/src/lib/timeserie.ts#L390)

___

### dropNaN

▸ **dropNaN**(): [`TimeSerie`](lib_timeserie.TimeSerie.md)

#### Returns

[`TimeSerie`](lib_timeserie.TimeSerie.md)

#### Defined in

[lib/timeserie.ts:342](https://github.com/fatmatto/timeframes/blob/497de10/src/lib/timeserie.ts#L342)

___

### dropNull

▸ **dropNull**(): [`TimeSerie`](lib_timeserie.TimeSerie.md)

#### Returns

[`TimeSerie`](lib_timeserie.TimeSerie.md)

#### Defined in

[lib/timeserie.ts:346](https://github.com/fatmatto/timeframes/blob/497de10/src/lib/timeserie.ts#L346)

___

### filter

▸ **filter**(`fn`): [`TimeSerie`](lib_timeserie.TimeSerie.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `fn` | [`TimeseriePointIterator`](../modules/lib_types.md#timeseriepointiterator) |

#### Returns

[`TimeSerie`](lib_timeserie.TimeSerie.md)

#### Defined in

[lib/timeserie.ts:211](https://github.com/fatmatto/timeframes/blob/497de10/src/lib/timeserie.ts#L211)

___

### first

▸ **first**(): [`Point`](../modules/lib_types.md#point)

#### Returns

[`Point`](../modules/lib_types.md#point)

The first point

#### Defined in

[lib/timeserie.ts:258](https://github.com/fatmatto/timeframes/blob/497de10/src/lib/timeserie.ts#L258)

___

### firstAt

▸ **firstAt**(`time`): [`Point`](../modules/lib_types.md#point)

Returns the first point at or after a given timestamp

#### Parameters

| Name | Type |
| :------ | :------ |
| `time` | [`DateLike`](../modules/lib_types.md#datelike) |

#### Returns

[`Point`](../modules/lib_types.md#point)

#### Defined in

[lib/timeserie.ts:267](https://github.com/fatmatto/timeframes/blob/497de10/src/lib/timeserie.ts#L267)

___

### firstValidIndex

▸ **firstValidIndex**(): `string`

#### Returns

`string`

The time of the first non-NaN value

#### Defined in

[lib/timeserie.ts:117](https://github.com/fatmatto/timeframes/blob/497de10/src/lib/timeserie.ts#L117)

___

### firstValidValue

▸ **firstValidValue**(): `any`

#### Returns

`any`

The first non-NaN value

#### Defined in

[lib/timeserie.ts:147](https://github.com/fatmatto/timeframes/blob/497de10/src/lib/timeserie.ts#L147)

___

### indexes

▸ **indexes**(): [`DateLike`](../modules/lib_types.md#datelike)[]

#### Returns

[`DateLike`](../modules/lib_types.md#datelike)[]

The array of time indexes

#### Defined in

[lib/timeserie.ts:86](https://github.com/fatmatto/timeframes/blob/497de10/src/lib/timeserie.ts#L86)

___

### isEmpty

▸ **isEmpty**(): `boolean`

#### Returns

`boolean`

#### Defined in

[lib/timeserie.ts:223](https://github.com/fatmatto/timeframes/blob/497de10/src/lib/timeserie.ts#L223)

___

### last

▸ **last**(): [`Point`](../modules/lib_types.md#point)

#### Returns

[`Point`](../modules/lib_types.md#point)

The last point

#### Defined in

[lib/timeserie.ts:275](https://github.com/fatmatto/timeframes/blob/497de10/src/lib/timeserie.ts#L275)

___

### lastValidIndex

▸ **lastValidIndex**(): `string`

#### Returns

`string`

The time of the latest non-NaN value

#### Defined in

[lib/timeserie.ts:102](https://github.com/fatmatto/timeframes/blob/497de10/src/lib/timeserie.ts#L102)

___

### lastValidValue

▸ **lastValidValue**(): `any`

#### Returns

`any`

The latest non-NaN value

#### Defined in

[lib/timeserie.ts:132](https://github.com/fatmatto/timeframes/blob/497de10/src/lib/timeserie.ts#L132)

___

### length

▸ **length**(): `number`

#### Returns

`number`

#### Defined in

[lib/timeserie.ts:219](https://github.com/fatmatto/timeframes/blob/497de10/src/lib/timeserie.ts#L219)

___

### map

▸ **map**(`fn`): [`TimeSerie`](lib_timeserie.TimeSerie.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `fn` | [`TimeseriePointIterator`](../modules/lib_types.md#timeseriepointiterator) |

#### Returns

[`TimeSerie`](lib_timeserie.TimeSerie.md)

#### Defined in

[lib/timeserie.ts:215](https://github.com/fatmatto/timeframes/blob/497de10/src/lib/timeserie.ts#L215)

___

### max

▸ **max**(): [`Point`](../modules/lib_types.md#point)

#### Returns

[`Point`](../modules/lib_types.md#point)

The point with max value, or null

#### Defined in

[lib/timeserie.ts:283](https://github.com/fatmatto/timeframes/blob/497de10/src/lib/timeserie.ts#L283)

___

### min

▸ **min**(): [`Point`](../modules/lib_types.md#point)

#### Returns

[`Point`](../modules/lib_types.md#point)

The point with min value or null

#### Defined in

[lib/timeserie.ts:297](https://github.com/fatmatto/timeframes/blob/497de10/src/lib/timeserie.ts#L297)

___

### mul

▸ **mul**(`value`): [`TimeSerie`](lib_timeserie.TimeSerie.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` \| [`TimeSerie`](lib_timeserie.TimeSerie.md) |

#### Returns

[`TimeSerie`](lib_timeserie.TimeSerie.md)

#### Defined in

[lib/timeserie.ts:382](https://github.com/fatmatto/timeframes/blob/497de10/src/lib/timeserie.ts#L382)

___

### recreate

▸ **recreate**(`serie`): [`TimeSerie`](lib_timeserie.TimeSerie.md)

Creates a new serie preserving the name and the metadata but replacing data

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `serie` | [`Point`](../modules/lib_types.md#point)[] \| readonly [`Point`](../modules/lib_types.md#point)[] | The new data to recreate the serie from |

#### Returns

[`TimeSerie`](lib_timeserie.TimeSerie.md)

#### Defined in

[lib/timeserie.ts:78](https://github.com/fatmatto/timeframes/blob/497de10/src/lib/timeserie.ts#L78)

___

### reindex

▸ **reindex**(`index`, `options?`): [`TimeSerie`](lib_timeserie.TimeSerie.md)

Recreates the serie's index

**`see`** createIndex

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `index` | [`Index`](../modules/lib_types.md#index) | The new index to use. Can be created with createIndex() |
| `options?` | [`ReindexOptions`](../interfaces/lib_types.ReindexOptions.md) |  |

#### Returns

[`TimeSerie`](lib_timeserie.TimeSerie.md)

The reindexed timeserie

#### Defined in

[lib/timeserie.ts:56](https://github.com/fatmatto/timeframes/blob/497de10/src/lib/timeserie.ts#L56)

___

### removeAt

▸ **removeAt**(`time`): [`TimeSerie`](lib_timeserie.TimeSerie.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `time` | [`DateLike`](../modules/lib_types.md#datelike) |

#### Returns

[`TimeSerie`](lib_timeserie.TimeSerie.md)

#### Defined in

[lib/timeserie.ts:319](https://github.com/fatmatto/timeframes/blob/497de10/src/lib/timeserie.ts#L319)

___

### removeAtIndex

▸ **removeAtIndex**(`index`): [`TimeSerie`](lib_timeserie.TimeSerie.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `index` | `number` |

#### Returns

[`TimeSerie`](lib_timeserie.TimeSerie.md)

#### Defined in

[lib/timeserie.ts:323](https://github.com/fatmatto/timeframes/blob/497de10/src/lib/timeserie.ts#L323)

___

### removeBetweenTime

▸ **removeBetweenTime**(`from`, `to`): [`TimeSerie`](lib_timeserie.TimeSerie.md)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `from` | [`DateLike`](../modules/lib_types.md#datelike) | start date string in ISO8601 format |
| `to` | [`DateLike`](../modules/lib_types.md#datelike) | end date string in ISO8601 format |

#### Returns

[`TimeSerie`](lib_timeserie.TimeSerie.md)

New timeserie without the removed data. Bounds are removed.

#### Defined in

[lib/timeserie.ts:333](https://github.com/fatmatto/timeframes/blob/497de10/src/lib/timeserie.ts#L333)

___

### rename

▸ **rename**(`name`): [`TimeSerie`](lib_timeserie.TimeSerie.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |

#### Returns

[`TimeSerie`](lib_timeserie.TimeSerie.md)

#### Defined in

[lib/timeserie.ts:68](https://github.com/fatmatto/timeframes/blob/497de10/src/lib/timeserie.ts#L68)

___

### resample

▸ **resample**(`options`): `TimeseriesResampler`

**`example`**
// Average by hour
const hourlyAverage = ts.resample(1000 * 60 * 60).avg()

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`ResampleOptions`](../modules/lib_types.md#resampleoptions) |

#### Returns

`TimeseriesResampler`

a resampler instance that can be used to obtain a new timeserie by aggregating values

#### Defined in

[lib/timeserie.ts:315](https://github.com/fatmatto/timeframes/blob/497de10/src/lib/timeserie.ts#L315)

___

### round

▸ **round**(`decimals`): [`TimeSerie`](lib_timeserie.TimeSerie.md)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `decimals` | `number` | the number of decimals to keep |

#### Returns

[`TimeSerie`](lib_timeserie.TimeSerie.md)

#### Defined in

[lib/timeserie.ts:355](https://github.com/fatmatto/timeframes/blob/497de10/src/lib/timeserie.ts#L355)

___

### sub

▸ **sub**(`value`): [`TimeSerie`](lib_timeserie.TimeSerie.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` \| [`TimeSerie`](lib_timeserie.TimeSerie.md) |

#### Returns

[`TimeSerie`](lib_timeserie.TimeSerie.md)

#### Defined in

[lib/timeserie.ts:374](https://github.com/fatmatto/timeframes/blob/497de10/src/lib/timeserie.ts#L374)

___

### sum

▸ **sum**(): `number`

#### Returns

`number`

#### Defined in

[lib/timeserie.ts:231](https://github.com/fatmatto/timeframes/blob/497de10/src/lib/timeserie.ts#L231)

___

### toArray

▸ **toArray**(): [`Point`](../modules/lib_types.md#point)[]

#### Returns

[`Point`](../modules/lib_types.md#point)[]

Array of points, where each point is a tuple with ISO8601 timestamp and value

#### Defined in

[lib/timeserie.ts:64](https://github.com/fatmatto/timeframes/blob/497de10/src/lib/timeserie.ts#L64)

___

### values

▸ **values**(): `any`[]

#### Returns

`any`[]

The array of values

#### Defined in

[lib/timeserie.ts:94](https://github.com/fatmatto/timeframes/blob/497de10/src/lib/timeserie.ts#L94)

___

### fromIndex

▸ `Static` **fromIndex**(`index`, `options`): [`TimeSerie`](lib_timeserie.TimeSerie.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `index` | [`Index`](../modules/lib_types.md#index) |
| `options` | [`FromIndexOptions`](../interfaces/lib_types.FromIndexOptions.md) |

#### Returns

[`TimeSerie`](lib_timeserie.TimeSerie.md)

#### Defined in

[lib/timeserie.ts:45](https://github.com/fatmatto/timeframes/blob/497de10/src/lib/timeserie.ts#L45)
