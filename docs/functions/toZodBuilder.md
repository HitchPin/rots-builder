[**rots-builder**](../README.md)

***

[rots-builder](../globals.md) / toZodBuilder

# Function: toZodBuilder()

> **toZodBuilder**\<`TSource`, `TBuild`\>(`schema`, `options`?): [`WithBuilder`](../type-aliases/WithBuilder.md)\<`TypeOf`\<`TSource`\>, `TypeOf`\<`TSource`\>, `TBuild`\>

Defined in: factories.ts:41

Just like toRoBuilder, but for zod.

## Type Parameters

### TSource

`TSource` *extends* `AnyZodObject`

### TBuild

`TBuild` = `TSource`\[`"_output"`\]

## Parameters

### schema

`TSource`

the zod schema

### options?

`ZodBuilderProps`\<`TSource`, `TBuild`\>

zod-specific options

## Returns

[`WithBuilder`](../type-aliases/WithBuilder.md)\<`TypeOf`\<`TSource`\>, `TypeOf`\<`TSource`\>, `TBuild`\>

the builder
