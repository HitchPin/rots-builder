import type { ExcludeReadonly } from './typeUtils.js';

type AcceptedWitherValue<T> =
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends Record<any, string> ? T | BuildOf<T> : T;

type OneShotBuilder<
  TOrig,
  TInterface,
  TCustom,
  AlreadySupplied extends (keyof ExcludeReadonly<TInterface>)[] = [],
> = {
  [k in keyof Omit<
    ExcludeReadonly<TInterface>,
    AlreadySupplied[number]
  > as `with${Capitalize<string & k>}`]-?: (
    v: AcceptedWitherValue<ExcludeReadonly<TInterface>>[k],
  ) => Readonly<TInterface> &
    OneShotBuilder<TOrig, TInterface, TCustom, [...AlreadySupplied, k]> &
    BuildOf<TCustom>;
};
type BuildOf<T> = {
  build: () => T;
};
type WithBuilder<TOrig, TCur, TCustom> = Readonly<TCur> &
  OneShotBuilder<TOrig, TCur, TCustom> &
  BuildOf<TCustom>;

type CustomBuilder<TDetail, TToBuild> = (o?: TDetail) => TToBuild;
interface RoBuilderOptions<TDetail, TToBuild> {
  withCalledAlready?: Set<string>;
  customBuilder?: CustomBuilder<TDetail, TToBuild> | undefined;
}

export type {
  RoBuilderOptions,
  CustomBuilder,
  WithBuilder,
  BuildOf,
  OneShotBuilder,
  AcceptedWitherValue,
};
