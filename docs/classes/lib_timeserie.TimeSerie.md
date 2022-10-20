[@apio/timeframes](../README.md) / [Modules](../modules.md) / [lib/timeserie](../modules/lib_timeserie.md) / TimeSerie

# Class: TimeSerie

[lib/timeserie](../modules/lib_timeserie.md).TimeSerie

A data structure for a time serie.

## Table of contents

### Constructors

- [constructor](lib_timeserie.TimeSerie.md#constructor)

### Properties

- [data](lib_timeserie.TimeSerie.md#data)
- [metadata](lib_timeserie.TimeSerie.md#metadata)
- [name](lib_timeserie.TimeSerie.md#name)
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
- [weightedAvg](lib_timeserie.TimeSerie.md#weightedavg)

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

[lib/timeserie.ts:39](https://github.com/fatmatto/timeframes/blob/92e131e/src/lib/timeserie.ts#L39)

## Properties

### data

• `Readonly` **data**: [`Point`](../modules/lib_types.md#point)[]

#### Defined in

[lib/timeserie.ts:36](https://github.com/fatmatto/timeframes/blob/92e131e/src/lib/timeserie.ts#L36)

___

### metadata

• **metadata**: [`Metadata`](../modules/lib_types.md#metadata)

#### Defined in

[lib/timeserie.ts:38](https://github.com/fatmatto/timeframes/blob/92e131e/src/lib/timeserie.ts#L38)

___

### name

• **name**: `string`

#### Defined in

[lib/timeserie.ts:37](https://github.com/fatmatto/timeframes/blob/92e131e/src/lib/timeserie.ts#L37)

___

### internals

▪ `Static` **internals**: `any`

#### Defined in

[lib/timeserie.ts:35](https://github.com/fatmatto/timeframes/blob/92e131e/src/lib/timeserie.ts#L35)

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

[lib/timeserie.ts:378](https://github.com/fatmatto/timeframes/blob/92e131e/src/lib/timeserie.ts#L378)

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

[lib/timeserie.ts:163](https://github.com/fatmatto/timeframes/blob/92e131e/src/lib/timeserie.ts#L163)

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

[lib/timeserie.ts:147](https://github.com/fatmatto/timeframes/blob/92e131e/src/lib/timeserie.ts#L147)

___

### avg

▸ **avg**(): `number`

#### Returns

`number`

The average of point values

#### Defined in

[lib/timeserie.ts:232](https://github.com/fatmatto/timeframes/blob/92e131e/src/lib/timeserie.ts#L232)

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

[lib/timeserie.ts:200](https://github.com/fatmatto/timeframes/blob/92e131e/src/lib/timeserie.ts#L200)

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

[lib/timeserie.ts:176](https://github.com/fatmatto/timeframes/blob/92e131e/src/lib/timeserie.ts#L176)

___

### combine

▸ **combine**(`operation`, `series`, `options?`): [`TimeSerie`](lib_timeserie.TimeSerie.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `operation` | `string` |
| `series` | [`TimeSerie`](lib_timeserie.TimeSerie.md)[] |
| `options` | `TimeSeriesOperationOptions` |

#### Returns

[`TimeSerie`](lib_timeserie.TimeSerie.md)

#### Defined in

[lib/timeserie.ts:372](https://github.com/fatmatto/timeframes/blob/92e131e/src/lib/timeserie.ts#L372)

___

### copy

▸ **copy**(): [`TimeSerie`](lib_timeserie.TimeSerie.md)

#### Returns

[`TimeSerie`](lib_timeserie.TimeSerie.md)

#### Defined in

[lib/timeserie.ts:220](https://github.com/fatmatto/timeframes/blob/92e131e/src/lib/timeserie.ts#L220)

___

### delta

▸ **delta**(): `number`

#### Returns

`number`

#### Defined in

[lib/timeserie.ts:255](https://github.com/fatmatto/timeframes/blob/92e131e/src/lib/timeserie.ts#L255)

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

[lib/timeserie.ts:402](https://github.com/fatmatto/timeframes/blob/92e131e/src/lib/timeserie.ts#L402)

___

### dropNaN

▸ **dropNaN**(): [`TimeSerie`](lib_timeserie.TimeSerie.md)

#### Returns

[`TimeSerie`](lib_timeserie.TimeSerie.md)

#### Defined in

[lib/timeserie.ts:354](https://github.com/fatmatto/timeframes/blob/92e131e/src/lib/timeserie.ts#L354)

___

### dropNull

▸ **dropNull**(): [`TimeSerie`](lib_timeserie.TimeSerie.md)

#### Returns

[`TimeSerie`](lib_timeserie.TimeSerie.md)

#### Defined in

[lib/timeserie.ts:358](https://github.com/fatmatto/timeframes/blob/92e131e/src/lib/timeserie.ts#L358)

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

[lib/timeserie.ts:204](https://github.com/fatmatto/timeframes/blob/92e131e/src/lib/timeserie.ts#L204)

___

### first

▸ **first**(): [`Point`](../modules/lib_types.md#point)

#### Returns

[`Point`](../modules/lib_types.md#point)

The first point

#### Defined in

[lib/timeserie.ts:270](https://github.com/fatmatto/timeframes/blob/92e131e/src/lib/timeserie.ts#L270)

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

[lib/timeserie.ts:279](https://github.com/fatmatto/timeframes/blob/92e131e/src/lib/timeserie.ts#L279)

___

### firstValidIndex

▸ **firstValidIndex**(): `string`

#### Returns

`string`

The time of the first non-NaN value

#### Defined in

[lib/timeserie.ts:102](https://github.com/fatmatto/timeframes/blob/92e131e/src/lib/timeserie.ts#L102)

___

### firstValidValue

▸ **firstValidValue**(): `any`

#### Returns

`any`

The first non-NaN value

#### Defined in

[lib/timeserie.ts:132](https://github.com/fatmatto/timeframes/blob/92e131e/src/lib/timeserie.ts#L132)

___

### indexes

▸ **indexes**(): [`DateLike`](../modules/lib_types.md#datelike)[]

#### Returns

[`DateLike`](../modules/lib_types.md#datelike)[]

The array of time indexes

#### Defined in

[lib/timeserie.ts:71](https://github.com/fatmatto/timeframes/blob/92e131e/src/lib/timeserie.ts#L71)

___

### isEmpty

▸ **isEmpty**(): `boolean`

#### Returns

`boolean`

#### Defined in

[lib/timeserie.ts:216](https://github.com/fatmatto/timeframes/blob/92e131e/src/lib/timeserie.ts#L216)

___

### last

▸ **last**(): [`Point`](../modules/lib_types.md#point)

#### Returns

[`Point`](../modules/lib_types.md#point)

The last point

#### Defined in

[lib/timeserie.ts:287](https://github.com/fatmatto/timeframes/blob/92e131e/src/lib/timeserie.ts#L287)

___

### lastValidIndex

▸ **lastValidIndex**(): `string`

#### Returns

`string`

The time of the latest non-NaN value

#### Defined in

[lib/timeserie.ts:87](https://github.com/fatmatto/timeframes/blob/92e131e/src/lib/timeserie.ts#L87)

___

### lastValidValue

▸ **lastValidValue**(): `any`

#### Returns

`any`

The latest non-NaN value

#### Defined in

[lib/timeserie.ts:117](https://github.com/fatmatto/timeframes/blob/92e131e/src/lib/timeserie.ts#L117)

___

### length

▸ **length**(): `number`

#### Returns

`number`

#### Defined in

[lib/timeserie.ts:212](https://github.com/fatmatto/timeframes/blob/92e131e/src/lib/timeserie.ts#L212)

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

[lib/timeserie.ts:208](https://github.com/fatmatto/timeframes/blob/92e131e/src/lib/timeserie.ts#L208)

___

### max

▸ **max**(): [`Point`](../modules/lib_types.md#point)

#### Returns

[`Point`](../modules/lib_types.md#point)

The point with max value, or null

#### Defined in

[lib/timeserie.ts:295](https://github.com/fatmatto/timeframes/blob/92e131e/src/lib/timeserie.ts#L295)

___

### min

▸ **min**(): [`Point`](../modules/lib_types.md#point)

#### Returns

[`Point`](../modules/lib_types.md#point)

The point with min value or null

#### Defined in

[lib/timeserie.ts:309](https://github.com/fatmatto/timeframes/blob/92e131e/src/lib/timeserie.ts#L309)

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

[lib/timeserie.ts:394](https://github.com/fatmatto/timeframes/blob/92e131e/src/lib/timeserie.ts#L394)

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

[lib/timeserie.ts:63](https://github.com/fatmatto/timeframes/blob/92e131e/src/lib/timeserie.ts#L63)

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

[lib/timeserie.ts:331](https://github.com/fatmatto/timeframes/blob/92e131e/src/lib/timeserie.ts#L331)

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

[lib/timeserie.ts:335](https://github.com/fatmatto/timeframes/blob/92e131e/src/lib/timeserie.ts#L335)

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

[lib/timeserie.ts:345](https://github.com/fatmatto/timeframes/blob/92e131e/src/lib/timeserie.ts#L345)

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

[lib/timeserie.ts:53](https://github.com/fatmatto/timeframes/blob/92e131e/src/lib/timeserie.ts#L53)

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

[lib/timeserie.ts:327](https://github.com/fatmatto/timeframes/blob/92e131e/src/lib/timeserie.ts#L327)

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

[lib/timeserie.ts:367](https://github.com/fatmatto/timeframes/blob/92e131e/src/lib/timeserie.ts#L367)

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

[lib/timeserie.ts:386](https://github.com/fatmatto/timeframes/blob/92e131e/src/lib/timeserie.ts#L386)

___

### sum

▸ **sum**(): `number`

#### Returns

`number`

#### Defined in

[lib/timeserie.ts:224](https://github.com/fatmatto/timeframes/blob/92e131e/src/lib/timeserie.ts#L224)

___

### toArray

▸ **toArray**(): [`Point`](../modules/lib_types.md#point)[]

#### Returns

[`Point`](../modules/lib_types.md#point)[]

Array of points, where each point is a tuple with ISO8601 timestamp and value

#### Defined in

[lib/timeserie.ts:49](https://github.com/fatmatto/timeframes/blob/92e131e/src/lib/timeserie.ts#L49)

___

### values

▸ **values**(): `any`[]

#### Returns

`any`[]

The array of values

#### Defined in

[lib/timeserie.ts:79](https://github.com/fatmatto/timeframes/blob/92e131e/src/lib/timeserie.ts#L79)

___

### weightedAvg

▸ **weightedAvg**(): `number`

#### Returns

`number`

The time weighted average of points. Every point is weighted by the timestamp, in this way we handle "data holes"

#### Defined in

[lib/timeserie.ts:239](https://github.com/fatmatto/timeframes/blob/92e131e/src/lib/timeserie.ts#L239)
