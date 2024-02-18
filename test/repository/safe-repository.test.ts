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
    expectTypeOf(result).toEqualTypeOf<Pick<Entity, "a">>();
  });

  it("find should return only specified relations", async () => {
    const repository = {} as unknown as SafeRepository<Entity>;
    const result = await repository.find?.({
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
});
