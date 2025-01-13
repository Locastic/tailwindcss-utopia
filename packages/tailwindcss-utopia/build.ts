import type { BuildConfig } from "bun";
import dts from "bun-plugin-dts";
import transformImportsInCorePlugins from "./plugins/transform-imports-in-corePlugins";

const defaultBuildConfig: BuildConfig = {
  entrypoints: ["./src/index.ts"],
  outdir: "./dist",
};

await Promise.all([
  Bun.build({
    ...defaultBuildConfig,
    plugins: [dts(), transformImportsInCorePlugins()],
    format: "esm",
    target: "node",
    naming: "[dir]/[name].js",
    external: ["tailwindcss"],
  }),
  Bun.build({
    ...defaultBuildConfig,
    plugins: [transformImportsInCorePlugins()],
    format: "cjs",
    target: "node",
    naming: "[dir]/[name].cjs",
    external: ["tailwindcss"],
  }),
]);
