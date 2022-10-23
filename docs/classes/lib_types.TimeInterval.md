[@apio/timeframes](../README.md) / [Modules](../modules.md) / [lib/types](../modules/lib_types.md) / TimeInterval

# Class: TimeInterval

[lib/types](../modules/lib_types.md).TimeInterval

## Table of contents

### Constructors

- [constructor](lib_types.TimeInterval.md#constructor)

### Properties

- [from](lib_types.TimeInterval.md#from)
- [size](lib_types.TimeInterval.md#size)
- [to](lib_types.TimeInterval.md#to)

### Methods

- [generate](lib_types.TimeInterval.md#generate)

## Constructors

### constructor

• **new TimeInterval**(`from`, `to`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `from` | `Date` |
| `to` | `Date` |

#### Defined in

[lib/types.ts:119](https://github.com/fatmatto/timeframes/blob/497de10/src/lib/types.ts#L119)

## Properties

### from

• **from**: `Date`

#### Defined in

[lib/types.ts:116](https://github.com/fatmatto/timeframes/blob/497de10/src/lib/types.ts#L116)

___

### size

• **size**: `number`

#### Defined in

[lib/types.ts:118](https://github.com/fatmatto/timeframes/blob/497de10/src/lib/types.ts#L118)

___

### to

• **to**: `Date`

#### Defined in

[lib/types.ts:117](https://github.com/fatmatto/timeframes/blob/497de10/src/lib/types.ts#L117)

## Methods

### generate

▸ `Static` **generate**(`from`, `to`, `size`): [`TimeInterval`](lib_types.TimeInterval.md)[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `from` | [`DateLike`](../modules/lib_types.md#datelike) |
| `to` | [`DateLike`](../modules/lib_types.md#datelike) |
| `size` | `number` |

#### Returns

[`TimeInterval`](lib_types.TimeInterval.md)[]

#### Defined in

[lib/types.ts:125](https://github.com/fatmatto/timeframes/blob/497de10/src/lib/types.ts#L125)
