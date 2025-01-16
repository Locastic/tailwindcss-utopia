import tailwindcssUtopia, { extract } from "tailwindcss-utopia-fixed";

import { initialize } from "monaco-tailwindcss/tailwindcss.worker.js";

initialize({
  prepareTailwindConfig(tailwindConfig) {
    if (tailwindConfig?.plugins) {
      console.error(
        "Only preconfigured built in plugins are supported",
        tailwindConfig.plugins,
      );
    }

    const plugins = [tailwindcssUtopia];

    tailwindConfig = { ...tailwindConfig, plugins, content: { extract } };

    return tailwindConfig;
  },
});
