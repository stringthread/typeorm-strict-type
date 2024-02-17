import { describe, expectTypeOf, it } from "vitest";

import { StrictEntity } from "@/entity/StrictEntity";
import { Relation } from "@/entity/Relation";

describe("StrictEntity", () => {
  it("should be same as input if input has no relations", () => {
    class A {
      a: number = 0;
      b: string = "";
      c: Date = new Date();
    }
    expectTypeOf<StrictEntity<A>>().toEqualTypeOf<{ [K in keyof A]: A[K] }>();
  });

  it("should remove relations: input relation depth == 1", () => {
    class A {
      a: number = 0;
    }
    class B {
      constructor(
        public a: Relation<A>,
        public n: number
      ) {}
    }
    expectTypeOf<StrictEntity<B>>().toEqualTypeOf<{ n: number }>();
  });

  it("should keep relations with path: input relation depth == 1", () => {
    class A {
      a: number = 0;
    }
    class B {
      constructor(
        public a: Relation<A>,
        public a2: Relation<A>,
        public n: number
      ) {}
    }
    expectTypeOf<StrictEntity<B, ["a"]>>().toEqualTypeOf<{
      n: number;
      a: {
        a: number;
      };
    }>();
    expectTypeOf<StrictEntity<B, "a">>().toEqualTypeOf<{
      n: number;
      a: {
        a: number;
      };
    }>();
  });

  it("should remove relations with path: input relation depth > 1", () => {
    class A {
      a: number = 0;
    }
    class B {
      constructor(
        public a: Relation<A>,
        public n: number
      ) {}
    }
    class C {
      constructor(
        public b: Relation<B>,
        public b2: Relation<B>,
        public b3: Relation<B>,
        public m: number
      ) {}
    }
    expectTypeOf<StrictEntity<C>>().toEqualTypeOf<{
      m: number;
    }>();
  });

  it("should keep relations with path: input relation depth > 1", () => {
    class A {
      a: number = 0;
    }
    class B {
      constructor(
        public a: Relation<A>,
        public n: number
      ) {}
    }
    class C {
      constructor(
        public b: Relation<B>,
        public b2: Relation<B>,
        public b3: Relation<B>,
        public m: number
      ) {}
    }
    expectTypeOf<StrictEntity<C, ["b"] | ["b", "a"] | ["b2"]>>().toEqualTypeOf<{
      m: number;
      b: { a: { a: number }; n: number };
      b2: { n: number };
    }>();
    expectTypeOf<StrictEntity<C, "b.a" | "b2">>().toEqualTypeOf<{
      m: number;
      b: { a: { a: number }; n: number };
      b2: { n: number };
    }>();
  });
});
