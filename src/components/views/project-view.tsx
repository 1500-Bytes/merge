"use client";

import { fragments } from "@/db";
import { CodeIcon, CrownIcon, EyeIcon } from "lucide-react";
import Link from "next/link";
import { Suspense, useState } from "react";
import { FileExplorer } from "../custom/file-explorer";
import { FragmentPreview } from "../custom/fragment-preview";
import { MessagesContainer } from "../custom/messages-container";
import { ProjectHeader } from "../custom/project-header";
import { Button } from "../ui/button";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "../ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

type ProjectViewProps = {
  projectId: string;
};

export function ProjectView({ projectId }: ProjectViewProps) {
  const [activeFragment, setActiveFragment] = useState<
    typeof fragments.$inferSelect | null
  >(null);
  const [activeTab, setActiveTab] = useState<"code" | "preview">("preview");

  return (
    <div className="h-screen flex flex-col">
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        <ResizablePanel defaultSize={35} minSize={20} className="flex flex-col">
          <Suspense fallback={<p>loading header...</p>}>
            <ProjectHeader projectId={projectId} />
          </Suspense>
          <div className="flex-1 min-h-0">
            <Suspense fallback={<p>loading messages...</p>}>
              <MessagesContainer
                projectId={projectId}
                activeFragment={activeFragment}
                setActiveFragment={setActiveFragment}
              />
            </Suspense>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={65} minSize={50}>
          <Tabs
            className="h-full gap-y-0"
            defaultValue="preview"
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as "preview" | "code")}
          >
            <div className="w-full flex items-center px-2 py-2.5 border-b">
              <TabsList className="rounded-sm border py-3">
                <TabsTrigger
                  value="preview"
                  className="flex gap-x-1.5 py-3 items-center rounded-sm"
                >
                  <EyeIcon />
                  <span>Preview</span>
                </TabsTrigger>
                <TabsTrigger
                  className="flex gap-x-1.5 items-center py-3 rounded-sm"
                  value="code"
                >
                  <CodeIcon />
                  <span>Code</span>
                </TabsTrigger>
              </TabsList>
              <div className="ml-auto">
                <Button asChild size="sm">
                  <Link href={`/pricing`}>
                    <CrownIcon />
                    <span>Upgrade</span>
                  </Link>
                </Button>
              </div>
            </div>
            <TabsContent value="code" className="min-h-0 h-full">
              <FileExplorer files={activeFragment?.files as { [path: string]: string }} />
            </TabsContent>
            <TabsContent value="preview" className="h-full">
              {!activeFragment && (
                <div className="flex items-center justify-center h-full">
                  <p className=" text-muted-foreground ">No fragment selected</p>
                </div>
              )}
              {activeFragment && <FragmentPreview activeFragment={activeFragment} />}
            </TabsContent>
          </Tabs>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
