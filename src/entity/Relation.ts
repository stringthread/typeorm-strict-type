import { ConditionalPickDeepRich } from "@/utils/conditionalPickDeepRich";

export declare const RelationNominality: unique symbol;

export type Relation<T extends object> = T & { [RelationNominality]: never };

export type IsRelation<T> = T extends { [RelationNominality]: never }
  ? true
  : false;

export type PickRelations<T extends object> = ConditionalPickDeepRich<
  T,
  { [RelationNominality]: never }
>;

export type CopyIsRelation<From, To extends object> =
  IsRelation<From> extends true ? Relation<To> : To;

export type CopyRelationTypes<From, To> = To extends object
  ? CopyIsRelation<From, To>
  : To;
