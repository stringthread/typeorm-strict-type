import { describe, expectTypeOf, it } from "vitest";

import { Path } from "@/path";

describe("Path", () => {
  it("should return keys if depth==1", () => {
    expectTypeOf<
      Path<{
        a: 1;
        b: "b";
      }>
    >().toEqualTypeOf<["a"] | ["b"]>();
  });
});
