"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { MessageCard } from "./message-card";
import { MessageForm } from "./message-form";
import { ScrollArea } from "../ui/scroll-area";
import { useEffect, useRef } from "react";

export function MessagesContainer({ projectId }: { projectId: string }) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.messages.getMany.queryOptions({
      projectId: projectId,
    }),
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView();
  }, [data.length]);

  return (
    <div className="flex flex-col justify-between h-screen py-3">
      <ScrollArea className="overflow-y-auto flex-1">
        <div className="px-3 pb-5">
          {data.map((entry) => (
            <MessageCard
              key={entry.message.id}
              content={entry.message.content}
              role={entry.message.role}
              createdAt={entry.message.createdAt}
              fragment={entry.fragment}
              isActiveFragment={false}
              onFragmentClick={() => {}}
              type={entry.message.type}
            />
          ))}
        </div>
        <div ref={bottomRef} />
      </ScrollArea>
      <div className="relative px-3">
        <div className="absolute -top-6 left-0 h-6 right-0 bg-gradient-to-b from-transparent to-background/70 pointer-events-none"></div>
        <MessageForm projectId={projectId} />
      </div>
    </div>
  );
}
