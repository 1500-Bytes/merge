import { Fragment, useCallback, useMemo, useState } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "../ui/resizable";
import { Button } from "../ui/button";
import { CopyCheckIcon, CopyIcon } from "lucide-react";
import { CodePreview } from "./code-preview";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from "../ui/breadcrumb";
import { TreeView } from "./tree-view";
import { convertFilesToTreeItems } from "@/lib/utils";
import { TooltipWrapper } from "./tooltip-wrapper";

type FileCollection = { [path: string]: string };

const getLangFromExtension = (filename: string) => {
  const extension = filename.split(".").pop()?.toLowerCase();
  return extension || "text";
};

type FileBreadcrumbsProps = {
  filePath: string;
};

function FileBreadcrumb({ filePath }: FileBreadcrumbsProps) {
  const fileSegments = filePath.split("/");
  const maxSegments = 4;

  const renderBreadcrumbs = () => {
    if (fileSegments.length <= maxSegments) {
      return fileSegments.map((segment, index) => {
        const isLastSegment = index === fileSegments.length - 1;
        return (
          <Fragment key={index}>
            <BreadcrumbItem>
              {isLastSegment ? (
                <BreadcrumbPage className="font-medium">{segment}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink className="text-muted-foreground cursor-default">
                  {segment}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {!isLastSegment && <BreadcrumbSeparator />}
          </Fragment>
        );
      });
    } else {
      const firstSegment = fileSegments[0];
      const lastSegment = fileSegments[fileSegments.length - 1];

      return (
        <>
          <BreadcrumbItem>
            <BreadcrumbLink className="text-muted-foreground cursor-default">
              {firstSegment}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbEllipsis />
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="font-medium">{lastSegment}</BreadcrumbPage>
          </BreadcrumbItem>
        </>
      );
    }
  };

  return (
    <Breadcrumb>
      <BreadcrumbList>{renderBreadcrumbs()}</BreadcrumbList>
    </Breadcrumb>
  );
}

type FileExplorerProps = {
  files: FileCollection;
};

export function FileExplorer({ files }: FileExplorerProps) {
  const [copied, setCopied] = useState(false);
  const fileKeys = Object.keys(files);
  const [selectedFile, setSelectedFile] = useState<string | null>(() => {
    return fileKeys.length > 0 ? fileKeys[0] : null;
  });

  const treeData = useMemo(() => {
    return convertFilesToTreeItems(files);
  }, [files]);

  const handleFileSelect = useCallback(
    (filePath: string) => {
      if (files[filePath]) {
        setSelectedFile(filePath);
      }
    },
    [files],
  );

  const handleCopy = useCallback(() => {
    if (selectedFile) {
      window.navigator.clipboard.writeText(files[selectedFile]);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 1000);
    }
  }, [selectedFile, files]);

  return (
    <ResizablePanelGroup direction="horizontal" className="">
      <ResizablePanel minSize={20} defaultSize={20} className="bg-sidebar">
        <TreeView data={treeData} onSelect={handleFileSelect} value={selectedFile} />
      </ResizablePanel>
      <ResizableHandle className="hover:bg-primary transition-colors" />
      <ResizablePanel minSize={70} defaultSize={80}>
        {selectedFile && files[selectedFile] ? (
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between border-b px-4 py-2 bg-sidebar">
              <FileBreadcrumb filePath={selectedFile} />
              <TooltipWrapper title="Copy to clipboard">
                <Button
                  size={"sm"}
                  variant={"outline"}
                  disabled={copied}
                  onClick={handleCopy}
                >
                  {copied ? <CopyCheckIcon /> : <CopyIcon />}
                </Button>
              </TooltipWrapper>
            </div>
            <div className="flex-1 min-h-0">
              <ScrollArea className="h-full w-full">
                <div className="min-w-max">
                  <CodePreview
                    lang={getLangFromExtension(selectedFile)}
                    code={files[selectedFile]}
                  />
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <h2 className="text-center text-2xl">No file selected</h2>
            <p className="text-center text-muted-foreground">
              Please select a file from the tree view.
            </p>
          </div>
        )}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
