import { ConditionalExcept } from "type-fest";
import { IsPlainObject } from "type-fest/source/internal";

declare const conditionalExceptDeepSymbol: unique symbol;

type _ConditionalExceptDeepRichInner<Type, Condition> =
  Exclude<Type, Condition> extends infer V
    ? Type extends Condition
      ? typeof conditionalExceptDeepSymbol
      : V extends Array<infer T>
        ? ConditionalExceptDeepRich<T, Condition> extends never
          ? typeof conditionalExceptDeepSymbol
          : Array<ConditionalExceptDeepRich<T, Condition>>
        : V extends Promise<infer T>
          ? ConditionalExceptDeepRich<T, Condition> extends never
            ? typeof conditionalExceptDeepSymbol
            : Promise<ConditionalExceptDeepRich<T, Condition>>
          : IsPlainObject<V> extends true
            ? ConditionalExceptDeepRich<V, Condition>
            : V
    : never;

export type ConditionalExceptDeepRich<Type, Condition> = Type extends object
  ? ConditionalExcept<
      {
        [Key in keyof (Type | never)]: _ConditionalExceptDeepRichInner<
          Type[Key],
          Condition
        >;
      },
      typeof conditionalExceptDeepSymbol | undefined
    >
  : Exclude<Type, Condition>;
