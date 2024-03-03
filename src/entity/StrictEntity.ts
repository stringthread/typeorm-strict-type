import { Path, PathString, StringToPath } from "@/path";
import { MAX_RECURSIVE_LENGTH } from "@/constants";
import { ConditionalExcept, UnionToIntersection } from "type-fest";
import { SimplifyDeep } from "type-fest/source/merge-deep";
import { IsRelation, PickRelations } from "./Relation";
import { ObjectLiteral } from "typeorm";

type _StrictEntity<
  E extends ObjectLiteral,
  P extends Path<PickRelations<E>> = [],
  C extends 0[] = [], // counter of depth
> = C["length"] extends MAX_RECURSIVE_LENGTH
  ? E
  : ConditionalExcept<
      {
        [K in keyof E]: UnionToIntersection<
          E[K] extends object
            ? IsRelation<E[K]> extends true
              ? P extends [K, ...infer R]
                ? R extends Path<PickRelations<E[K]>>
                  ? _StrictEntity<E[K], R, [...C, 0]>
                  : _StrictEntity<E[K], [], [...C, 0]>
                : never
              : E[K]
            : E[K]
        >;
      },
      never
    >;

export type StrictEntity<
  E extends ObjectLiteral,
  P extends Path<PickRelations<E>> | PathString<PickRelations<E>> = [],
> = [P] extends [PathString<PickRelations<E>>]
  ? StringToPath<PickRelations<E>, P> extends Path<PickRelations<E>>
    ? SimplifyDeep<_StrictEntity<E, StringToPath<PickRelations<E>, P>>>
    : never
  : [P] extends [Path<PickRelations<E>>]
    ? SimplifyDeep<_StrictEntity<E, P>>
    : never;
