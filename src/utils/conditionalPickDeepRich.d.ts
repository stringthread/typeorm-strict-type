import { ConditionalExcept, EmptyObject } from "type-fest";
import { ConditionalSimplifyDeep } from "type-fest/source/conditional-simplify";
import { IsPlainObject, UnknownRecord } from "type-fest/source/internal";

declare const conditionalPickDeepSymbol: unique symbol;

type _ConditionalPickDeepRichInner<Type, Condition> = Type extends infer V
  ? Type extends Condition
    ? Type
    : V extends Array<infer T>
      ? ConditionalPickDeepRich<T, Condition> extends never
        ? typeof conditionalPickDeepSymbol
        : Array<ConditionalPickDeepRich<T, Condition>>
      : V extends Promise<infer T>
        ? ConditionalPickDeepRich<T, Condition> extends never
          ? typeof conditionalPickDeepSymbol
          : Promise<ConditionalPickDeepRich<T, Condition>>
        : IsPlainObject<V> extends true
          ? ConditionalPickDeepRich<V, Condition>
          : typeof conditionalPickDeepSymbol
  : never;

export type ConditionalPickDeepRich<Type, Condition> = ConditionalSimplifyDeep<
  ConditionalExcept<
    {
      [Key in keyof Type]: _ConditionalPickDeepRichInner<Type[Key], Condition>;
    },
    (typeof conditionalPickDeepSymbol | undefined) | EmptyObject
  >,
  never,
  UnknownRecord
>;
