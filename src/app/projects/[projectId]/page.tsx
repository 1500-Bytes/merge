import { ProjectView } from "@/components/views/project-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";

type PageProps = {
  params: Promise<{
    projectId: string;
  }>;
};

async function Page({ params }: PageProps) {
  const { projectId } = await params;
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.messages.getMany.queryOptions({
      projectId: projectId,
    }),
  );
  // void queryClient.prefetchQuery(
  //   trpc.projects.getOne.queryOptions({
  //     projectId: projectId,
  //   }),
  // );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<div>Loading project view...</div>}>
        <ProjectView projectId={projectId} />
      </Suspense>
    </HydrationBoundary>
  );
}

export default Page;
