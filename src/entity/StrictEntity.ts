import { Path, PathString, StringToPath } from "@/path";
import { Entity } from "./Entity";
import { ConditionalExcept, ConditionalPickDeep, UnionToIntersection } from "type-fest";
import { SimplifyDeep } from "type-fest/source/merge-deep";

type _StrictEntity<E extends Entity, P extends Path<ConditionalPickDeep<E, Entity>> = []> = ConditionalExcept<
  {
    [K in keyof E]: UnionToIntersection<
      E[K] extends Entity
        ? P extends [K, ...infer R]
          ? R extends Path<ConditionalPickDeep<E[K], Entity>>
            ? _StrictEntity<E[K], R>
            : _StrictEntity<E[K]>
          : never
        : E[K]
    >;
  },
  never
>;

export type StrictEntity<
  E extends Entity,
  P extends Path<ConditionalPickDeep<E, Entity>> | PathString<ConditionalPickDeep<E, Entity>> = [],
> = [P] extends [PathString<ConditionalPickDeep<E, Entity>>]
  ? StringToPath<ConditionalPickDeep<E, Entity>, P> extends Path<ConditionalPickDeep<E, Entity>>
    ? SimplifyDeep<_StrictEntity<E, StringToPath<ConditionalPickDeep<E, Entity>, P>>>
    : never
  : [P] extends [Path<ConditionalPickDeep<E, Entity>>]
    ? SimplifyDeep<_StrictEntity<E, P>>
    : never;
