"use client";

import { Suspense, useState } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "../ui/resizable";
import { MessagesContainer } from "../custom/messages-container";
import { fragments } from "@/db";
import { ProjectHeader } from "../custom/project-header";

type ProjectViewProps = {
  projectId: string;
};

export function ProjectView({ projectId }: ProjectViewProps) {
  const [activeFragment, setActiveFragment] = useState<
    typeof fragments.$inferSelect | null
  >(null);
  console.log(activeFragment);

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
        <ResizablePanel defaultSize={65} minSize={50} className="flex flex-col">
          <div className="flex-1 p-4 flex items-center justify-center text-muted-foreground">
            Fragment content will appear here
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
