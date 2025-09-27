"use client";

import type * as React from "react";
import { useRef, useEffect } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { FolderIcon, Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAllProjects } from "@/hooks/use-all-projects";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const parentRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const {
    allProjects,
    hasNextPage,
    isLoading,
    fetchNextPage,
    isFetchingNextPage,
    error,
  } = useAllProjects();

  // Set up virtualizer
  const virtualizer = useVirtualizer({
    count: hasNextPage ? allProjects.length + 1 : allProjects.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 48, // Estimated height for each project item
    overscan: 5, // Render 5 extra items outside viewport
  });

  // Auto-fetch next page when approaching end
  useEffect(() => {
    const [lastItem] = [...virtualizer.getVirtualItems()].reverse();

    if (!lastItem || !hasNextPage || isFetchingNextPage) return;

    // Load more when we're within 3 items of the end
    if (lastItem.index >= allProjects.length - 3) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, allProjects.length, fetchNextPage, virtualizer]);

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = now.getTime() - new Date(date).getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  // Loading state for initial load
  if (isLoading) {
    return (
      <Sidebar
        variant="floating"
        collapsible="offcanvas"
        className="top-[--header-height] h-[calc(100svh-var(--header-height))]"
        {...props}
      >
        <SidebarHeader className="text-muted-foreground text-sm pl-3">
          <span>Recent Projects</span>
        </SidebarHeader>
        <SidebarContent className="flex-1">
          <SidebarGroup className="flex-1 flex items-center justify-center">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2Icon className="h-4 w-4 animate-spin" />
              <span className="text-sm">Loading projects...</span>
            </div>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={data.user} />
        </SidebarFooter>
      </Sidebar>
    );
  }

  // Error state
  if (error) {
    return (
      <Sidebar
        variant="floating"
        collapsible="offcanvas"
        className="top-[--header-height] h-[calc(100svh-var(--header-height))]"
        {...props}
      >
        <SidebarHeader className="text-muted-foreground text-sm pl-3">
          <span>Recent Projects</span>
        </SidebarHeader>
        <SidebarContent className="flex-1">
          <SidebarGroup className="flex-1 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <p className="text-sm">Error loading projects</p>
              <p className="text-xs mt-1">{error.message}</p>
            </div>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={data.user} />
        </SidebarFooter>
      </Sidebar>
    );
  }

  return (
    <Sidebar
      variant="floating"
      collapsible="offcanvas"
      className="top-[--header-height] h-[calc(100svh-var(--header-height))]"
      {...props}
    >
      <SidebarHeader className="text-muted-foreground text-sm pl-3">
        <span>Recent Projects</span>
      </SidebarHeader>

      <SidebarContent className="flex-1">
        <SidebarGroup className="flex-1">
          {allProjects.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <FolderIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No projects yet</p>
              </div>
            </div>
          ) : (
            <div
              ref={parentRef}
              className="flex-1 overflow-auto"
              style={{ height: "100%" }}
            >
              <div
                style={{
                  height: `${virtualizer.getTotalSize()}px`,
                  width: "100%",
                  position: "relative",
                }}
              >
                {virtualizer.getVirtualItems().map((virtualItem) => {
                  const isLoaderRow = virtualItem.index > allProjects.length - 1;
                  const project = allProjects[virtualItem.index];

                  return (
                    <div
                      key={virtualItem.index}
                      className="absolute top-0 left-0 w-full"
                      style={{
                        height: `${virtualItem.size}px`,
                        transform: `translateY(${virtualItem.start}px)`,
                      }}
                    >
                      {isLoaderRow ? (
                        hasNextPage ? (
                          <div className="flex flex-col items-center justify-center h-12 gap-2">
                            <div className="flex items-center text-muted-foreground">
                              <Loader2Icon className="h-4 w-4 animate-spin mr-2" />
                              <span className="text-sm">Loading more...</span>
                            </div>
                            {/* Manual Load More Button */}
                            <button
                              onClick={() => fetchNextPage()}
                              disabled={isFetchingNextPage}
                              className="px-3 py-1 text-xs text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isFetchingNextPage ? "Loading..." : "Load More"}
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center h-12 text-muted-foreground">
                            <span className="text-xs">No more projects</span>
                          </div>
                        )
                      ) : project ? (
                        <SidebarMenuButton
                          className="w-full h-12 px-3 justify-start hover:bg-accent/50 transition-colors"
                          asChild
                        >
                          <button
                            onClick={() => {
                              console.log("Selected project:", project.id);
                              router.push(`/project/${project.id}`);
                            }}
                            className="flex items-center gap-3 w-full"
                          >
                            <FolderIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <div className="flex-1 text-left min-w-0">
                              <div className="text-sm font-medium truncate">
                                {project.name}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {formatDate(project.updatedAt)}
                              </div>
                            </div>
                          </button>
                        </SidebarMenuButton>
                      ) : null}
                    </div>
                  );
                })}
              </div>

              {/* Alternative: Load More Button at the bottom */}
              {hasNextPage && (
                <div className="flex justify-center p-4 border-t">
                  <button
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isFetchingNextPage && (
                      <Loader2Icon className="h-4 w-4 animate-spin" />
                    )}
                    {isFetchingNextPage ? "Loading more..." : "Load More"}
                  </button>
                </div>
              )}
            </div>
          )}
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
