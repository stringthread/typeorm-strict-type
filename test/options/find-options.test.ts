import { Relation } from "@/entity/Relation";
import { FindOptionsRelationsPath } from "@/options/FindOptions";
import { FindOneOptions } from "typeorm";
import { describe, expectTypeOf, it } from "vitest";

describe("FindOptionsRelationsPath", () => {
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

    type Relations = {
      b: {
        d: true;
      };
      b2: true;
    };

    expectTypeOf<Relations>().toMatchTypeOf<
      FindOneOptions<Entity>["relations"]
    >();

    expectTypeOf<FindOptionsRelationsPath<Entity, Relations>>().toEqualTypeOf<
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
    type Relations = {
      b: {
        d: true;
      };
      b2: true;
    };

    expectTypeOf<Relations>().toMatchTypeOf<FindOneOptions<A>["relations"]>();

    expectTypeOf<FindOptionsRelationsPath<A, Relations>>().toEqualTypeOf<
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

    type Relations = {
      b: {
        d: true;
      };
      b2: true;
    };

    expectTypeOf<Relations>().toMatchTypeOf<
      FindOneOptions<Entity>["relations"]
    >();

    expectTypeOf<FindOptionsRelationsPath<Entity, Relations>>().toEqualTypeOf<
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

    expectTypeOf<FindOptionsRelationsPath<Entity, undefined>>().toEqualTypeOf<
      []
    >();

    expectTypeOf<FindOptionsRelationsPath<Entity, never>>().toEqualTypeOf<[]>();
  });
});
