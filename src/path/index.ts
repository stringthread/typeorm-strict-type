import { ObjectId } from "typeorm/driver/mongodb/typings";

type HasPath<V> =
  V extends Promise<infer I>
    ? HasPath<I>
    : V extends Array<infer I>
      ? HasPath<I>
      : V extends string
        ? false
        : V extends number
          ? false
          : V extends boolean
            ? false
            : V extends (...props: never[]) => unknown
              ? false
              : V extends Buffer
                ? false
                : V extends Date
                  ? false
                  : V extends ObjectId
                    ? false
                    : V extends object
                      ? true
                      : false;

type PathImpl<K extends string, V> =
  V extends Promise<infer I>
    ? PathImpl<K, I>
    : V extends Array<infer I>
      ? PathImpl<K, I>
      : HasPath<V> extends true
        ? [K] | [K, ...Path<V>]
        : [K];

export type Path<T> =
  | {
      [K in keyof T]: K extends string ? PathImpl<K, T[K]> : never;
    }[keyof T]
  | [];

type PathStringImpl<K extends string, V> = V extends object
  ? `${K}` | `${K}.${_PathString<V>}`
  : `${K}`;

type _PathString<T> = T extends object
  ? {
      [K in keyof T]: K extends string ? PathStringImpl<K, T[K]> : never;
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
