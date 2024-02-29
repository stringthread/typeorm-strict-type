import { StrictEntity } from "@/entity/StrictEntity";
import {
  FindManyOptionsWithRelations,
  FindOneOptionsWithRelations,
  FindOptionsRelationsPath,
} from "@/options/FindOptions";
import {
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  ObjectId,
  ObjectLiteral,
  Repository,
} from "typeorm";

export type SafeRepository<Entity extends ObjectLiteral> = Omit<
  Repository<Entity>,
  keyof SafeRepositoryOverrides<Entity>
> &
  SafeRepositoryOverrides<Entity>;

interface SafeRepositoryOverrides<Entity extends ObjectLiteral> {
  find(
    options?: Omit<FindManyOptions<Entity>, "relations">
  ): Promise<StrictEntity<Entity, never>[]>;
  find<Relations extends FindManyOptions<Entity>["relations"]>(
    options: FindManyOptionsWithRelations<Entity, Relations>
  ): Promise<
    StrictEntity<Entity, FindOptionsRelationsPath<Entity, Relations>>[]
  >;
  findBy(
    options?: FindOptionsWhere<Entity> | FindOptionsWhere<Entity>[]
  ): Promise<StrictEntity<Entity>[]>;
  findAndCount(
    options?: Omit<FindManyOptions<Entity>, "relations">
  ): Promise<[StrictEntity<Entity, never>[], number]>;
  findAndCount<Relations extends FindManyOptions<Entity>["relations"]>(
    options: FindManyOptionsWithRelations<Entity, Relations>
  ): Promise<
    [
      StrictEntity<Entity, FindOptionsRelationsPath<Entity, Relations>>[],
      number,
    ]
  >;
  findAndCountBy(
    options?: FindOptionsWhere<Entity> | FindOptionsWhere<Entity>[]
  ): Promise<[StrictEntity<Entity>[], number]>;
  /**
   * @deprecated use `findBy` method instead in conjunction with `In` operator
   */
  findByIds(ids: any[]): Promise<StrictEntity<Entity>[]>; // eslint-disable-line @typescript-eslint/no-explicit-any
  findOne(
    options?: Omit<FindOneOptions<Entity>, "relations">
  ): Promise<StrictEntity<Entity, never> | null>;
  findOne<Relations extends FindOneOptions<Entity>["relations"]>(
    options: FindOneOptionsWithRelations<Entity, Relations>
  ): Promise<StrictEntity<
    Entity,
    FindOptionsRelationsPath<Entity, Relations>
  > | null>;
  findOneBy(
    options?: FindOptionsWhere<Entity> | FindOptionsWhere<Entity>[]
  ): Promise<StrictEntity<Entity> | null>;
  /**
   * @deprecated use `findOneBy` method instead in conjunction with `In` operator
   */
  findOneById(
    id: number | string | Date | ObjectId
  ): Promise<StrictEntity<Entity> | null>;
  findOneOrFail(
    options?: Omit<FindOneOptions<Entity>, "relations">
  ): Promise<StrictEntity<Entity, never>>;
  findOneOrFail<Relations extends FindOneOptions<Entity>["relations"]>(
    options: FindOneOptionsWithRelations<Entity, Relations>
  ): Promise<StrictEntity<Entity, FindOptionsRelationsPath<Entity, Relations>>>;
  findOneByOrFail(
    options?: FindOptionsWhere<Entity> | FindOptionsWhere<Entity>[]
  ): Promise<StrictEntity<Entity>>;
  extend<CustomRepository>(
    customs: CustomRepository & ThisType<this & CustomRepository>
  ): this & CustomRepository;
}
