import { BunPlugin } from "bun";

export default function () {
  return {
    name: "transform-imports-in-corePlugins",
    setup(build) {
      // Define the modules to stub out
      const nodeBuiltins = new Set(["fs", "url", "path", "util"]);

      // Add a resolver that intercepts imports
      build.onResolve({ filter: /.*/ }, (args) => {
        const { path: id, importer: parentId } = args;

        // Check if the import is from relevant files
        if (
          (parentId?.includes("/postcss/") ||
            parentId?.endsWith("/src/corePlugins.js") ||
            parentId?.includes("/postcss-selector-parser/") ||
            parentId?.includes("/util-deprecate/")) &&
          (nodeBuiltins.has(id) || id.includes("/util-deprecate/"))
        ) {
          return {
            path: "corePlugins:noop",
            namespace: "noop-module",
          };
        }
      });

      // Provide the content for stubbed modules
      build.onLoad({ filter: /.*/, namespace: "noop-module" }, () => {
        return {
          contents: "export default function() {}",
          loader: "js",
        };
      });
    },
  } satisfies BunPlugin;
}
