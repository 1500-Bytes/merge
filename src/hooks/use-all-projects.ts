import { db, projects } from "@/db";
import { useInfiniteQuery } from "@tanstack/react-query";
import { desc, lt } from "drizzle-orm";

const getMany = async ({ pageParam }: { pageParam?: string }) => {
  const limit = 10;

  const baseQuery = db
    .select({
      id: projects.id,
      name: projects.name,
      createdAt: projects.createdAt,
      updatedAt: projects.updatedAt,
    })
    .from(projects);

  // Apply cursor-based pagination if pageParam exists
  const query = pageParam
    ? baseQuery.where(lt(projects.updatedAt, new Date(pageParam)))
    : baseQuery;

  const fetchedProjects = await query.orderBy(desc(projects.updatedAt)).limit(limit + 1); // Get one extra to determine if there are more

  // Determine next cursor
  let nextCursor: string | undefined = undefined;
  if (fetchedProjects.length > limit) {
    const nextItem = fetchedProjects.pop(); // Remove the extra item
    nextCursor = nextItem!.updatedAt.toISOString();
  }

  return {
    projects: fetchedProjects,
    nextCursor,
  };
};

export const useAllProjects = () => {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["projects"],
    queryFn: getMany,
    initialPageParam: undefined, // Start with undefined for first page
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  // Flatten all pages into a single array
  const allProjects = data?.pages.flatMap((page) => page.projects) ?? [];

  return {
    data,
    allProjects,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
    isLoading: status === "pending",
  };
};
