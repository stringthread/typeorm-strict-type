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

  it("should return never if empty", () => {
    expectTypeOf<Path<object>>().toEqualTypeOf<[]>();
  });

  it("should return never if undefined", () => {
    expectTypeOf<Path<undefined>>().toEqualTypeOf<[]>();
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
});
