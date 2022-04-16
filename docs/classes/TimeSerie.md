[@apio/timeframes](../README.md) / [Exports](../modules.md) / TimeSerie

# Class: TimeSerie

A data structure for a time serie.

## Table of contents

### Constructors

- [constructor](TimeSerie.md#constructor)

### Properties

- [data](TimeSerie.md#data)
- [metadata](TimeSerie.md#metadata)
- [name](TimeSerie.md#name)

### Methods

- [atIndex](TimeSerie.md#atindex)
- [atTime](TimeSerie.md#attime)
- [avg](TimeSerie.md#avg)
- [betweenIndexes](TimeSerie.md#betweenindexes)
- [betweenTime](TimeSerie.md#betweentime)
- [copy](TimeSerie.md#copy)
- [dropNaN](TimeSerie.md#dropnan)
- [dropNull](TimeSerie.md#dropnull)
- [filter](TimeSerie.md#filter)
- [first](TimeSerie.md#first)
- [firstAt](TimeSerie.md#firstat)
- [firstValidIndex](TimeSerie.md#firstvalidindex)
- [firstValidValue](TimeSerie.md#firstvalidvalue)
- [indexes](TimeSerie.md#indexes)
- [isEmpty](TimeSerie.md#isempty)
- [last](TimeSerie.md#last)
- [lastValidIndex](TimeSerie.md#lastvalidindex)
- [lastValidValue](TimeSerie.md#lastvalidvalue)
- [length](TimeSerie.md#length)
- [map](TimeSerie.md#map)
- [max](TimeSerie.md#max)
- [min](TimeSerie.md#min)
- [removeAt](TimeSerie.md#removeat)
- [removeAtIndex](TimeSerie.md#removeatindex)
- [removeBetweenTime](TimeSerie.md#removebetweentime)
- [resample](TimeSerie.md#resample)
- [sum](TimeSerie.md#sum)
- [toArray](TimeSerie.md#toarray)
- [values](TimeSerie.md#values)

## Constructors

### constructor

• **new TimeSerie**(`name`, `serie`, `metadata?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `serie` | `Point`[] \| readonly `Point`[] |
| `metadata` | `Metadata` |

#### Defined in

[lib/timeserie.ts:40](https://github.com/fatmatto/timeframes/blob/660a552/src/lib/timeserie.ts#L40)

## Properties

### data

• `Readonly` **data**: `Point`[]

#### Defined in

[lib/timeserie.ts:37](https://github.com/fatmatto/timeframes/blob/660a552/src/lib/timeserie.ts#L37)

___

### metadata

• `Readonly` **metadata**: `Metadata`

#### Defined in

[lib/timeserie.ts:39](https://github.com/fatmatto/timeframes/blob/660a552/src/lib/timeserie.ts#L39)

___

### name

• `Readonly` **name**: `string`

#### Defined in

[lib/timeserie.ts:38](https://github.com/fatmatto/timeframes/blob/660a552/src/lib/timeserie.ts#L38)

## Methods

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

[lib/timeserie.ts:142](https://github.com/fatmatto/timeframes/blob/660a552/src/lib/timeserie.ts#L142)

___

### atTime

▸ **atTime**(`time`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `time` | `DateLike` |

#### Returns

`any`

The value of the timeseries at the given time

#### Defined in

[lib/timeserie.ts:126](https://github.com/fatmatto/timeframes/blob/660a552/src/lib/timeserie.ts#L126)

___

### avg

▸ **avg**(): `number`

#### Returns

`number`

The average of point values

#### Defined in

[lib/timeserie.ts:205](https://github.com/fatmatto/timeframes/blob/660a552/src/lib/timeserie.ts#L205)

___

### betweenIndexes

▸ **betweenIndexes**(`from`, `to`): [`TimeSerie`](TimeSerie.md)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `from` | `number` | start positional index |
| `to` | `number` | end positional index |

#### Returns

[`TimeSerie`](TimeSerie.md)

The subset of points between the two indexes. Extremes are included.

#### Defined in

[lib/timeserie.ts:179](https://github.com/fatmatto/timeframes/blob/660a552/src/lib/timeserie.ts#L179)

___

### betweenTime

▸ **betweenTime**(`from`, `to`, `options?`): [`TimeSerie`](TimeSerie.md)

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `from` | `DateLike` | `undefined` | start date string in ISO8601 format |
| `to` | `DateLike` | `undefined` | end date string in ISO8601 format |
| `options` | `Object` | `undefined` | - |
| `options.includeInferior` | `boolean` | `true` | - |
| `options.includeSuperior` | `boolean` | `true` | - |

#### Returns

[`TimeSerie`](TimeSerie.md)

The subset of points between the two dates. Extremes are included.

#### Defined in

[lib/timeserie.ts:155](https://github.com/fatmatto/timeframes/blob/660a552/src/lib/timeserie.ts#L155)

___

### copy

▸ **copy**(): [`TimeSerie`](TimeSerie.md)

#### Returns

[`TimeSerie`](TimeSerie.md)

#### Defined in

[lib/timeserie.ts:195](https://github.com/fatmatto/timeframes/blob/660a552/src/lib/timeserie.ts#L195)

___

### dropNaN

▸ **dropNaN**(): [`TimeSerie`](TimeSerie.md)

#### Returns

[`TimeSerie`](TimeSerie.md)

#### Defined in

[lib/timeserie.ts:303](https://github.com/fatmatto/timeframes/blob/660a552/src/lib/timeserie.ts#L303)

___

### dropNull

▸ **dropNull**(): [`TimeSerie`](TimeSerie.md)

#### Returns

[`TimeSerie`](TimeSerie.md)

#### Defined in

[lib/timeserie.ts:307](https://github.com/fatmatto/timeframes/blob/660a552/src/lib/timeserie.ts#L307)

___

### filter

▸ **filter**(`fn`): [`TimeSerie`](TimeSerie.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `fn` | `TimeseriesIterator` |

#### Returns

[`TimeSerie`](TimeSerie.md)

#### Defined in

[lib/timeserie.ts:183](https://github.com/fatmatto/timeframes/blob/660a552/src/lib/timeserie.ts#L183)

___

### first

▸ **first**(): `Point`

#### Returns

`Point`

The first point

#### Defined in

[lib/timeserie.ts:212](https://github.com/fatmatto/timeframes/blob/660a552/src/lib/timeserie.ts#L212)

___

### firstAt

▸ **firstAt**(`time`): `Point`

#### Parameters

| Name | Type |
| :------ | :------ |
| `time` | `DateLike` |

#### Returns

`Point`

#### Defined in

[lib/timeserie.ts:221](https://github.com/fatmatto/timeframes/blob/660a552/src/lib/timeserie.ts#L221)

___

### firstValidIndex

▸ **firstValidIndex**(): `string`

#### Returns

`string`

The time of the first non-NaN value

#### Defined in

[lib/timeserie.ts:84](https://github.com/fatmatto/timeframes/blob/660a552/src/lib/timeserie.ts#L84)

___

### firstValidValue

▸ **firstValidValue**(): `any`

#### Returns

`any`

The first non-NaN value

#### Defined in

[lib/timeserie.ts:112](https://github.com/fatmatto/timeframes/blob/660a552/src/lib/timeserie.ts#L112)

___

### indexes

▸ **indexes**(): `DateLike`[]

#### Returns

`DateLike`[]

The array of time indexes

#### Defined in

[lib/timeserie.ts:56](https://github.com/fatmatto/timeframes/blob/660a552/src/lib/timeserie.ts#L56)

___

### isEmpty

▸ **isEmpty**(): `boolean`

#### Returns

`boolean`

#### Defined in

[lib/timeserie.ts:192](https://github.com/fatmatto/timeframes/blob/660a552/src/lib/timeserie.ts#L192)

___

### last

▸ **last**(): `Point`

#### Returns

`Point`

The last point

#### Defined in

[lib/timeserie.ts:228](https://github.com/fatmatto/timeframes/blob/660a552/src/lib/timeserie.ts#L228)

___

### lastValidIndex

▸ **lastValidIndex**(): `string`

#### Returns

`string`

The time of the latest non-NaN value

#### Defined in

[lib/timeserie.ts:70](https://github.com/fatmatto/timeframes/blob/660a552/src/lib/timeserie.ts#L70)

___

### lastValidValue

▸ **lastValidValue**(): `any`

#### Returns

`any`

The latest non-NaN value

#### Defined in

[lib/timeserie.ts:98](https://github.com/fatmatto/timeframes/blob/660a552/src/lib/timeserie.ts#L98)

___

### length

▸ **length**(): `number`

#### Returns

`number`

#### Defined in

[lib/timeserie.ts:189](https://github.com/fatmatto/timeframes/blob/660a552/src/lib/timeserie.ts#L189)

___

### map

▸ **map**(`fn`): [`TimeSerie`](TimeSerie.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `fn` | `TimeseriesIterator` |

#### Returns

[`TimeSerie`](TimeSerie.md)

#### Defined in

[lib/timeserie.ts:186](https://github.com/fatmatto/timeframes/blob/660a552/src/lib/timeserie.ts#L186)

___

### max

▸ **max**(): `Point`

#### Returns

`Point`

The point with max value, or null

#### Defined in

[lib/timeserie.ts:235](https://github.com/fatmatto/timeframes/blob/660a552/src/lib/timeserie.ts#L235)

___

### min

▸ **min**(): `Point`

#### Returns

`Point`

The point with min value or null

#### Defined in

[lib/timeserie.ts:248](https://github.com/fatmatto/timeframes/blob/660a552/src/lib/timeserie.ts#L248)

___

### removeAt

▸ **removeAt**(`time`): [`TimeSerie`](TimeSerie.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `time` | `DateLike` |

#### Returns

[`TimeSerie`](TimeSerie.md)

#### Defined in

[lib/timeserie.ts:280](https://github.com/fatmatto/timeframes/blob/660a552/src/lib/timeserie.ts#L280)

___

### removeAtIndex

▸ **removeAtIndex**(`index`): [`TimeSerie`](TimeSerie.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `index` | `number` |

#### Returns

[`TimeSerie`](TimeSerie.md)

#### Defined in

[lib/timeserie.ts:284](https://github.com/fatmatto/timeframes/blob/660a552/src/lib/timeserie.ts#L284)

___

### removeBetweenTime

▸ **removeBetweenTime**(`from`, `to`): [`TimeSerie`](TimeSerie.md)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `from` | `DateLike` | start date string in ISO8601 format |
| `to` | `DateLike` | end date string in ISO8601 format |

#### Returns

[`TimeSerie`](TimeSerie.md)

New timeserie without the removed data. Bounds are removed.

#### Defined in

[lib/timeserie.ts:294](https://github.com/fatmatto/timeframes/blob/660a552/src/lib/timeserie.ts#L294)

___

### resample

▸ **resample**(`intervalSizeMs`, `options?`): `TimeseriesResampler`

**`example`**
// Average by hour
const hourlyAverage = ts.resample(1000 * 60 * 60).avg()

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `intervalSizeMs` | `number` | An interval in milliseconds |
| `options` | `ResampleOptions` | - |

#### Returns

`TimeseriesResampler`

a resampler instance that can be used to obtain a new timeserie by aggregating values

#### Defined in

[lib/timeserie.ts:265](https://github.com/fatmatto/timeframes/blob/660a552/src/lib/timeserie.ts#L265)

___

### sum

▸ **sum**(): `number`

#### Returns

`number`

#### Defined in

[lib/timeserie.ts:198](https://github.com/fatmatto/timeframes/blob/660a552/src/lib/timeserie.ts#L198)

___

### toArray

▸ **toArray**(): `Point`[]

#### Returns

`Point`[]

Array of points, where each point is a tuple with ISO8601 timestamp and value

#### Defined in

[lib/timeserie.ts:49](https://github.com/fatmatto/timeframes/blob/660a552/src/lib/timeserie.ts#L49)

___

### values

▸ **values**(): `any`[]

#### Returns

`any`[]

The array of values

#### Defined in

[lib/timeserie.ts:63](https://github.com/fatmatto/timeframes/blob/660a552/src/lib/timeserie.ts#L63)
