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

[lib/types.ts:126](https://github.com/fatmatto/timeframes/blob/a240807/src/lib/types.ts#L126)

## Properties

### from

• **from**: `Date`

#### Defined in

[lib/types.ts:123](https://github.com/fatmatto/timeframes/blob/a240807/src/lib/types.ts#L123)

___

### size

• **size**: `number`

#### Defined in

[lib/types.ts:125](https://github.com/fatmatto/timeframes/blob/a240807/src/lib/types.ts#L125)

___

### to

• **to**: `Date`

#### Defined in

[lib/types.ts:124](https://github.com/fatmatto/timeframes/blob/a240807/src/lib/types.ts#L124)

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

[lib/types.ts:132](https://github.com/fatmatto/timeframes/blob/a240807/src/lib/types.ts#L132)
