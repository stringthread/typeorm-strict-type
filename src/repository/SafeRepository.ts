import { StrictEntity } from "@/entity/StrictEntity";
import { FindOptionsPath } from "@/options/FindOptions";
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
  find<Options extends FindManyOptions<Entity> = never>(
    options?: Options
  ): Promise<StrictEntity<Entity, FindOptionsPath<Entity, Options>>[]>;
  findBy(
    options?: FindOptionsWhere<Entity> | FindOptionsWhere<Entity>[]
  ): Promise<StrictEntity<Entity>[]>;
  findAndCount<Options extends FindManyOptions<Entity> = never>(
    options?: Options
  ): Promise<
    [StrictEntity<Entity, FindOptionsPath<Entity, Options>>[], number]
  >;
  findAndCountBy(
    options?: FindOptionsWhere<Entity> | FindOptionsWhere<Entity>[]
  ): Promise<[StrictEntity<Entity>[], number]>;
  /**
   * @deprecated use `findBy` method instead in conjunction with `In` operator
   */
  findByIds(ids: any[]): Promise<StrictEntity<Entity>[]>; // eslint-disable-line @typescript-eslint/no-explicit-any
  findOne<Options extends FindOneOptions<Entity> = never>(
    options?: Options
  ): Promise<StrictEntity<Entity, FindOptionsPath<Entity, Options>> | null>;
  findOneBy(
    options?: FindOptionsWhere<Entity> | FindOptionsWhere<Entity>[]
  ): Promise<StrictEntity<Entity> | null>;
  /**
   * @deprecated use `findOneBy` method instead in conjunction with `In` operator
   */
  findOneById(
    id: number | string | Date | ObjectId
  ): Promise<StrictEntity<Entity> | null>;
  findOneOrFail<Options extends FindOneOptions<Entity> = never>(
    options?: Options
  ): Promise<StrictEntity<Entity, FindOptionsPath<Entity, Options>>>;
  findOneByOrFail(
    options?: FindOptionsWhere<Entity> | FindOptionsWhere<Entity>[]
  ): Promise<StrictEntity<Entity>>;
  extend<CustomRepository>(
    customs: CustomRepository & ThisType<this & CustomRepository>
  ): this & CustomRepository;
}
