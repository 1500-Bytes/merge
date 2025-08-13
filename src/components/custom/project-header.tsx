import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import Link from "next/link";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ComputerIcon,
  LayoutDashboardIcon,
  MoonIcon,
  SunIcon,
  SunMoonIcon,
} from "lucide-react";
import Image from "next/image";
import { useTheme } from "next-themes";

type ProjectHeaderProps = {
  projectId: string;
};

export const ProjectHeader = ({ projectId }: ProjectHeaderProps) => {
  const trpc = useTRPC();
  const { data: project } = useSuspenseQuery(
    trpc.projects.getOne.queryOptions({
      projectId,
    }),
  );
  const { theme, setTheme } = useTheme();

  return (
    <header className="p-3 flex justify-between items-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={"ghost"}
            size="sm"
            className="focus-visible:ring-0 hover:bg-muted/50 transition-colors pl-2 pr-1 gap-x-2 h-9"
          >
            <Image src="/logo.svg" alt="Logo" width={20} height={20} />
            <span className="font-medium">{project.name}</span>
            <ChevronDownIcon className="text-muted-foreground size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" align="start" className="w-56">
          <DropdownMenuItem asChild>
            <Link href="/" className="flex items-center gap-2">
              <ChevronLeftIcon className="size-4 text-muted-foreground" />
              <span>Go to Dashboard</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="gap-2">
              <SunMoonIcon className="size-4 text-muted-foreground" />
              <span>Appearance</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
                  <DropdownMenuRadioItem value="light" className="gap-2">
                    <SunIcon className="size-4 text-muted-foreground" />
                    <span>Light</span>
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="dark" className="gap-2">
                    <MoonIcon className="size-4 text-muted-foreground" />
                    <span>Dark</span>
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="system" className="gap-2">
                    <ComputerIcon className="size-4 text-muted-foreground" />
                    <span>System</span>
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};
