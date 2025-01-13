import type { BuildConfig } from "bun";
import dts from "bun-plugin-dts";

const defaultBuildConfig: BuildConfig = {
  entrypoints: ["./src/index.ts"],
  outdir: "./dist",
};

await Promise.all([
  Bun.build({
    ...defaultBuildConfig,
    plugins: [dts()],
    format: "esm",
    target: "browser",
    naming: "[dir]/[name].js",
    external: ["tailwindcss"],
    minify: true,
  }),
  Bun.build({
    ...defaultBuildConfig,
    format: "cjs",
    target: "node",
    naming: "[dir]/[name].cjs",
    external: ["tailwindcss"],
    minify: true,
  }),
]);
