import { Relation } from "@/entity";
import { SafeRepository } from "@/repository";
import { describe, expectTypeOf, it } from "vitest";

describe("SafeRepository", () => {
  type Entity = {
    a: number;
    b: Relation<{
      c: string;
      d: Relation<{
        e: number;
      }>;
    }>;
    b2: Relation<{
      c: string;
      d: Relation<{
        e: number;
      }>;
    }>;
    b3: Relation<{
      c: string;
      d: Relation<{
        e: number;
      }>;
    }>;
  };

  it("find should omit relations without option", async () => {
    const repository = {} as unknown as SafeRepository<Entity>;
    const result = await repository.find?.();
    expectTypeOf(result).toEqualTypeOf<Pick<Entity, "a">[]>();
  });

  it("find should return only specified relations", async () => {
    const repository = {} as unknown as SafeRepository<Entity>;
    const result = await repository.find?.({
      relations: {
        b: { d: true },
        b2: true,
      },
    });
    expectTypeOf(result).toEqualTypeOf<
      {
        a: number;
        b: {
          c: string;
          d: {
            e: number;
          };
        };
        b2: {
          c: string;
        };
      }[]
    >();
  });

  it("find should accept self-referenced mapped types", async () => {
    class A {
      constructor(public b: Relation<B>) {}
    }
    class B {
      constructor(public a: Relation<A>) {}
    }
    const repository = {} as unknown as SafeRepository<A>;
    const result = await repository.find?.({
      relations: {
        b: { a: true },
      },
    });
    expectTypeOf(result).toEqualTypeOf<
      {
        b: {
          a: {}; // eslint-disable-line @typescript-eslint/ban-types
        };
      }[]
    >();
  });

  it("findBy should omit relations", async () => {
    const repository = {} as unknown as SafeRepository<Entity>;
    const result = await repository.findBy?.();
    expectTypeOf(result).toEqualTypeOf<Pick<Entity, "a">[]>();
  });

  it("findAndCount should omit relations without option", async () => {
    const repository = {} as unknown as SafeRepository<Entity>;
    const result = await repository.findAndCount?.();
    expectTypeOf(result).toEqualTypeOf<[Pick<Entity, "a">[], number]>();
  });

  it("findAndCount should return only specified relations", async () => {
    const repository = {} as unknown as SafeRepository<Entity>;
    const result = await repository.findAndCount?.({
      relations: {
        b: { d: true },
        b2: true,
      },
    });
    expectTypeOf(result).toEqualTypeOf<
      [
        {
          a: number;
          b: {
            c: string;
            d: {
              e: number;
            };
          };
          b2: {
            c: string;
          };
        }[],
        number,
      ]
    >();
  });

  it("findAndCountBy should omit relations", async () => {
    const repository = {} as unknown as SafeRepository<Entity>;
    const result = await repository.findAndCountBy?.();
    expectTypeOf(result).toEqualTypeOf<[Pick<Entity, "a">[], number]>();
  });

  it("findByIds should omit relations", async () => {
    const repository = {} as unknown as SafeRepository<Entity>;
    const result = await repository.findByIds?.([0, 1]);
    expectTypeOf(result).toEqualTypeOf<Pick<Entity, "a">[]>();
  });

  it("findOne should omit relations without option", async () => {
    const repository = {} as unknown as SafeRepository<Entity>;
    const result = await repository.findOne?.();
    expectTypeOf(result).toEqualTypeOf<Pick<Entity, "a"> | null>();
  });

  it("findOne should return only specified relations", async () => {
    const repository = {} as unknown as SafeRepository<Entity>;
    const result = await repository.findOne?.({
      relations: {
        b: { d: true },
        b2: true,
      },
    });
    expectTypeOf(result).toEqualTypeOf<{
      a: number;
      b: {
        c: string;
        d: {
          e: number;
        };
      };
      b2: {
        c: string;
      };
    } | null>();
  });

  it("findOneBy should omit relations", async () => {
    const repository = {} as unknown as SafeRepository<Entity>;
    const result = await repository.findOneBy?.();
    expectTypeOf(result).toEqualTypeOf<Pick<Entity, "a"> | null>();
  });

  it("findOneById should omit relations", async () => {
    const repository = {} as unknown as SafeRepository<Entity>;
    const result = await repository.findOneById?.(1);
    expectTypeOf(result).toEqualTypeOf<Pick<Entity, "a"> | null>();
  });

  it("findOneOrFail should omit relations without option", async () => {
    const repository = {} as unknown as SafeRepository<Entity>;
    const result = await repository.findOneOrFail?.();
    expectTypeOf(result).toEqualTypeOf<Pick<Entity, "a">>();
  });

  it("findOneOrFail should return only specified relations", async () => {
    const repository = {} as unknown as SafeRepository<Entity>;
    const result = await repository.findOneOrFail?.({
      relations: {
        b: { d: true },
        b2: true,
      },
    });
    expectTypeOf(result).toEqualTypeOf<{
      a: number;
      b: {
        c: string;
        d: {
          e: number;
        };
      };
      b2: {
        c: string;
      };
    }>();
  });

  it("findOneByOrFail should omit relations", async () => {
    const repository = {} as unknown as SafeRepository<Entity>;
    const result = await repository.findOneByOrFail?.();
    expectTypeOf(result).toEqualTypeOf<Pick<Entity, "a">>();
  });

  it("extend should return repository which extends safe repository", async () => {
    const repository = {} as unknown as SafeRepository<Entity>;
    const customRepository = repository.extend?.({
      findByA(a: number) {
        return this.find?.({
          where: {
            a,
          },
          relations: { b: true },
        });
      },
    });

    // customRepository.find should work in same way as SafeRepository.find
    const findResultWithoutRelations = await customRepository?.find();
    expectTypeOf(findResultWithoutRelations).toEqualTypeOf<
      Pick<Entity, "a">[]
    >();
    const findResultWithRelations = await customRepository?.find({
      relations: {
        b: { d: true },
        b2: true,
      },
    });
    expectTypeOf(findResultWithRelations).toEqualTypeOf<
      {
        a: number;
        b: {
          c: string;
          d: {
            e: number;
          };
        };
        b2: {
          c: string;
        };
      }[]
    >();

    // customRepository.findByA should return desired relations
    const customResult = await customRepository?.findByA(1);
    expectTypeOf(customResult).toEqualTypeOf<
      {
        a: number;
        b: { c: string };
      }[]
    >();
  });
});
