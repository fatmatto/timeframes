[@apio/timeframes](../README.md) / [Modules](../modules.md) / lib/types

# Module: lib/types

## Table of contents

### Classes

- [TimeInterval](../classes/lib_types.TimeInterval.md)

### Interfaces

- [AggregationConfiguration](../interfaces/lib_types.AggregationConfiguration.md)
- [FromIndexOptions](../interfaces/lib_types.FromIndexOptions.md)
- [FromTimeseriesOptions](../interfaces/lib_types.FromTimeseriesOptions.md)
- [IndexCreationOptions](../interfaces/lib_types.IndexCreationOptions.md)
- [ReindexOptions](../interfaces/lib_types.ReindexOptions.md)
- [Row](../interfaces/lib_types.Row.md)
- [TelemetryV1Output](../interfaces/lib_types.TelemetryV1Output.md)
- [TelemetryV1OutputProperty](../interfaces/lib_types.TelemetryV1OutputProperty.md)
- [TimeSeriesOperationOptions](../interfaces/lib_types.TimeSeriesOperationOptions.md)

### Type Aliases

- [ColumnAggregation](lib_types.md#columnaggregation)
- [DateLike](lib_types.md#datelike)
- [Index](lib_types.md#index)
- [IntervalOptions](lib_types.md#intervaloptions)
- [Metadata](lib_types.md#metadata)
- [PartitionOptions](lib_types.md#partitionoptions)
- [Point](lib_types.md#point)
- [PointValue](lib_types.md#pointvalue)
- [ReduceOperation](lib_types.md#reduceoperation)
- [ResampleDefaultAggregation](lib_types.md#resampledefaultaggregation)
- [ResampleOptions](lib_types.md#resampleoptions)
- [TimeFrameInternal](lib_types.md#timeframeinternal)
- [TimeFrameInternalRow](lib_types.md#timeframeinternalrow)
- [TimeFrameReduceOptions](lib_types.md#timeframereduceoptions)
- [TimeFrameResampleOptions](lib_types.md#timeframeresampleoptions)
- [TimeSerieReduceOptions](lib_types.md#timeseriereduceoptions)
- [TimeframeRowsIterator](lib_types.md#timeframerowsiterator)
- [TimeserieIterator](lib_types.md#timeserieiterator)
- [TimeseriePointCombiner](lib_types.md#timeseriepointcombiner)
- [TimeseriePointIterator](lib_types.md#timeseriepointiterator)

### Functions

- [createIndex](lib_types.md#createindex)

## Type Aliases

### ColumnAggregation

Ƭ **ColumnAggregation**: ``"avg"`` \| ``"last"`` \| ``"first"`` \| ``"min"`` \| ``"max"`` \| ``"delta"`` \| ``"sum"``

#### Defined in

[lib/types.ts:70](https://github.com/fatmatto/timeframes/blob/a240807/src/lib/types.ts#L70)

___

### DateLike

Ƭ **DateLike**: `Date` \| `string` \| `number`

#### Defined in

[lib/types.ts:6](https://github.com/fatmatto/timeframes/blob/a240807/src/lib/types.ts#L6)

___

### Index

Ƭ **Index**: `string`[]

#### Defined in

[lib/types.ts:48](https://github.com/fatmatto/timeframes/blob/a240807/src/lib/types.ts#L48)

___

### IntervalOptions

Ƭ **IntervalOptions**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `from?` | [`DateLike`](lib_types.md#datelike) |
| `interval` | `number` |
| `to?` | [`DateLike`](lib_types.md#datelike) |

#### Defined in

[lib/types.ts:73](https://github.com/fatmatto/timeframes/blob/a240807/src/lib/types.ts#L73)

___

### Metadata

Ƭ **Metadata**: `Object`

#### Index signature

▪ [key: `string`]: `any`

#### Defined in

[lib/types.ts:18](https://github.com/fatmatto/timeframes/blob/a240807/src/lib/types.ts#L18)

___

### PartitionOptions

Ƭ **PartitionOptions**: [`IntervalOptions`](lib_types.md#intervaloptions)

#### Defined in

[lib/types.ts:83](https://github.com/fatmatto/timeframes/blob/a240807/src/lib/types.ts#L83)

___

### Point

Ƭ **Point**: readonly [`string`, [`PointValue`](lib_types.md#pointvalue)]

A time indexed value

#### Defined in

[lib/types.ts:10](https://github.com/fatmatto/timeframes/blob/a240807/src/lib/types.ts#L10)

___

### PointValue

Ƭ **PointValue**: `number` \| `string` \| `boolean` \| `any`

#### Defined in

[lib/types.ts:4](https://github.com/fatmatto/timeframes/blob/a240807/src/lib/types.ts#L4)

___

### ReduceOperation

Ƭ **ReduceOperation**: ``"min"`` \| ``"max"`` \| ``"first"`` \| ``"last"`` \| ``"avg"`` \| ``"sum"`` \| ``"delta"``

#### Defined in

[lib/types.ts:106](https://github.com/fatmatto/timeframes/blob/a240807/src/lib/types.ts#L106)

___

### ResampleDefaultAggregation

Ƭ **ResampleDefaultAggregation**: [`ColumnAggregation`](lib_types.md#columnaggregation)

#### Defined in

[lib/types.ts:71](https://github.com/fatmatto/timeframes/blob/a240807/src/lib/types.ts#L71)

___

### ResampleOptions

Ƭ **ResampleOptions**: [`IntervalOptions`](lib_types.md#intervaloptions) & { `dropNaN?`: `boolean` ; `operation`: [`ResampleDefaultAggregation`](lib_types.md#resampledefaultaggregation)  }

#### Defined in

[lib/types.ts:85](https://github.com/fatmatto/timeframes/blob/a240807/src/lib/types.ts#L85)

___

### TimeFrameInternal

Ƭ **TimeFrameInternal**: `Object`

#### Index signature

▪ [time: `string`]: [`TimeFrameInternalRow`](lib_types.md#timeframeinternalrow)

#### Defined in

[lib/types.ts:25](https://github.com/fatmatto/timeframes/blob/a240807/src/lib/types.ts#L25)

___

### TimeFrameInternalRow

Ƭ **TimeFrameInternalRow**: `Object`

#### Index signature

▪ [columnName: `string`]: [`PointValue`](lib_types.md#pointvalue)

#### Defined in

[lib/types.ts:22](https://github.com/fatmatto/timeframes/blob/a240807/src/lib/types.ts#L22)

___

### TimeFrameReduceOptions

Ƭ **TimeFrameReduceOptions**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `operation` | [`ReduceOperation`](lib_types.md#reduceoperation) |
| `operations?` | { `[key: string]`: [`ReduceOperation`](lib_types.md#reduceoperation);  } |

#### Defined in

[lib/types.ts:108](https://github.com/fatmatto/timeframes/blob/a240807/src/lib/types.ts#L108)

___

### TimeFrameResampleOptions

Ƭ **TimeFrameResampleOptions**: [`ResampleOptions`](lib_types.md#resampleoptions) & { `operations?`: { `[key: string]`: [`ColumnAggregation`](lib_types.md#columnaggregation);  }  }

#### Defined in

[lib/types.ts:90](https://github.com/fatmatto/timeframes/blob/a240807/src/lib/types.ts#L90)

___

### TimeSerieReduceOptions

Ƭ **TimeSerieReduceOptions**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `operation` | [`ColumnAggregation`](lib_types.md#columnaggregation) |

#### Defined in

[lib/types.ts:79](https://github.com/fatmatto/timeframes/blob/a240807/src/lib/types.ts#L79)

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

[lib/types.ts:63](https://github.com/fatmatto/timeframes/blob/a240807/src/lib/types.ts#L63)

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

[lib/types.ts:68](https://github.com/fatmatto/timeframes/blob/a240807/src/lib/types.ts#L68)

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

[lib/types.ts:58](https://github.com/fatmatto/timeframes/blob/a240807/src/lib/types.ts#L58)

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

[lib/types.ts:53](https://github.com/fatmatto/timeframes/blob/a240807/src/lib/types.ts#L53)

## Functions

### createIndex

▸ **createIndex**(`options`): [`Index`](lib_types.md#index)

Generates a time-index

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`IndexCreationOptions`](../interfaces/lib_types.IndexCreationOptions.md) |

#### Returns

[`Index`](lib_types.md#index)

#### Defined in

[lib/types.ts:151](https://github.com/fatmatto/timeframes/blob/a240807/src/lib/types.ts#L151)
