import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ProjectContextProvider } from "@/context/projects-context";
import { ReactNode } from "react";

// export const iframeHeight = "800px"

// export const description = "A sidebar with a header and a search form."

type LayoutProps = {
  children: ReactNode;
};

const layout = ({ children }: LayoutProps) => {
  return (
    <div className="[--header-height:calc(--spacing(10))]">
      <SidebarProvider className="flex flex-col">
        <ProjectContextProvider>
          <SiteHeader />
          <div className="flex flex-1">
            <AppSidebar />
            <SidebarInset className="m-0!">
              <SidebarTrigger className="ml-2 mt-2" />
              {children}
            </SidebarInset>
          </div>
        </ProjectContextProvider>
      </SidebarProvider>
    </div>
  );
};

export default layout;
