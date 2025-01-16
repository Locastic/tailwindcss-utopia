"use client";

/*
const mockModule = { hello: 'world' };
const require = (moduleName) => {
  if (moduleName === 'mock-module') return mockModule;
  throw new Error(`Module '${moduleName}' not found`);
};

const someVariable = 42;

import tailwindcssUtopia from "https://esm.sh/tailwindcss-utopia@0.0.3";

@type {import('tailwindcss').Config}

export default {
  tailwindcssUtopia,
  someVariable,
  mockModule: require('mock-module'),
};

*/

import { useEffect, useRef, useState } from "react";
import * as monaco from "monaco-editor";
import { Editor as MonacoEditor, loader } from "@monaco-editor/react";
import {
  configureMonacoTailwindcss,
  MonacoTailwindcss,
  TailwindConfig,
  tailwindcssData,
} from "monaco-tailwindcss";
import { css, generateSrcDoc, html, js } from "@/lib/utils";

type Refs = Parameters<
  NonNullable<React.ComponentProps<typeof MonacoEditor>["onMount"]>
>;
type EditorRef = Refs[0];
type MonacoEditorRef = Refs[1];

loader.config({ monaco });

export default function Editor({
  activeTab,
  onChange,
}: {
  activeTab: "html" | "css" | "config";
  onChange: (content: string) => void;
}) {
  const editorRef = useRef<EditorRef | null>(null);
  const monacoEditorRef = useRef<MonacoEditorRef | null>(null);

  const [tabs] = useState(() => ({
    html: monaco.editor.createModel(
      html`<h1>Heading H1</h1>
<h2>Heading H2</h2>
<h3>Heading H3</h3>
<h4>Heading H4</h4>
<h5>Heading H5</h5>
<h6>Heading H6</h6>
`,
      "html",
    ),
    css: monaco.editor.createModel(
      css`@tailwind base;
@tailwind components;
@tailwind utilities;

h1,
h2,
h3,
h4,
h5,
h6 {
  @apply font-bold;
}

h1 {
  @apply ~text-x5;
}

h2 {
  @apply ~text-x4;
}

h3 {
  @apply ~text-x3;
}

h4 {
  @apply ~text-x2;
}

h5 {
  @apply ~text-x1;
}

body {
  @apply ~text-1;
}
`,
      "css",
    ),
    config: monaco.editor.createModel(js`export default {
  theme: {},
  plugins: [], /* plugins should be empty */
};
`, "typescript"),
  }));

  const monacoTailwindcssRef = useRef<MonacoTailwindcss>(null);

  const handleChange = async () => {
    console.log('a');
    if (!monacoTailwindcssRef.current) return;
    console.log('b');

    const css = await monacoTailwindcssRef.current.generateStylesFromContent(
      tabs.css.getValue(),
      [{ content: tabs.html.getValue() }],
    );
    const html = tabs.html.getValue();
    // const config = tabs.config.getValue();

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
    tabs["config"].onDidChangeContent(() => {
      const code = tabs["config"].getValue();

      let evaluatedCode;

      const blob = new Blob([code], { type: "application/javascript" });
      const url = URL.createObjectURL(blob);

      import(/* webpackIgnore: true */ url)
        .then((module) => {
          evaluatedCode = module.default;

          monacoTailwindcssRef.current?.setTailwindConfig(
            evaluatedCode as TailwindConfig,
          );
        })
        .catch((error) => {
          console.error("Error evaluating code:", error.message);
          evaluatedCode = null;
        });
    });

    Object.values(tabs).map((tab) => {
      tab.onDidChangeContent(handleChange);
    });
  }, []);

  useEffect(() => {
    if (!editorRef.current) return;

    editorRef.current.setModel(tabs[activeTab]);
  }, [editorRef, tabs, activeTab]);

  return (
    <MonacoEditor
      beforeMount={() => {
        monaco.languages.css.cssDefaults.setOptions({
          data: {
            dataProviders: {
              tailwindcssData,
            },
          },
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
