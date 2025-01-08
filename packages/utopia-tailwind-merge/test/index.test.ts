import { it, expect } from "bun:test";
import { extendTailwindMerge, twMerge } from "tailwind-merge";

import { withUtopia } from "../src";

it("validates utopia utilities correctly", () => {
  expect(twMerge("relative ~relative")).toBe("relative ~relative");
  expect(twMerge("m-[2px] ~m-[2]")).toBe("m-[2px] ~m-[2]");
  expect(twMerge("m-[2px] ~m-[2/_nonexistent]")).toBe(
    "m-[2px] ~m-[2/_nonexistent]",
  );

  const twMergeWithUtopia = extendTailwindMerge(withUtopia);
  expect(twMergeWithUtopia("m-[2px] ~m-[2]")).toBe("~m-[2]");
  expect(twMergeWithUtopia("m-[2px] ~m-[2/_nonexistent]")).toBe(
    "m-[2px] ~m-[2/_nonexistent]",
  );
});
