import { Relation } from "@/entity/Relation";
import { FindOptionsPath } from "@/options/FindOptions";
import { FindOneOptions } from "typeorm";
import { describe, expectTypeOf, it } from "vitest";

describe("FindOptionsPath", () => {
  it("should return proper path for FindOneOptions", () => {
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

    type Options = {
      relations: {
        b: {
          d: true;
        };
        b2: true;
      };
    };

    expectTypeOf<Options>().toMatchTypeOf<FindOneOptions<Entity>>();

    expectTypeOf<FindOptionsPath<Entity, Options>>().toEqualTypeOf<
      [] | ["b"] | ["b", "d"] | ["b2"]
    >();
  });

  it("should return proper path with class", () => {
    class D {
      constructor(public e: number) {}
    }
    class B {
      constructor(
        public c: string,
        public d: Relation<D>
      ) {}
    }
    class A {
      constructor(
        public a: number,
        public b: Relation<B>,
        public b2: Relation<B>,
        public b3: Relation<B>
      ) {}
    }
    type Options = {
      relations: {
        b: {
          d: true;
        };
        b2: true;
      };
    };

    expectTypeOf<Options>().toMatchTypeOf<FindOneOptions<A>>();

    expectTypeOf<FindOptionsPath<A, Options>>().toEqualTypeOf<
      [] | ["b"] | ["b", "d"] | ["b2"]
    >();
  });

  it("should ignore properties without Relation", () => {
    type Entity = {
      a: number;
      b: Relation<{
        c: string;
        d: Relation<{
          e: number;
        }>;
      }>;
      b2: {
        c: string;
        d: Relation<{
          e: number;
        }>;
      };
      b3: {
        c: string;
        d: {
          e: number;
        };
      };
    };

    type Options = {
      relations: {
        b: {
          d: true;
        };
        b2: true;
      };
    };

    expectTypeOf<Options>().toMatchTypeOf<FindOneOptions<Entity>>();

    expectTypeOf<FindOptionsPath<Entity, Options>>().toEqualTypeOf<
      [] | ["b"] | ["b", "d"] | ["b2"]
    >();
  });

  it("should return empty path without relations option", () => {
    type Entity = {
      a: number;
      b: Relation<{
        c: string;
        d: Relation<{
          e: number;
        }>;
      }>;
    };

    type Options = Record<string, never>;

    expectTypeOf<Options>().toMatchTypeOf<FindOneOptions<Entity>>();

    expectTypeOf<FindOptionsPath<Entity, Options>>().toEqualTypeOf<[]>();
  });
});
