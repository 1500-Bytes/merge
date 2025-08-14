import { useState } from "react";
import { Button } from "../ui/button";
import { fragments } from "@/db";
import { ExternalLink, RefreshCcwIcon } from "lucide-react";
import { TooltipWrapper } from "./tooltip-wrapper";

export const FragmentPreview = ({
  activeFragment,
}: {
  activeFragment: typeof fragments.$inferSelect;
}) => {
  const [fragmentKey, setFragmentKey] = useState(0);
  const [copied, setCopied] = useState(false);

  function handleRefresh() {
    setFragmentKey((prev) => prev + 1);
  }

  function handleCopy() {
    navigator.clipboard.writeText(activeFragment.sandboxUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  }

  return (
    <div className="size-full flex flex-col">
      <div className="flex items-center border-b bg-sidebar p-2 gap-x-2 flex-1 justify-start">
        <TooltipWrapper title="Refresh page" align="center" side="bottom">
          <Button size={"sm"} variant={"outline"} onClick={handleRefresh}>
            <RefreshCcwIcon />
          </Button>
        </TooltipWrapper>
        <TooltipWrapper title="Click to copy URL" align="center" side="bottom">
          <Button
            size={"sm"}
            className="flex-1 justify-start text-start font-normal text-base"
            disabled={!activeFragment.sandboxUrl || copied}
            variant={"outline"}
            onClick={handleCopy}
          >
            <span className="truncate">{activeFragment.sandboxUrl}</span>
          </Button>
        </TooltipWrapper>
        <TooltipWrapper title="Open in new tab" align="center" side="bottom">
          <Button
            size={"sm"}
            disabled={!activeFragment.sandboxUrl}
            variant={"outline"}
            onClick={() => {
              if (!activeFragment.sandboxUrl) return;
              window.open(activeFragment.sandboxUrl, "_blank");
            }}
          >
            <ExternalLink />
          </Button>
        </TooltipWrapper>
      </div>
      <iframe
        key={fragmentKey}
        className="size-full"
        sandbox="allow-forms allow-scripts allow-same-origin"
        src={activeFragment.sandboxUrl}
      />
    </div>
  );
};
