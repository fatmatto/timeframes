[@apio/timeframes](../README.md) / [Exports](../modules.md) / TimeFrame

# Class: TimeFrame

Timeseries oriented dataframe

## Table of contents

### Constructors

- [constructor](TimeFrame.md#constructor)

### Properties

- [columns](TimeFrame.md#columns)
- [data](TimeFrame.md#data)

### Methods

- [atTime](TimeFrame.md#attime)
- [column](TimeFrame.md#column)
- [groupBy](TimeFrame.md#groupby)
- [length](TimeFrame.md#length)
- [toArray](TimeFrame.md#toarray)
- [fromInternalFormat](TimeFrame.md#frominternalformat)
- [fromTelemetryV1Output](TimeFrame.md#fromtelemetryv1output)
- [fromTimeseries](TimeFrame.md#fromtimeseries)
- [join](TimeFrame.md#join)

## Constructors

### constructor

• **new TimeFrame**(`rows`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `rows` | `Row`[] |

#### Defined in

[lib/timeframe.ts:79](https://github.com/fatmatto/timeframes/blob/660a552/src/lib/timeframe.ts#L79)

## Properties

### columns

• `Readonly` **columns**: readonly `string`[]

#### Defined in

[lib/timeframe.ts:16](https://github.com/fatmatto/timeframes/blob/660a552/src/lib/timeframe.ts#L16)

___

### data

• `Readonly` **data**: `TimeFrameInternal`

#### Defined in

[lib/timeframe.ts:15](https://github.com/fatmatto/timeframes/blob/660a552/src/lib/timeframe.ts#L15)

## Methods

### atTime

▸ **atTime**(`time`): `Row`

#### Parameters

| Name | Type |
| :------ | :------ |
| `time` | `string` |

#### Returns

`Row`

A row at a given time or null

#### Defined in

[lib/timeframe.ts:114](https://github.com/fatmatto/timeframes/blob/660a552/src/lib/timeframe.ts#L114)

___

### column

▸ **column**(`name`): [`TimeSerie`](TimeSerie.md)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | The name of the wanted column |

#### Returns

[`TimeSerie`](TimeSerie.md)

The column as timeseries

#### Defined in

[lib/timeframe.ts:99](https://github.com/fatmatto/timeframes/blob/660a552/src/lib/timeframe.ts#L99)

___

### groupBy

▸ **groupBy**(`column`): `TimeFrameGrouper`

#### Parameters

| Name | Type |
| :------ | :------ |
| `column` | `string` |

#### Returns

`TimeFrameGrouper`

#### Defined in

[lib/timeframe.ts:122](https://github.com/fatmatto/timeframes/blob/660a552/src/lib/timeframe.ts#L122)

___

### length

▸ **length**(): `number`

#### Returns

`number`

#### Defined in

[lib/timeframe.ts:118](https://github.com/fatmatto/timeframes/blob/660a552/src/lib/timeframe.ts#L118)

___

### toArray

▸ **toArray**(): readonly `Row`[]

#### Returns

readonly `Row`[]

Array of rows

#### Defined in

[lib/timeframe.ts:106](https://github.com/fatmatto/timeframes/blob/660a552/src/lib/timeframe.ts#L106)

___

### fromInternalFormat

▸ `Static` **fromInternalFormat**(`data`): [`TimeFrame`](TimeFrame.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `TimeFrameInternal` |

#### Returns

[`TimeFrame`](TimeFrame.md)

#### Defined in

[lib/timeframe.ts:42](https://github.com/fatmatto/timeframes/blob/660a552/src/lib/timeframe.ts#L42)

___

### fromTelemetryV1Output

▸ `Static` **fromTelemetryV1Output**(`data?`): [`TimeFrame`](TimeFrame.md)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `TelemetryV1Output` | An object which is telemetry V1 output {device1: {property1:[[time,value]],property2:[[time,value]]}} |

#### Returns

[`TimeFrame`](TimeFrame.md)

#### Defined in

[lib/timeframe.ts:22](https://github.com/fatmatto/timeframes/blob/660a552/src/lib/timeframe.ts#L22)

___

### fromTimeseries

▸ `Static` **fromTimeseries**(`timeseries`): [`TimeFrame`](TimeFrame.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `timeseries` | [`TimeSerie`](TimeSerie.md)[] |

#### Returns

[`TimeFrame`](TimeFrame.md)

#### Defined in

[lib/timeframe.ts:48](https://github.com/fatmatto/timeframes/blob/660a552/src/lib/timeframe.ts#L48)

___

### join

▸ `Static` **join**(`timeframes`): [`TimeFrame`](TimeFrame.md)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `timeframes` | [`TimeFrame`](TimeFrame.md)[] | Array of timeframes to join together |

#### Returns

[`TimeFrame`](TimeFrame.md)

A timeframe with joined columns

#### Defined in

[lib/timeframe.ts:74](https://github.com/fatmatto/timeframes/blob/660a552/src/lib/timeframe.ts#L74)
