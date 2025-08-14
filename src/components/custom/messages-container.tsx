"use client";

import { fragments } from "@/db";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { MessageCard } from "./message-card";
import { MessageForm } from "./message-form";
import { MessageLoading } from "./message-loading";

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
  const bottomRef = useRef<HTMLDivElement>(null);
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
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
    const lastAssistantMessageWithFragment = data.findLast(
      (entry) => entry.message.role === "ASSISTANT",
    );

    if (lastAssistantMessageWithFragment) {
      setActiveFragment(lastAssistantMessageWithFragment.fragment);
    }
  }, [data, setActiveFragment]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView();
  }, [data.length]);

  const lastMessage = data[data.length - 1];
  const isLastMessageUser = lastMessage.message.role === "USER";

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 min-h-0">
        <ScrollArea className="h-full px-3">
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
          {isLastMessageUser && <MessageLoading />}
          <div ref={bottomRef} />
        </ScrollArea>
      </div>
      <div className="relative px-3 py-2">
        <div className="absolute -top-6 left-0 h-6 right-0 bg-gradient-to-b from-transparent to-background/70 pointer-events-none"></div>
        <MessageForm projectId={projectId} />
      </div>
    </div>
  );
}
