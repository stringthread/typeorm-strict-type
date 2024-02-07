type PathImpl<K extends string | number, V> = V extends object
  ? [`${K}`] | [`${K}`, ...Path<V>]
  : [`${K}`];

export type Path<T> =
  | (T extends object
      ? {
          [K in keyof T]: PathImpl<K & string, T[K]>;
        }[keyof T]
      : never)
  | [];

type PathStringImpl<K extends string | number, V> = V extends object
  ? `${K}` | `${K}.${_PathString<V>}`
  : `${K}`;

type _PathString<T> = T extends object
  ? {
      [K in keyof T]: PathStringImpl<K & string, T[K]>;
    }[keyof T]
  : never;

export type PathString<T> = _PathString<T> | "";

export type StringToPath<T, S extends PathString<T>> =
  | (S extends `${infer F}.${infer R}`
      ? F extends keyof T
        ?
            | [F]
            | (R extends PathString<T[F]>
                ? [F, ...StringToPath<T[F], R>]
                : never)
        : never
      : S extends ""
        ? never
        : [S])
  | [];
