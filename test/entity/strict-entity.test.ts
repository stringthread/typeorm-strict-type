import { describe, expectTypeOf, it } from "vitest";

import { Entity } from "@/entity";
import { StrictEntity } from "@/entity/StrictEntity";

describe("StrictEntity", () => {
  it("should be same as input if input has no relations", () => {
    class A extends Entity {
      a: number = 0;
      b: string = "";
      c: Date = new Date();
    }
    expectTypeOf<StrictEntity<A>>().toEqualTypeOf<{ [K in keyof A]: A[K] }>();
  });

  it("should remove relations: input relation depth == 1", () => {
    class A extends Entity {
      a: number = 0;
    }
    class B extends Entity {
      a: A = new A();
      n: number = 1;
    }
    expectTypeOf<StrictEntity<B>>().toEqualTypeOf<{ n: number }>();
  });

  it("should keep relations with path: input relation depth == 1", () => {
    class A extends Entity {
      a: number = 0;
    }
    class B extends Entity {
      a: A = new A();
      a2: A = new A();
      n: number = 1;
    }
    expectTypeOf<StrictEntity<B, ["a"]>>().toEqualTypeOf<{
      n: number;
      a: {
        a: number;
      };
    }>();
  });

  it("should keep relations with path: input relation depth > 1", () => {
    class A extends Entity {
      a: number = 0;
    }
    class B extends Entity {
      a: A = new A();
      n: number = 1;
    }
    class C extends Entity {
      b: B = new B();
      b2: B = new B();
      m: number = 2;
    }
    expectTypeOf<StrictEntity<C, ["b", "a"] | ["b2"]>>().toEqualTypeOf<{
      m: number;
      b: { a: { a: number }; n: number };
      b2: { n: number };
    }>();
  });
});
