import { Path } from "@/path";
import { Entity } from "./Entity";
import { ConditionalExcept, ConditionalPickDeep } from "type-fest";

export type StrictEntity<
  E extends Entity,
  P extends Path<ConditionalPickDeep<E, Entity>> = [],
> = ConditionalExcept<
  {
    [K in keyof E]: E[K] extends Entity
      ? P extends [K, ...infer R]
        ? R extends Path<ConditionalPickDeep<E[K], Entity>>
          ? StrictEntity<E[K], R>
          : StrictEntity<E[K]>
        : never
      : E[K];
  },
  never
>;
