"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarHeader, useSidebar } from "@/components/ui/sidebar";
import { teams } from "@/lib/constants";
import Image from "next/image";
import { TeamSwitcher } from "./team-switcher";
import Link from "next/link";
import { BreadcrumbSeparator } from "./ui/breadcrumb";
import { SlashIcon } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="bg-sidebar sticky top-0 z-50 flex w-full items-center border-b">
      <div className="flex h-(--header-height) w-full items-center gap-2 px-4">
        <Button asChild className="h-8 w-8" variant="ghost" size="icon">
          <Link href="/projects">
            <Image src="/logo.svg" height={18} width={18} alt="Logo" />
          </Link>
        </Button>

        <Separator orientation="vertical" className="mr-2 h-4" />

        <SidebarHeader>
          <TeamSwitcher teams={teams} />
          {/*<NavMain items={placeholderUser} />*/}
        </SidebarHeader>

        {/*<Breadcrumb className="hidden sm:block">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Building Your Application</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Data Fetching</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>*/}
      </div>
    </header>
  );
}
