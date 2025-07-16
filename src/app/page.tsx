"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

export default function Home() {
  const trpc = useTRPC()
  const [value, setValue] = useState("")
  const { data: messages, isPending } = useQuery(trpc.messages.getMany.queryOptions())
  const invoke = useMutation(trpc.messages.create.mutationOptions({
    onSuccess: () => {
      toast.success("Event created successfully!");
    },
    onError: (error) => {
      toast.error("An error occurred while creating the event.");
    },
  }))

  return (
    <div className="max-w-7xl p-7">
      <Input value={value} onChange={(e) => setValue(e.target.value)} />
      <Button size={"lg"} disabled={invoke.isPending} onClick={() => invoke.mutate({
        value: value
      })}>
        {invoke.isPending ? 'Loading...' : 'Invoke function'}
      </Button>
      <pre>
        {JSON.stringify(messages, null, 2)}
      </pre>
    </div>

  );
}
