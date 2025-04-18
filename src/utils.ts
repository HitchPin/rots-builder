import * as z from 'zod';
const flipChar = (s: string) => {
  if (s.length !== 1) {
    throw new Error('Must be a string with length 1.');
  }
  if (s.toLocaleUpperCase() === s) {
    return s.toLocaleLowerCase();
  } else {
    return s.toLocaleUpperCase();
  }
};
export const flipFirstCase = (s: string) => {
  if (!s || s.length === 0) {
    return s;
  }
  const f = s[0];
  return flipChar(f) + s.substring(1);
};

export const getPropertySetterByInsensitiveFirstCharCase = <T>(
  instance: object,
  possibleName: string,
) => {
  let propertyName: string = possibleName;
  let pd: PropertyDescriptor = Object.getOwnPropertyDescriptor(
    instance,
    possibleName,
  )!;
  if (!pd) {
    propertyName = flipFirstCase(possibleName);
    pd = Object.getOwnPropertyDescriptor(instance, propertyName)!;

    if (!pd) {
      throw new Error(
        `Cannot find property ${possibleName} or ${flipFirstCase(possibleName)} on object:\n${JSON.stringify(instance)}.`,
      );
    }
  }

  if (pd.set) {
    return (v: T) => pd.set!(v);
  } else if (pd.writable) {
    return (v: T) => {
      (instance as Record<string, T>)[propertyName] = v!;
    };
  }
};

export const getZodDefaults = <Schema extends z.AnyZodObject>(
  schema: Schema,
): z.infer<typeof schema> => {
  return Object.fromEntries(
    /* eslint-disable */
    Object.entries(schema.shape).map(([key, value]) => {
      if (value instanceof z.ZodDefault)
        return [key, value._def.defaultValue()];
      return [key, undefined];
    }),
    /* eslint-enable */
  );
};
