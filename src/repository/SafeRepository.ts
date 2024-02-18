import { StrictEntity } from "@/entity/StrictEntity";
import { FindOptionsPath } from "@/options/FindOptions";
import { FindManyOptions, ObjectLiteral, Repository } from "typeorm";

export type SafeRepository<Entity extends ObjectLiteral> = Omit<
  Repository<Entity>,
  "find"
> & {
  find<Options extends FindManyOptions<Entity> = never>(
    options?: Options
  ): Promise<StrictEntity<Entity, FindOptionsPath<Entity, Options>>>;
};
