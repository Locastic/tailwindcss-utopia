"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Editor = dynamic(() => import("./_components/editor"), { ssr: false });

export default function Home() {
  const [srcDoc, setSrcDoc] = useState("");
  const [activeTab, setActiveTab] = useState<"html" | "css" | "config">("html");

  return (
    <div className="flex flex-col h-screen">
      <h1>TailwindCSS Playground</h1>
      <main className="flex-1 overflow-hidden flex flex-col">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel className="h-full flex flex-col">
            <Tabs
              value={activeTab}
              onValueChange={(t) =>
                setActiveTab(t as "html" | "css" | "config")
              }
            >
              <TabsList>
                <TabsTrigger value="html">HTML</TabsTrigger>
                <TabsTrigger value="css">CSS</TabsTrigger>
                <TabsTrigger value="config">Config</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex-1">
              <Editor activeTab={activeTab} onChange={setSrcDoc} />
            </div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel>
            <iframe className="w-full h-full" srcDoc={srcDoc} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>
    </div>
  );
}
