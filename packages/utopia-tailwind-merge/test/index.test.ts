import { it, expect, describe } from "bun:test";
import { extendTailwindMerge, twMerge } from "tailwind-merge";

import { withUtopia } from "../src";

describe("validates utopia utilities correctly:", () => {
  it("default doesn't merge non existing utilities", () => {
    expect(twMerge("p-[2px] p-aa")).toBe("p-[2px] p-aa");
    expect(twMerge("p-[2px] -p-bb")).toBe("p-[2px] -p-bb");
  });

  it("ignore utopia utilities if the plugin is not used", () => {
    expect(twMerge("relative ~relative")).toBe("relative ~relative");
    expect(twMerge("m-[2px] ~m-[2]")).toBe("m-[2px] ~m-[2]");
    expect(twMerge("m-[2px] ~m-[2/_nonexistent]")).toBe(
      "m-[2px] ~m-[2/_nonexistent]",
    );
  });

  it("merge utopia utilities if plugin is used", () => {
    const twMergeWithUtopia = extendTailwindMerge(withUtopia);

    expect(twMergeWithUtopia("text-xs ~text-1")).toBe("~text-1");
    expect(twMergeWithUtopia("text-xs ~text-2")).toBe("text-xs ~text-2");
    expect(twMergeWithUtopia("text-xs ~-text-x2")).toBe("text-xs ~-text-x2");
    expect(twMergeWithUtopia("text-xs ~text-x1")).toBe("~text-x1");
    expect(twMergeWithUtopia("text-xs ~text-x0")).toBe("text-xs ~text-x0");

    expect(twMergeWithUtopia("text-xs ~text-[x0]")).toBe("~text-[x0]");
    expect(twMergeWithUtopia("text-xs ~text-[x-0]")).toBe("~text-[x-0]");
    expect(twMergeWithUtopia("text-xs ~text-[x2]")).toBe("~text-[x2]");
    expect(twMergeWithUtopia("text-xs ~text-[x-4]")).toBe("~text-[x-4]");

    expect(twMergeWithUtopia("text-xs ~text-[1]")).toBe("~text-[1]");
    expect(twMergeWithUtopia("text-xs ~text-[1/]")).toBe("~text-[1/]");
    expect(twMergeWithUtopia("text-xs ~text-[/1]")).toBe("~text-[/1]");
    expect(twMergeWithUtopia("text-xs ~text-[1/2]")).toBe("~text-[1/2]");
    expect(twMergeWithUtopia("text-xs ~text-[1/_nonexistent]")).toBe("text-xs ~text-[1/_nonexistent]");


    expect(twMergeWithUtopia("m-[2px] ~m-s")).toBe("~m-s");
    expect(twMergeWithUtopia("m-[2px] ~m-[2]")).toBe("~m-[2]");
    expect(twMergeWithUtopia("m-[2px] ~m-[2/4]")).toBe("~m-[2/4]");
    expect(twMergeWithUtopia("m-[2px] ~m-[2/_nonexistent]")).toBe(
      "m-[2px] ~m-[2/_nonexistent]",
    );
  });
});

describe("validates utopia utilities incorrectly", () => {
  it("default merges non-existing negative variants for non-negative utilities", () => {
    expect(twMerge("p-[2px] -p-2")).not.toBe("p-[2px] -p-2");
  });

  it("default merges negative arbitrary values for non-negative utilities!", () => {
    expect(twMerge("p-[2px] -p-[3px]")).not.toBe("p-[2px] -p-[3px]");
  });

  it("with utopia it merges negative arbitrary values for non-negative utilities!", () => {
    const twMergeWithUtopia = extendTailwindMerge(withUtopia);

    expect(twMergeWithUtopia("p-[2px] ~-p-s")).not.toBe("p-[2px] ~-p-s");
  });
});
