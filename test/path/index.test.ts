import { describe, expectTypeOf, it } from "vitest";

import { Path, StringToPath, Waypoints } from "@/path";

describe("Path", () => {
  it("should return keys if depth==1", () => {
    expectTypeOf<
      Path<{
        a: 1;
        b: "b";
      }>
    >().toEqualTypeOf<["a"] | ["b"]>();
  });

  it("should return keys if depth>1", () => {
    expectTypeOf<
      Path<{
        a: 1;
        b: {
          c: "c";
        };
      }>
    >().toEqualTypeOf<["a"] | ["b", "c"]>();
  });

  it("should return never if empty", () => {
    expectTypeOf<Path<object>>().toEqualTypeOf<never>();
  });

  it("should return never if undefined", () => {
    expectTypeOf<Path<undefined>>().toEqualTypeOf<never>();
  });
});

describe("Waypoints", () => {
  it("should return same as input when length == 1", () => {
    expectTypeOf<Waypoints<["a"] | ["b"]>>().toEqualTypeOf<["a"] | ["b"]>();
  });

  it("should return all waypoints if length>1", () => {
    expectTypeOf<Waypoints<["a"] | ["b", "c"]>>().toEqualTypeOf<
      ["a"] | ["b"] | ["b", "c"]
    >();
  });

  it("should return empty tuple if empty", () => {
    expectTypeOf<Waypoints<[]>>().toEqualTypeOf<[]>();
  });

  it("should work fine with Path", () => {
    expectTypeOf<
      Waypoints<
        Path<{
          a: 1;
          b: {
            c: "c";
          };
        }>
      >
    >().toEqualTypeOf<["a"] | ["b"] | ["b", "c"]>();
  });
});

describe("StringToPath", () => {
  it("should return same as input when input has no dots", () => {
    expectTypeOf<StringToPath<"a" | "b">>().toEqualTypeOf<["a"] | ["b"]>();
  });

  it("should return dot-separated paths", () => {
    expectTypeOf<StringToPath<"a.b">>().toEqualTypeOf<["a", "b"]>();
  });

  it("should return empty tuple when input is empty", () => {
    expectTypeOf<StringToPath<"">>().toEqualTypeOf<[]>();
  });
});
