import { Path, PathString, StringToPath } from "@/path";
import { MAX_RECURSIVE_LENGTH } from "@/constants";
import { ConditionalExceptDeepRich } from "@/utils/conditionalExceptDeepRich";
import {
  CopyRelationTypes,
  IsRelation,
  PickRelations,
  Relation,
} from "./Relation";
import { ObjectLiteral } from "typeorm";
import { UnionToIntersectionDeepRich } from "@/utils/unionToIntersectionDeepRich";
import { SimplifyDeepRich } from "@/utils/simplifyDeepRich";

type _StrictEntityInner<
  T,
  K extends string | number | symbol,
  P,
  C extends 0[],
> =
  T extends Array<infer U>
    ? U extends ObjectLiteral
      ? _StrictEntity<
          Omit<U, K> & { [_ in K]: CopyRelationTypes<T, U> },
          P,
          C
        >[K] extends never
        ? never
        : Array<
            _StrictEntity<
              Omit<U, K> & { [_ in K]: CopyRelationTypes<T, U> },
              P,
              C
            >[K]
          >
      : T
    : T extends Promise<infer U>
      ? U extends ObjectLiteral
        ? _StrictEntity<
            Omit<U, K> & { [_ in K]: CopyRelationTypes<T, U> },
            P,
            C
          >[K] extends never
          ? never
          : Promise<
              _StrictEntity<
                Omit<U, K> & { [_ in K]: CopyRelationTypes<T, U> },
                P,
                C
              >[K]
            >
        : T
      : T extends ObjectLiteral
        ? IsRelation<T> extends true
          ? P extends [K, ...infer R]
            ? _StrictEntity<T, R, [...C, 0]>
            : never
          : T
        : T;

type _StrictEntity<
  E,
  P,
  C extends 0[] = [], // counter of depth
> = C["length"] extends MAX_RECURSIVE_LENGTH
  ? E
  : {
      [K in keyof E]: _StrictEntityInner<E[K], K, P, C>;
    };

export type StrictEntity<
  E extends ObjectLiteral,
  P extends Path<PickRelations<E>> | PathString<PickRelations<E>> = [],
> = [P] extends [PathString<PickRelations<E>>]
  ? StringToPath<PickRelations<E>, P> extends Path<PickRelations<E>>
    ? SimplifyDeepRich<
        UnionToIntersectionDeepRich<
          ConditionalExceptDeepRich<
            _StrictEntity<E, StringToPath<PickRelations<E>, P>>,
            never
          >
        >
      >
    : never
  : [P] extends [Path<PickRelations<E>>]
    ? SimplifyDeepRich<
        UnionToIntersectionDeepRich<
          ConditionalExceptDeepRich<
            SimplifyDeepRich<_StrictEntity<E, P>>,
            never
          >
        >
      >
    : never;

class A {
  constructor(public b: Relation<B>) {}
}
class B {
  constructor(public a: Relation<A>) {}
}
