"use client"

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

export const Client = () => {
  const trpc = useTRPC()
  const { data } = useSuspenseQuery(trpc.hello.queryOptions({
    text: "Hello, Abdul"
  }))

  return (
    <div>
      <p className="font-bold">{data.greeting}</p>
    </div>
  );
}
