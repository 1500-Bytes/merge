import { TreeItem } from "@/lib/types";
import { ChevronRight, FileIcon, Folder } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarProvider,
  SidebarRail,
} from "../ui/sidebar";

type TreeViewProps = {
  data: TreeItem[];
  value?: string | null;
  onSelect?: (value: string) => void;
};

export function TreeView({ data, value, onSelect }: TreeViewProps) {
  return (
    <SidebarProvider>
      <Sidebar collapsible="none">
        <SidebarContent>
          {/*<SidebarGroup>
            <SidebarGroupLabel>Changes</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {data.changes.map((item, index) => (
                  <SidebarMenuItem key={index}>
                    <SidebarMenuButton>
                      <File />
                      {item.file}
                    </SidebarMenuButton>
                    <SidebarMenuBadge>{item.state}</SidebarMenuBadge>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>*/}
          <SidebarGroup>
            <SidebarGroupLabel>Files</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {data.map((item, index) => (
                  <Tree
                    key={index}
                    parentPath=""
                    selectedValue={value}
                    onSelect={onSelect}
                    item={item}
                  />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
    </SidebarProvider>
  );
}

type TreeProps = {
  parentPath: string;
  selectedValue?: string | null;
  onSelect?: (value: string) => void;
  item: TreeItem;
};

function Tree({ parentPath, selectedValue, onSelect, item }: TreeProps) {
  const [name, ...items] = Array.isArray(item) ? item : [item];
  const currentPath = parentPath ? `${parentPath}/${name}` : name;

  if (!items.length) {
    const isSelected = currentPath === selectedValue;

    return (
      <SidebarMenuButton
        isActive={isSelected}
        onClick={() => onSelect?.(currentPath)}
        className="data-[active=true]:bg-sidebar-accent/90 data-[active=true]:font-semibold"
      >
        <FileIcon />
        <span className="truncate">{name}</span>
      </SidebarMenuButton>
    );
  }

  return (
    <SidebarMenuItem>
      <Collapsible
        className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90"
        defaultOpen
      >
        <CollapsibleTrigger asChild>
          <SidebarMenuButton>
            <ChevronRight className="transition-transform" />
            <Folder />
            <span className="truncate">{name}</span>
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {items.map((subItem, index) => (
              <Tree
                key={index}
                parentPath={currentPath}
                selectedValue={selectedValue}
                onSelect={onSelect}
                item={subItem}
              />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  );
}
