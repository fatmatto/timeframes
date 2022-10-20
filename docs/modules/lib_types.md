[@apio/timeframes](../README.md) / [Modules](../modules.md) / lib/types

# Module: lib/types

## Table of contents

### Classes

- [TimeInterval](../classes/lib_types.TimeInterval.md)

### Interfaces

- [AggregationConfiguration](../interfaces/lib_types.AggregationConfiguration.md)
- [AggregationOptions](../interfaces/lib_types.AggregationOptions.md)
- [Row](../interfaces/lib_types.Row.md)
- [TelemetryV1Output](../interfaces/lib_types.TelemetryV1Output.md)
- [TelemetryV1OutputProperty](../interfaces/lib_types.TelemetryV1OutputProperty.md)
- [TimeFramePartitionOptions](../interfaces/lib_types.TimeFramePartitionOptions.md)

### Type Aliases

- [DateLike](lib_types.md#datelike)
- [Metadata](lib_types.md#metadata)
- [Point](lib_types.md#point)
- [PointValue](lib_types.md#pointvalue)
- [ResampleOptions](lib_types.md#resampleoptions)
- [TimeFrameInternal](lib_types.md#timeframeinternal)
- [TimeFrameInternalRow](lib_types.md#timeframeinternalrow)
- [TimeframeRowsIterator](lib_types.md#timeframerowsiterator)
- [TimeserieIterator](lib_types.md#timeserieiterator)
- [TimeseriePointCombiner](lib_types.md#timeseriepointcombiner)
- [TimeseriePointIterator](lib_types.md#timeseriepointiterator)

## Type Aliases

### DateLike

Ƭ **DateLike**: `Date` \| `string` \| `number`

#### Defined in

[lib/types.ts:34](https://github.com/fatmatto/timeframes/blob/92e131e/src/lib/types.ts#L34)

___

### Metadata

Ƭ **Metadata**: `Object`

#### Index signature

▪ [key: `string`]: `any`

#### Defined in

[lib/types.ts:15](https://github.com/fatmatto/timeframes/blob/92e131e/src/lib/types.ts#L15)

___

### Point

Ƭ **Point**: readonly [`string`, [`PointValue`](lib_types.md#pointvalue)]

A time indexed value

#### Defined in

[lib/types.ts:7](https://github.com/fatmatto/timeframes/blob/92e131e/src/lib/types.ts#L7)

___

### PointValue

Ƭ **PointValue**: `number` \| `string` \| `boolean` \| `any`

#### Defined in

[lib/types.ts:3](https://github.com/fatmatto/timeframes/blob/92e131e/src/lib/types.ts#L3)

___

### ResampleOptions

Ƭ **ResampleOptions**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `aggregations?` | `ResampleAggregationMap` |
| `defaultAggregation?` | `ResampleDefaultAggregation` |
| `dropNaN?` | `boolean` |
| `from?` | [`DateLike`](lib_types.md#datelike) |
| `size` | `number` |
| `to?` | [`DateLike`](lib_types.md#datelike) |

#### Defined in

[lib/types.ts:68](https://github.com/fatmatto/timeframes/blob/92e131e/src/lib/types.ts#L68)

___

### TimeFrameInternal

Ƭ **TimeFrameInternal**: `Object`

#### Index signature

▪ [time: `string`]: [`TimeFrameInternalRow`](lib_types.md#timeframeinternalrow)

#### Defined in

[lib/types.ts:22](https://github.com/fatmatto/timeframes/blob/92e131e/src/lib/types.ts#L22)

___

### TimeFrameInternalRow

Ƭ **TimeFrameInternalRow**: `Object`

#### Index signature

▪ [columnName: `string`]: [`PointValue`](lib_types.md#pointvalue)

#### Defined in

[lib/types.ts:19](https://github.com/fatmatto/timeframes/blob/92e131e/src/lib/types.ts#L19)

___

### TimeframeRowsIterator

Ƭ **TimeframeRowsIterator**: (`value`: [`Row`](../interfaces/lib_types.Row.md), `index`: `number`, `array`: `ReadonlyArray`<[`Row`](../interfaces/lib_types.Row.md)\>) => `any`

#### Type declaration

▸ (`value`, `index`, `array`): `any`

Support type for iterating rows from a timeframe

##### Parameters

| Name | Type |
| :------ | :------ |
| `value` | [`Row`](../interfaces/lib_types.Row.md) |
| `index` | `number` |
| `array` | `ReadonlyArray`<[`Row`](../interfaces/lib_types.Row.md)\> |

##### Returns

`any`

#### Defined in

[lib/types.ts:49](https://github.com/fatmatto/timeframes/blob/92e131e/src/lib/types.ts#L49)

___

### TimeserieIterator

Ƭ **TimeserieIterator**: (`value`: [`TimeSerie`](../classes/lib_timeserie.TimeSerie.md), `index`: `number`, `array`: `ReadonlyArray`<[`TimeSerie`](../classes/lib_timeserie.TimeSerie.md)\>) => `any`

#### Type declaration

▸ (`value`, `index`, `array`): `any`

Support type for iterating timeseries

##### Parameters

| Name | Type |
| :------ | :------ |
| `value` | [`TimeSerie`](../classes/lib_timeserie.TimeSerie.md) |
| `index` | `number` |
| `array` | `ReadonlyArray`<[`TimeSerie`](../classes/lib_timeserie.TimeSerie.md)\> |

##### Returns

`any`

#### Defined in

[lib/types.ts:54](https://github.com/fatmatto/timeframes/blob/92e131e/src/lib/types.ts#L54)

___

### TimeseriePointCombiner

Ƭ **TimeseriePointCombiner**: (`values`: [`PointValue`](lib_types.md#pointvalue)[], `index`: [`DateLike`](lib_types.md#datelike)) => [`PointValue`](lib_types.md#pointvalue)

#### Type declaration

▸ (`values`, `index`): [`PointValue`](lib_types.md#pointvalue)

Support type for combining point values

##### Parameters

| Name | Type |
| :------ | :------ |
| `values` | [`PointValue`](lib_types.md#pointvalue)[] |
| `index` | [`DateLike`](lib_types.md#datelike) |

##### Returns

[`PointValue`](lib_types.md#pointvalue)

#### Defined in

[lib/types.ts:44](https://github.com/fatmatto/timeframes/blob/92e131e/src/lib/types.ts#L44)

___

### TimeseriePointIterator

Ƭ **TimeseriePointIterator**: (`value`: [`Point`](lib_types.md#point), `index`: `number`, `array`: `ReadonlyArray`<[`Point`](lib_types.md#point)\>) => `any`

#### Type declaration

▸ (`value`, `index`, `array`): `any`

Support type for iterating points from a timeserie

##### Parameters

| Name | Type |
| :------ | :------ |
| `value` | [`Point`](lib_types.md#point) |
| `index` | `number` |
| `array` | `ReadonlyArray`<[`Point`](lib_types.md#point)\> |

##### Returns

`any`

#### Defined in

[lib/types.ts:39](https://github.com/fatmatto/timeframes/blob/92e131e/src/lib/types.ts#L39)
