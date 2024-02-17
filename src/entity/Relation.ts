import { ConditionalPickDeep } from "type-fest";

declare const RelationNominality: unique symbol;

export type Relation<T extends object> = T & { [RelationNominality]: never };

export type IsRelation<T> = T extends { [RelationNominality]: never } ? true : false;

export type PickRelations<T extends object> = ConditionalPickDeep<T, { [RelationNominality]: never }>;
