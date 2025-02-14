"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

const Editor = dynamic(() => import("./_components/editor"), { ssr: false });

export default function Home() {
  const ref = useRef<{ handleFormat: () => Promise<void> }>(null);
  const [srcDoc, setSrcDoc] = useState("");
  const [activeTab, setActiveTab] = useState<"html" | "css" | "config">("html");

  return (
    <div className="flex flex-col h-screen">
      <h1>TailwindCSS Playground</h1>
      <main className="flex-1 overflow-hidden flex flex-col">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel className="h-full flex flex-col">
            <Tabs
              className="flex justify-between items-center"
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
              <div>
                <Button
                  variant="ghost"
                  onClick={() => ref.current?.handleFormat()}
                >
                  Format
                </Button>
              </div>
            </Tabs>
            <div className="flex-1">
              <Editor ref={ref} activeTab={activeTab} onChange={setSrcDoc} />
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
