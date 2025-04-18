import { getPropertySetterByInsensitiveFirstCharCase } from './utils.js';
import * as errors from './errors.js';
import type { RoBuilderOptions } from './types.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
class RoBuilder<TOrig, TDetail extends Record<string, any>, TCustom = TOrig> {
  private constructor(
    cd: TDetail,
    options?: RoBuilderOptions<TDetail, TCustom>,
  ) {
    const customBuilder = options?.customBuilder;
    const withers = options?.withCalledAlready
      ? new Set<string>(options.withCalledAlready)
      : new Set<string>();

    return new Proxy<RoBuilder<TOrig, TDetail, TCustom>>(
      this as unknown as RoBuilder<TOrig, TDetail, TCustom>,
      {
        get: function (
          target: RoBuilder<TOrig, TDetail, TCustom>,
          name: string | number | symbol,
          value,
        ) {
          const propName = <keyof TDetail>name;
          if (typeof propName === 'string' && propName === 'build') {
            if (customBuilder) {
              return () => {
                const newCd = <TDetail>Object.assign({}, cd);
                return customBuilder(newCd);
              };
            } else {
              return () => {
                const newCd = <TDetail>Object.assign({}, cd);
                return newCd;
              };
            }
          } else if (
            typeof propName === 'string' &&
            propName.startsWith('with')
          ) {
            const witherName = propName;
            const underlyingProp = witherName.substring(4);
            if (withers.has(witherName)) {
              throw new errors.WithMethodMultipleInvocationsError(witherName);
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return (v: any) => {
              const newWithers = new Set<string>(withers);
              newWithers.add(propName);
              const newCd = <TDetail>Object.assign({}, cd);
              const setter = getPropertySetterByInsensitiveFirstCharCase(
                newCd,
                underlyingProp,
              );
              setter!(v);
              if (customBuilder) {
                return new RoBuilder<
                  TOrig,
                  RoBuilderOptions<TDetail, TCustom>,
                  TCustom
                >(newCd, {
                  withCalledAlready: newWithers,
                  customBuilder: (o) => customBuilder(o as TDetail),
                });
              } else {
                return new RoBuilder<
                  TOrig,
                  RoBuilderOptions<TDetail, TCustom>,
                  TCustom
                >(newCd, {
                  withCalledAlready: newWithers,
                });
              }
            };
          }

          const returnVal = Reflect.get(cd, name, value);
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return returnVal;
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        set: function (_1, p, _2, _3): boolean {
          if (typeof p !== 'string') {
            return false;
          }
          if (p.startsWith('with')) {
            throw new errors.IllegalWitherModificationAttemptError(p);
          }
          throw new errors.IllegalReadOnlyPropertyAccessError(
            p,
            'with' + p[0].toLocaleUpperCase() + p.substring(1),
          );
        },
      },
    );
  }
}

export { RoBuilder };
