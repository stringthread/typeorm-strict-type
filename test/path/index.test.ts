import { describe, expectTypeOf, it } from "vitest";

import { Path, StringToPath } from "@/path";

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

describe("StringToPath", () => {
  it("should return same as input when input has no dots", () => {
    expectTypeOf<StringToPath<"a" | "b">>().toEqualTypeOf<[] | ["a"] | ["b"]>();
  });

  it("should return dot-separated paths", () => {
    expectTypeOf<StringToPath<"a.b">>().toEqualTypeOf<
      [] | ["a"] | ["a", "b"]
    >();
  });

  it("should return empty tuple when input is empty", () => {
    expectTypeOf<StringToPath<"">>().toEqualTypeOf<[]>();
  });
});
