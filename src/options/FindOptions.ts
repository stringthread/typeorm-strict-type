import { PickRelations } from "@/entity/Relation";
import { Path } from "@/path";
import { Paths, PickDeep, RequiredDeep } from "type-fest";
import { FindOneOptions, ObjectLiteral } from "typeorm";

export type FindOptionsPath<
  Entity extends ObjectLiteral,
  Options extends FindOneOptions<Entity>,
> = Path<
  RequiredDeep<
    PickDeep<
      Options["relations"],
      Paths<PickRelations<PickRelations<Entity>>> & Paths<Options["relations"]>
    >
  >
> &
  Path<PickRelations<Entity>>;
