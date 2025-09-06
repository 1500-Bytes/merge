import { FileWarning, Loader2Icon, MessageSquareWarningIcon } from "lucide-react";

export function GeneratingContent() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="flex flex-col items-center space-y-2">
        <Loader2Icon className=" animate-spin" />
        <p className="text-muted-foreground text-base">Generating content...</p>
      </div>
    </div>
  );
}

export function GenerationError() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="flex flex-col items-center space-y-2">
        <FileWarning className="text-red-500 size-10" />
        <p className="text-base text-red-500 ">Error</p>
      </div>
    </div>
  );
}

export function GenerationMessageAssistant() {
  return (
    <div className="flex justify-start gap-x-2 pb-20 pt-6">
      <MessageSquareWarningIcon className="text-red-500" />
      <p className="text-red-500 ">Something went wrong</p>
    </div>
  );
}
