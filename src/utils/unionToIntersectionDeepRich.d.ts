import { UnionToIntersection } from "type-fest";
import { IsPlainObject } from "type-fest/source/internal";

export type _ObjectPropertyUnion<Obj, Key> = Obj extends unknown
  ? Key extends keyof Obj
    ? Obj[Key]
    : never
  : never;

export type UnionToIntersectionDeepRich<Type> = [Type] extends [never]
  ? never
  : [Type] extends [Array<infer V>]
    ? Array<UnionToIntersectionDeepRich<V>>
    : [Type] extends [Promise<infer V>]
      ? Promise<UnionToIntersectionDeepRich<V>>
      : [IsPlainObject<Type>] extends [true]
        ? {
            [K in keyof (
              | UnionToIntersection<Type>
              | never
            )]: UnionToIntersectionDeepRich<
              UnionToIntersection<_ObjectPropertyUnion<Type, K>>
            >;
          }
        : UnionToIntersection<Type>;
