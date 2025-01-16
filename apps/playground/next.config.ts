import type { NextConfig } from "next";
import MonacoEditorWebpackPlugin from "monaco-editor-webpack-plugin";
import path from "path";

const nextConfig: NextConfig = {
  transpilePackages: ["monaco-editor"],
  webpack(config, options) {
    if (!options.isServer) {
      config.plugins.push(
        new MonacoEditorWebpackPlugin({
          languages: ["html", "css", "typescript"],
          filename: "static/[name].worker.js",
          customLanguages: [
            {
              label: "tailwindcss",
              entry: undefined,
              worker: {
                id: "tailwindcssCustomWorker",
                entry: path.resolve(__dirname, "./workers/tailwindcss-custom.js"),
              },
            },
          ],
          globalAPI: true
        }),
      );
    }

    return config;
  },
};

export default nextConfig;
