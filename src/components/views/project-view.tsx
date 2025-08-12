import { Suspense } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "../ui/resizable";
import { MessagesContainer } from "../custom/messages-container";

type ProjectViewProps = {
  projectId: string;
};

export async function ProjectView({ projectId }: ProjectViewProps) {
  return (
    <div className="min-h-screen">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={35} minSize={20} className="h-screen">
          <Suspense fallback={<p>loading messages...</p>}>
            <MessagesContainer projectId={projectId} />
          </Suspense>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={65} minSize={50}>
          <div>todo:ProjectView</div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
