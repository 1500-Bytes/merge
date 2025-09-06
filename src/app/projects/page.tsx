import { ProjectsView } from "@/components/views/project/projects-view";
import { getQueryClient } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";

function Page() {
  const queryCLient = getQueryClient();
  return (
    <HydrationBoundary state={dehydrate(queryCLient)}>
      <Suspense fallback={<div>Loading projects view...</div>}>
        <ProjectsView />
      </Suspense>
    </HydrationBoundary>
  );
}

export default Page;
