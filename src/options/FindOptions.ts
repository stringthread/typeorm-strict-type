import { PickRelations } from "@/entity/Relation";
import { Path } from "@/path";
import { Paths, PickDeep, RequiredDeep } from "type-fest";
import { FindManyOptions, FindOneOptions, ObjectLiteral } from "typeorm";

export type FindOptionsRelationsPath<
  Entity extends ObjectLiteral,
  Relations extends FindOneOptions<Entity>["relations"],
> = Path<
  RequiredDeep<
    PickDeep<
      Relations,
      Paths<PickRelations<Entity> & Relations> & Paths<Relations>
    >
  >
> &
  Path<PickRelations<Entity>>;

export type FindManyOptionsWithRelations<
  Entity extends ObjectLiteral,
  Relations extends FindManyOptions<Entity>["relations"],
> = Omit<FindManyOptions<Entity>, "relations"> & {
  relations: Relations;
};

export type FindOneOptionsWithRelations<
  Entity extends ObjectLiteral,
  Relations extends FindOneOptions<Entity>["relations"],
> = Omit<FindOneOptions<Entity>, "relations"> & {
  relations: Relations;
};
