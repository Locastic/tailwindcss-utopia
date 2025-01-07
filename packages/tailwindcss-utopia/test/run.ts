import path from "path";
import postcss from "postcss";
import tailwind, { Config } from "tailwindcss";

import tailwindcssUtopia, { extract } from "../src";

export let css = String.raw;
export let html = String.raw;
export let javascript = String.raw;

export function run(
  content: string,
  input = "@tailwind utilities; @tailwind components;",
) {
  const config: Config = {
    content: { files: [{ raw: content }], extract },
    corePlugins: { preflight: false },
    plugins: [tailwindcssUtopia],
    experimental: { optimizeUniversalDefaults: true },
  };

  return postcss(tailwind(config)).process(input, {
    from: `${path.resolve(__filename)}?test=${crypto.randomUUID()}`,
  });
}
