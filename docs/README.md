**rots-builder**

***

<h1 align='center'>
  Doubloons
</h1>

| Statements                                                                               | Branches                                                                             | Functions                                                                              | Lines                                                                          |
| ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| ![Statements](https://img.shields.io/badge/statements-86.74%25-yellow.svg?style=flat) | ![Branches](https://img.shields.io/badge/branches-80.95%25-yellow.svg?style=flat) | ![Functions](https://img.shields.io/badge/functions-86.36%25-yellow.svg?style=flat) | ![Lines](https://img.shields.io/badge/lines-87.8%25-yellow.svg?style=flat) |

<br />

## How to use?

```typescript
npm install doubloons
```

Import types:

```typescript
import { Doubloon } from 'doubloons';
import { USD } from 'doubloons/currencies';
```

Create a Doubloon with a string or a Decimal (from Decimal.js) with the intended currency:

```typescript
const x = new Doubloon<USD>(USD, '10.00');
const y = new Doubloon<USD>(USD, new Decimal('10.50'));
console.log(x.add(y));
```

Adding and subtracting between Doubloons is only supported with two Doubloons of the same currency:

```typescript
const x = new Doubloon<USD>(USD, '10.00');
const y = new Doubloon<USD>(USD, '5.05');
console.log(x.add(y));
console.log(x.subtract(y));
```

Multiplying and dividing between Doubloons is forbidden, you can only multiply or divide by a scalar int (number with no decimals) or an instance of Decimal from Decimal.js.

```typescript
const x = new Doubloon<USD>(USD, '10.00');
const y = new Doubloon<USD>(USD, '5.05');
console.log(x.mul(y)); // not allowed
console.log(x.mul(5)); // OK
console.log(x.mul(5.15)); // Not OK
console.log(x.mul(new Decimal(5.15)); // OK
```

Similarly, boolean comparisons require two Doubloons of the same kind.

To get a value out of a Doubloon, you can use .str() to get a string. This will be a properly-quantized decimal number for the given currency, without the currency symbol.

[API Docs](/docs/globals.md)
