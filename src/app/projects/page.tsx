"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";

function Page() {
  const [prompt, setPrompt] = useState("");
  const router = useRouter();
  const trpc = useTRPC();
  const { mutate: createProject, isPending } = useMutation(
    trpc.projects.create.mutationOptions({
      onSuccess: (data) => {
        toast.success("Project created successfully");
        router.push(`/projects/${data.id}`);
      },
      onError: (error) => {
        toast.error(`Failed to create project: ${error.message}`);
      },
    }),
  );

  return (
    <div className="max-w-7xl p-7">
      <Input value={prompt} onChange={(e) => setPrompt(e.target.value)} />
      <Button
        size={"lg"}
        disabled={isPending}
        onClick={() =>
          createProject({
            prompt: prompt,
          })
        }
      >
        {isPending ? "Loading..." : "Create Project"}
      </Button>
    </div>
  );
}

export default Page;
