"use client";

import { useProjectContext } from "@/context/projects-context";
import { fragments } from "@/db";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import ProgressiveBlur from "../magicui/progressive-blur";
import { ScrollArea } from "../ui/scroll-area";
import { AIContentLoading } from "./ai-content-loading";
import { MessageCard } from "./message-card";
import { MessageForm } from "./message-form";

type MessagesContainerProps = {
  projectId: string;
  activeFragment: typeof fragments.$inferSelect | null;
  setActiveFragment: Dispatch<SetStateAction<typeof fragments.$inferSelect | null>>;
};

export function MessagesContainer({
  projectId,
  activeFragment,
  setActiveFragment,
}: MessagesContainerProps) {
  const { isGenerationError } = useProjectContext();
  const lastAssistantMessageRef = useRef<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const trpc = useTRPC();
  const { data, isSuccess } = useSuspenseQuery(
    trpc.messages.getMany.queryOptions(
      {
        projectId: projectId,
      },
      {
        refetchInterval: 5000,
      },
    ),
  );

  useEffect(() => {
    const lastAssistantMessage = data.findLast(
      (entry) => entry.message.role === "ASSISTANT",
    );

    if (
      lastAssistantMessage?.fragment &&
      lastAssistantMessageRef.current !== lastAssistantMessage.message.id
    ) {
      setActiveFragment(lastAssistantMessage.fragment);
      lastAssistantMessageRef.current = lastAssistantMessage.message.id;
    }
  }, [data, setActiveFragment]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView();
  }, [data.length]);

  const lastMessage = data[data.length - 1];
  const isLastMessageUser = lastMessage.message.role === "USER" && !isGenerationError;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 min-h-0">
        <ScrollArea className="h-full px-3 relative">
          <div className="pb-5 pt-2">
            {data.map((entry) => (
              <MessageCard
                key={entry.message.id}
                content={entry.message.content}
                role={entry.message.role}
                createdAt={entry.message.createdAt}
                fragment={entry.fragment}
                isActiveFragment={activeFragment?.id === entry.fragment?.id}
                onFragmentClick={setActiveFragment}
                type={entry.message.type}
              />
            ))}
          </div>
          {/*{isGenerationError && <GenerationMessageAssistant />}*/}
          {isLastMessageUser && <AIContentLoading />}
          <div ref={bottomRef} />
          <ProgressiveBlur
            className="absolute"
            position="bottom"
            blurLevels={[0.5, 1, 2, 4, 8, 16, 32, 64, 128]}
            height="10%"
          />
        </ScrollArea>
      </div>
      <div className="relative px-2">
        <MessageForm projectId={projectId} />
      </div>
    </div>
  );
}
