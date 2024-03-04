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

  it("should pick relations with Array", () => {
    class A {
      a: number = 0;
    }
    class B {
      constructor(
        public a: Relation<A>,
        public a2: Relation<A>[],
        public n: number
      ) {}
    }
    class C {
      constructor(
        public b: Relation<B>,
        public b2: Relation<B[]>,
        public m: number
      ) {}
    }
    expectTypeOf<
      StrictEntity<
        C,
        [] | ["b"] | ["b", "a2"] | ["b2"] | ["b2", "a"] | ["b2", "a2"]
      >
    >().toEqualTypeOf<{
      m: number;
      b: { a2: { a: number }[]; n: number };
      b2: { a: { a: number }; a2: { a: number }[]; n: number }[];
    }>();
    expectTypeOf<StrictEntity<C, "b.a2" | "b2.a" | "b2.a2">>().toEqualTypeOf<{
      m: number;
      b: { a2: { a: number }[]; n: number };
      b2: { a: { a: number }; a2: { a: number }[]; n: number }[];
    }>();
  });

  it("should pick relations with Promise", () => {
    class A {
      a: number = 0;
    }
    class B {
      constructor(
        public a: Relation<A>,
        public a2: Promise<Relation<A>>,
        public n: number
      ) {}
    }
    class C {
      constructor(
        public b: Relation<B>,
        public b2: Relation<Promise<B>>,
        public m: number
      ) {}
    }
    expectTypeOf<
      StrictEntity<C, [] | ["b"] | ["b", "a2"] | ["b2"] | ["b2", "a2"]>
    >().toEqualTypeOf<{
      m: number;
      b: { a2: Promise<{ a: number }>; n: number };
      b2: Promise<{ a2: Promise<{ a: number }>; n: number }>;
    }>();
    expectTypeOf<StrictEntity<C, "b.a2" | "b2.a2">>().toEqualTypeOf<{
      m: number;
      b: { a2: Promise<{ a: number }>; n: number };
      b2: Promise<{ a2: Promise<{ a: number }>; n: number }>;
    }>();
  });

  it("should accept self-referenced mapped types", () => {
    class A {
      constructor(public b: Relation<B>) {}
    }
    class B {
      constructor(public a: Relation<A>) {}
    }
    expectTypeOf<StrictEntity<A, "b">>().toEqualTypeOf<{
      b: {}; // eslint-disable-line @typescript-eslint/ban-types
    }>();
  });
});
