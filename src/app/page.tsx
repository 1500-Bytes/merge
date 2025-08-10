"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

export default function Home() {
  const trpc = useTRPC();
  const [value, setValue] = useState("");
  const { data: messages, isPending } = useQuery(trpc.messages.getMany.queryOptions());
  const invoke = useMutation(
    trpc.messages.create.mutationOptions({
      onSuccess: () => {
        toast.success("Event created successfully!");
      },
      onError: (error) => {
        toast.error("An error occurred while creating the event.");
      },
    }),
  );

  return (
    <div className="max-w-7xl p-7">
      <Input value={value} onChange={(e) => setValue(e.target.value)} />
      <Button
        size={"lg"}
        disabled={invoke.isPending}
        onClick={() =>
          invoke.mutate({
            value: value,
          })
        }
      >
        {invoke.isPending ? "Loading..." : "Invoke function"}
      </Button>
      {isPending ? (
        <p className="text-gray-500">Loading messages...</p>
      ) : (
        <ul className="mt-4">
          {messages?.map((message) => (
            <li key={message.messages.id} className="mb-2">
              {message.messages.content} - <span className="text-gray-500">{message.messages.createdAt.toLocaleString()}</span>
            </li>
          ))}
        </ul>
      )}
      {invoke.isPending && <p className="text-gray-500">Creating event...</p>}
      {invoke.isError && <p className="text-red-500">Error: {invoke.error.message}</p>}
      {invoke.isSuccess && <p className="text-green-500">Event created successfully!</p>}
    </div>
  );
}
