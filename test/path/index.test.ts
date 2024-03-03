import { describe, expectTypeOf, it } from "vitest";

import { Path, PathString, StringToPath } from "@/path";

describe("Path", () => {
  it("should return keys if depth==1", () => {
    expectTypeOf<
      Path<{
        a: 1;
        b: "b";
      }>
    >().toEqualTypeOf<[] | ["a"] | ["b"]>();
  });

  it("should return keys if depth>1", () => {
    expectTypeOf<
      Path<{
        a: 1;
        b: {
          c: "c";
        };
      }>
    >().toEqualTypeOf<[] | ["a"] | ["b"] | ["b", "c"]>();
  });

  it("should return keys in promise", () => {
    expectTypeOf<
      Path<{
        a: 1;
        b: Promise<{
          c: "c";
        }>;
      }>
    >().toEqualTypeOf<[] | ["a"] | ["b"] | ["b", "c"]>();
  });

  it("should return keys in array", () => {
    expectTypeOf<
      Path<{
        a: 1;
        b: {
          c: "c";
        }[];
      }>
    >().toEqualTypeOf<[] | ["a"] | ["b"] | ["b", "c"]>();
  });

  it("should work with class", () => {
    class B {
      constructor(public c: "c") {}
    }
    class A {
      constructor(
        public a: 1,
        public b: B
      ) {}
    }
    expectTypeOf<Path<A>>().toEqualTypeOf<[] | ["a"] | ["b"] | ["b", "c"]>();
  });

  it("should return never if empty", () => {
    expectTypeOf<Path<object>>().toEqualTypeOf<[]>();
  });

  it("should return never if undefined", () => {
    expectTypeOf<Path<undefined>>().toEqualTypeOf<[]>();
  });

  it("should ignore non-string object keys", () => {
    const _symbol = Symbol();

    expectTypeOf<
      Path<{
        a: 1;
        b: "b";
        1: "number";
        [_symbol]: "symbol";
      }>
    >().toEqualTypeOf<[] | ["a"] | ["b"]>();
  });

  it("should accept self-referenced mapped types", () => {
    type A = {
      b: B;
    };
    type B = {
      a: A;
    };
    // should accept at least depth of 6
    expectTypeOf<
      | []
      | ["b"]
      | ["b", "a"]
      | ["b", "a", "b"]
      | ["b", "a", "b", "a"]
      | ["b", "a", "b", "a", "b"]
      | ["b", "a", "b", "a", "b", "a"]
    >().toMatchTypeOf<Path<A>>();
    // should not accept invalid array
    expectTypeOf<Path<A>>().not.toMatchTypeOf<["b", "a", "a"]>();
  });
});

describe("PathString", () => {
  it("should return keys if depth == 1", () => {
    expectTypeOf<
      PathString<{
        a: number;
        b: string;
      }>
    >().toEqualTypeOf<"" | "a" | "b">();
  });

  it("should return dot separated keys if depth > 1", () => {
    expectTypeOf<
      PathString<{
        a: {
          b: number;
          c: { d: string };
        };
        e: number;
      }>
    >().toEqualTypeOf<"" | "a" | "a.b" | "a.c" | "a.c.d" | "e">();
  });

  it("should accept self-referenced mapped types", () => {
    type A = {
      b: B;
    };
    type B = {
      a: A;
    };
    // should accept at least depth of 6
    expectTypeOf<
      "" | "b" | "b.a" | "b.a.b" | "b.a.b.a" | "b.a.b.a.b" | "b.a.b.a.b.a"
    >().toMatchTypeOf<PathString<A>>();
    // should not accept invalid array
    expectTypeOf<PathString<A>>().not.toMatchTypeOf<"b.a.a">();
  });
});

describe("StringToPath", () => {
  it("should return same as input when input has no dots", () => {
    type t = {
      a: number;
      b: string;
      c: string;
    };
    expectTypeOf<StringToPath<t, "a" | "b">>().toEqualTypeOf<
      [] | ["a"] | ["b"]
    >();
  });

  it("should return dot-separated paths", () => {
    type t = {
      a: {
        b: number;
        c: { d: string };
      };
      e: number;
    };
    expectTypeOf<StringToPath<t, "a.b" | "a.c.d">>().toEqualTypeOf<
      [] | ["a"] | ["a", "b"] | ["a", "c"] | ["a", "c", "d"]
    >();
  });

  it("should return empty tuple when input is empty", () => {
    type t = {
      a: { b: number };
      c: string;
    };
    expectTypeOf<StringToPath<t, "">>().toEqualTypeOf<[]>();
  });

  it("should accept self-referenced mapped types", () => {
    type A = {
      b: B;
    };
    type B = {
      a: A;
    };
    expectTypeOf<StringToPath<A, "b.a">>().toEqualTypeOf<
      [] | ["b"] | ["b", "a"]
    >();
  });
});
