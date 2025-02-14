"use client";

import { Ref, useEffect, useImperativeHandle, useRef, useState } from "react";
import * as monaco from "monaco-editor";
import { Editor as MonacoEditor, loader } from "@monaco-editor/react";
import {
  configureMonacoTailwindcss,
  MonacoTailwindcss,
  TailwindConfig,
  tailwindcssData,
} from "monaco-tailwindcss";
import { generateSrcDoc } from "@/lib/utils";
import { defaultConfig, defaultCss, defaultHtml } from "@/lib/content";

type Refs = Parameters<
  NonNullable<React.ComponentProps<typeof MonacoEditor>["onMount"]>
>;
type EditorRef = Refs[0];
type MonacoEditorRef = Refs[1];

loader.config({ monaco });

function importAll(rc: __WebpackModuleApi.RequireContext) {
  return rc.keys().map((path) => ({ path, mod: rc(path).default as string }));
}

const tailwindRoot = require.context(
  "!!raw-loader!tailwindcss/",
  false,
  /\.d\.ts$/,
);
const tailwindTypes = require.context(
  "!!raw-loader!tailwindcss/types/",
  true,
  /\.d\.ts$/,
);

const types = {
  "index.d.ts": 'export * from "./types/config"',
  ...Object.fromEntries(
    importAll(tailwindRoot).map(({ path, mod }) => [
      path.replace("./", ""),
      mod,
    ]),
  ),
  ...Object.fromEntries(
    importAll(tailwindTypes).map(({ path, mod }) => [
      path.replace("./", "types/"),
      mod.replace(
        /interface RequiredConfig \{.*?\}/s,
        "interface RequiredConfig {}",
      ),
    ]),
  ),
};

export default function Editor({
  ref,
  activeTab,
  onChange,
}: {
  ref: Ref<{ handleFormat: () => Promise<void> }>;
  activeTab: "html" | "css" | "config";
  onChange: (content: string) => void;
}) {
  const editorRef = useRef<EditorRef | null>(null);
  const monacoEditorRef = useRef<MonacoEditorRef | null>(null);

  const [tabs] = useState(() => ({
    html: monaco.editor.createModel(defaultHtml, "html"),
    css: monaco.editor.createModel(defaultCss, "css"),
    config: monaco.editor.createModel(defaultConfig, "typescript"),
  }));

  const monacoTailwindcssRef = useRef<MonacoTailwindcss>(null);

  const handleChange = async () => {
    if (!monacoTailwindcssRef.current) return;

    const css = await monacoTailwindcssRef.current.generateStylesFromContent(
      tabs.css.getValue(),
      [{ content: tabs.html.getValue() }],
    );
    const html = tabs.html.getValue();

    const content = generateSrcDoc(html, css);

    onChange(content);
  };

  useEffect(() => {
    const onResize = () => {
      if (!editorRef.current) return;

      editorRef.current.layout();
    };

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => {
    Object.entries(tabs).map(([name, tab]) => {
      if (name === "html") {
        tab.updateOptions({ tabSize: 2 });
      }

      tab.onDidChangeContent(() => {
        if (name === "config") {
          const code = tab.getValue();

          const blob = new Blob([code], { type: "application/javascript" });
          const url = URL.createObjectURL(blob);

          import(/* webpackIgnore: true */ url)
            .then((module) => {
              const evaluatedCode: TailwindConfig = module.default;

              monacoTailwindcssRef.current?.setTailwindConfig(evaluatedCode);

              handleChange();
            })
            .catch((error) => {
              console.error("Error evaluating code:", error.message);
            });
        } else {
          handleChange();
        }
      });
    });
  }, []);

  useEffect(() => {
    if (!editorRef.current) return;

    editorRef.current.setModel(tabs[activeTab]);
  }, [editorRef, tabs, activeTab]);

  useImperativeHandle(ref, () => {
    return {
      handleFormat: async () => {
        if (!editorRef.current) return;

        console.log("Formatting..");

        await editorRef.current
          ?.getAction("editor.action.formatDocument")
          ?.run();
      },
    };
  });

  return (
    <MonacoEditor
      options={{ minimap: { enabled: false } }}
      beforeMount={() => {
        monaco.languages.css.cssDefaults.setOptions({
          data: {
            dataProviders: {
              tailwindcssData,
            },
          },
        });

        monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
          noSemanticValidation: false,
          noSyntaxValidation: false,
          noSuggestionDiagnostics: false,
        });

        monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
          allowJs: true,
          allowNonTsExtensions: true,
          module: monaco.languages.typescript.ModuleKind.CommonJS,
          target: monaco.languages.typescript.ScriptTarget.Latest,
          checkJs: true,
          moduleResolution:
            monaco.languages.typescript.ModuleResolutionKind.NodeJs,
          typeRoots: ["node_modules/@types"],
          esModuleInterop: true,
          allowSyntheticDefaultImports: true,
        });

        Object.entries(types).forEach(([file, content]) => {
          monaco.languages.typescript.typescriptDefaults.addExtraLib(
            content,
            `node_modules/@types/tailwindcss/${file}`,
          );
        });

        monacoTailwindcssRef.current = configureMonacoTailwindcss(monaco);
      }}
      onMount={(editor, monaco) => {
        editorRef.current = editor;
        monacoEditorRef.current = monaco;

        editor.setModel(tabs[activeTab]);

        handleChange();
      }}
    />
  );
}
