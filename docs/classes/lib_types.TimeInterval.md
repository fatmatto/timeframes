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

[lib/types.ts:140](https://github.com/fatmatto/timeframes/blob/f601353/src/lib/types.ts#L140)

## Properties

### from

• **from**: `Date`

#### Defined in

[lib/types.ts:137](https://github.com/fatmatto/timeframes/blob/f601353/src/lib/types.ts#L137)

___

### size

• **size**: `number`

#### Defined in

[lib/types.ts:139](https://github.com/fatmatto/timeframes/blob/f601353/src/lib/types.ts#L139)

___

### to

• **to**: `Date`

#### Defined in

[lib/types.ts:138](https://github.com/fatmatto/timeframes/blob/f601353/src/lib/types.ts#L138)

## Methods

### generate

▸ `Static` **generate**(`from`, `to`, `interval`): [`TimeInterval`](lib_types.TimeInterval.md)[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `from` | [`DateLike`](../modules/lib_types.md#datelike) |
| `to` | [`DateLike`](../modules/lib_types.md#datelike) |
| `interval` | `number` |

#### Returns

[`TimeInterval`](lib_types.TimeInterval.md)[]

#### Defined in

[lib/types.ts:146](https://github.com/fatmatto/timeframes/blob/f601353/src/lib/types.ts#L146)
