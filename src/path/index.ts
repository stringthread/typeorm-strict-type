import { MAX_RECURSIVE_LENGTH } from "@/constants";
import { IsPlainObject } from "type-fest/source/internal";
import { ObjectId } from "typeorm/driver/mongodb/typings";

export type HasPath<V> =
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

type PathImpl<
  K extends string,
  V,
  C extends 0[] = [],
> = C["length"] extends MAX_RECURSIVE_LENGTH
  ? [K] | [K, ...any[]] // eslint-disable-line @typescript-eslint/no-explicit-any
  : V extends Promise<infer I>
    ? PathImpl<K, I>
    : V extends Array<infer I>
      ? PathImpl<K, I>
      : HasPath<V> extends true
        ? [K] | [K, ...Path<V, [...C, 0]>]
        : [K];

export type Path<T, C extends 0[] = []> =
  | {
      [K in keyof T]: K extends string ? PathImpl<K, T[K], C> : never;
    }[keyof T]
  | [];

type PathStringImpl<
  K extends string,
  V,
  C extends 0[] = [],
> = C["length"] extends MAX_RECURSIVE_LENGTH
  ? `${K}` | `${K}.${any}` // eslint-disable-line @typescript-eslint/no-explicit-any
  : V extends Promise<infer I>
    ? PathStringImpl<K, I>
    : V extends Array<infer I>
      ? PathStringImpl<K, I>
      : IsPlainObject<V> extends true
        ? `${K}` | `${K}.${_PathString<V, [...C, 0]>}`
        : `${K}`;

type _PathString<T, C extends 0[] = []> =
  T extends Promise<infer I>
    ? _PathString<I, C>
    : T extends Array<infer I>
      ? _PathString<I, C>
      : IsPlainObject<T> extends true
        ? {
            [K in keyof T]: K extends string
              ? PathStringImpl<K, T[K], C>
              : never;
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
