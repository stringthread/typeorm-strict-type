import { Path, PathString, StringToPath } from "@/path";
import { ConditionalExcept, UnionToIntersection } from "type-fest";
import { SimplifyDeep } from "type-fest/source/merge-deep";
import { IsRelation, PickRelations } from "./Relation";

type _StrictEntity<E extends object, P extends Path<PickRelations<E>> = []> = ConditionalExcept<
  {
    [K in keyof E]: UnionToIntersection<
      E[K] extends object
        ? IsRelation<E[K]> extends true
          ? P extends [K, ...infer R]
            ? R extends Path<PickRelations<E[K]>>
              ? _StrictEntity<E[K], R>
              : _StrictEntity<E[K]>
            : never
          : E[K]
        : E[K]
    >;
  },
  never
>;

export type StrictEntity<E extends object, P extends Path<PickRelations<E>> | PathString<PickRelations<E>> = []> = [
  P,
] extends [PathString<PickRelations<E>>]
  ? StringToPath<PickRelations<E>, P> extends Path<PickRelations<E>>
    ? SimplifyDeep<_StrictEntity<E, StringToPath<PickRelations<E>, P>>>
    : never
  : [P] extends [Path<PickRelations<E>>]
    ? SimplifyDeep<_StrictEntity<E, P>>
    : never;
