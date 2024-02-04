import { ConditionalExcept, ConditionalPick } from "type-fest";

import { Entity } from "./Entity";

/**
 * Type to pick properties of relations
 */
export type Relation<E extends Entity> = ConditionalPick<E, Entity>;

/**
 * Type to omit properties of relations
 */
export type Column<E extends Entity> = ConditionalExcept<E, Entity>;
