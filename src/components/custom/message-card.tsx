import { fragments } from "@/db";
import { messageRoleEnum, messageTypeEnum } from "@/db/schemas/message-schema";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ChevronRightIcon, Code2Icon } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

type MessageCardProps = {
  content: string;
  role: (typeof messageRoleEnum.enumValues)[number];
  createdAt: Date;
  fragment: typeof fragments.$inferSelect | null;
  isActiveFragment: boolean;
  onFragmentClick: (fragment: typeof fragments.$inferSelect) => void;
  type: (typeof messageTypeEnum.enumValues)[number];
};

export function MessageCard({
  content,
  role,
  createdAt,
  fragment,
  isActiveFragment,
  onFragmentClick,
  type,
}: MessageCardProps) {
  if (role === "USER") {
    return <UserMessage content={content} />;
  }

  return (
    <AssistantMessage
      content={content}
      createdAt={createdAt}
      fragment={fragment}
      isActiveFragment={isActiveFragment}
      onFragmentClick={onFragmentClick}
      type={type}
    />
  );
}

function UserMessage({ content }: { content: string }) {
  return (
    <div className="flex justify-end break-words pr-1 pt-2 pl-10">
      <Card className="rounded-xl max-w-4/5 shadow-none border-none py-3 px-4 bg-muted">
        {content}
      </Card>
    </div>
  );
}

function AssistantMessage({
  content,
  createdAt,
  fragment,
  isActiveFragment,
  onFragmentClick,
  type,
}: Omit<MessageCardProps, "role">) {
  return (
    <div
      className={cn(
        "flex flex-col break-words pt-6 group pb-8",
        type === "ERROR" && "text-red-800 dark:text-red-500",
      )}
    >
      <div className="flex items-center justify-start">
        <Image src={"/logo.svg"} alt="Logo" width={20} height={20} className="shrink-0" />
        <div className="flex items-center gap-x-2 pl-2">
          <p className="text-sm font-semibold">Groove</p>
          <span className="opacity-0 text-xs transition-opacity text-muted-foreground group-hover:opacity-100">
            {format(createdAt, "HH:mm 'on' MMM dd, yyyy")}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-y-5 max-w-11/12 shadow-none border-none py-3 pl-6">
        {content}
        {fragment && (
          <Fragment
            fragment={fragment}
            isActiveFragment={isActiveFragment}
            onFragmentClick={onFragmentClick}
          />
        )}
      </div>
    </div>
  );
}

function Fragment({
  fragment,
  isActiveFragment = true,
  onFragmentClick,
}: {
  fragment: typeof fragments.$inferSelect;
  isActiveFragment: boolean;
  onFragmentClick: (fragment: typeof fragments.$inferSelect) => void;
}) {
  return (
    <Button
      onClick={() => onFragmentClick(fragment)}
      variant={"outline"}
      className={cn(
        "flex py-8 h-15 w-fit shadow-2xs bg-secondary/20",
        isActiveFragment &&
          "bg-secondary text-secondary-foreground hover:bg-secondary/50",
      )}
    >
      <Code2Icon className="has-[>svg]:size-5 text-muted-foreground" />
      <div className="flex flex-col items-center gap-x-2">
        <span className="font-semibold">Fragment</span>
        <span className="text-accent-foreground/80">Preview</span>
      </div>
      <div className="flex justify-center">
        <ChevronRightIcon className="text-muted-foreground" />
      </div>
    </Button>
  );
}
