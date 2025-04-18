[**rots-builder**](../README.md)

***

[rots-builder](../globals.md) / toRoBuilder

# Function: toRoBuilder()

> **toRoBuilder**\<`T`, `BuildType`\>(`initialValues`, `customBuilder`?): [`WithBuilder`](../type-aliases/WithBuilder.md)\<`T`, `T`, `BuildType`\>

Defined in: factories.ts:13

## Type Parameters

### T

`T` *extends* `Record`\<`string`, `any`\>

### BuildType

`BuildType` = `T`

## Parameters

### initialValues

`T`

initial values of the object

### customBuilder?

`CustomBuilder`\<`T`, `BuildType`\>

custom builder type

## Returns

[`WithBuilder`](../type-aliases/WithBuilder.md)\<`T`, `T`, `BuildType`\>

ro typesafe builder
