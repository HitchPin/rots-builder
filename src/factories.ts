import { z } from 'zod';
import type { WithBuilder, RoBuilderOptions, CustomBuilder } from './types.js';
import { RoBuilder } from './RoBuilder.js';
import { getZodDefaults } from './utils.js';

/**
 *
 * @param {T} initialValues initial values of the object
 * @param {CustomBuilder<T, BuildType>} customBuilder custom builder type
 * @returns {WithBuilder<T, T, BuildType>} ro typesafe builder
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toRoBuilder<T extends Record<string, any>, BuildType = T>(
  initialValues: T,
  customBuilder?: CustomBuilder<T, BuildType>,
): WithBuilder<T, T, BuildType> {
  const vc = Object.assign({}, initialValues);
  const withPublicConstruct = RoBuilder as {
    new (c: T, o: RoBuilderOptions<T, BuildType>): RoBuilder<T, T, BuildType>;
  };
  return new withPublicConstruct(
    vc,
    customBuilder
      ? {
          customBuilder: customBuilder,
        }
      : {},
  ) as unknown as WithBuilder<T, T, BuildType>;
}
interface ZodBuilderProps<TSchema extends z.AnyZodObject, BuildType> {
  initialValues?: Partial<TSchema['_input']>;
  customBuilder?: CustomBuilder<TSchema['_output'], BuildType>;
}

/**
 * Just like toRoBuilder, but for zod.
 * @param {TSource} schema the zod schema
 * @param {ZodBuilderProps<TSource, TBuild>} options zod-specific options
 * @returns {WithBuilder<z.infer<typeof schema>, z.infer<typeof schema>, TBuild>} the builder
 */
function toZodBuilder<
  TSource extends z.AnyZodObject,
  TBuild = TSource['_output'],
>(
  schema: TSource,
  options?: ZodBuilderProps<TSource, TBuild>,
): WithBuilder<z.infer<typeof schema>, z.infer<typeof schema>, TBuild> {
  // eslint-disable-next-line
  const v: any = {
    ...getZodDefaults(schema),
    ...(options?.initialValues ?? {}),
  };
  // eslint-disable-next-line
  const vc: any = Object.assign({}, v);
  const withPublicConstruct = RoBuilder as {
    new (
      c: z.infer<typeof schema>,
      o: RoBuilderOptions<z.infer<typeof schema>, TBuild>,
    ): RoBuilder<z.infer<typeof schema>, z.infer<typeof schema>, TBuild>;
  };
  // eslint-disable-next-line
  return new withPublicConstruct(vc, {
    customBuilder: options?.customBuilder,
  }) as unknown as WithBuilder<
    z.infer<typeof schema>,
    z.infer<typeof schema>,
    TBuild
  >;
}

export { toRoBuilder, toZodBuilder };
