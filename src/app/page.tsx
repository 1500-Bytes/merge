"use client"

import { Client } from "@/components/client";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary, useMutation } from "@tanstack/react-query";
import { Suspense } from "react";
import { toast } from "sonner";

export default function Home() {
  const trpc = useTRPC()

  const invoke = useMutation(trpc.invoke.mutationOptions({
    onSuccess: () => {
      toast.success("Event created successfully!");
    },
    onError: (error) => {
      toast.error("An error occurred while creating the event.");
    },
    onSettled: () => {
      toast.info("Event creation completed.");
    }
  }))

  return (
    <div className="max-w-7xl p-7">
      <Button size={"lg"} disabled={invoke.isPending} onClick={() => invoke.mutate({
        text: "yousafbhaikhan@10gmail.com"
      })}>
        {invoke.isPending ? 'Loading...' : 'Invoke function'}
      </Button>
    </div>

  );
}
