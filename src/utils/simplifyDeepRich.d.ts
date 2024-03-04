import { IsPlainObject } from "type-fest/source/internal";

export type SimplifyDeepRich<Type> = [Type] extends [never]
  ? never
  : [Type] extends [Array<infer V>]
    ? Array<SimplifyDeepRich<V>>
    : [Type] extends [Promise<infer V>]
      ? Promise<SimplifyDeepRich<V>>
      : [IsPlainObject<Type>] extends [true]
        ? { [Key in keyof (Type | never)]: SimplifyDeepRich<Type[Key]> }
        : Type;
