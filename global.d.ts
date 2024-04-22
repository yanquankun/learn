declare type a = string | number;

type ReturnType1<T extends (...args: any) => any> = T extends (
  ...args: any
) => infer R
  ? R
  : any;

type Parameter<T extends (...args: any) => any> = T extends (
  ...args: infer P
) => any
  ? P
  : never;

/** type实现deepReadonly */
type deepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends any ? deepReadonly<T[P]> : T[P];
};

declare type Util<T = any> = (p: T) => Boolean;
