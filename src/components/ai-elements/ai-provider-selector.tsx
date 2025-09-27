"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AI_MODELS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import {
  BrainIcon,
  CheckIcon,
  ChevronDown,
  Eye,
  GripIcon,
  HeartIcon,
  Info,
  Search,
} from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Separator } from "../ui/separator";
import { TooltipWrapper } from "../custom/tooltip-wrapper";

const getCapabilityIcon = (capability: string) => {
  switch (capability) {
    case "reasoning":
      return <BrainIcon className="h-3 w-3" />;
    case "pdf":
      return <Info className="h-3 w-3" />;
    case "web-search":
      return <Search className="h-3 w-3" />;
    case "chat":
      return <Eye className="h-3 w-3" />;
    default:
      return null;
  }
};

type AIProviderSelectorProps = {
  isDisabled: boolean;
  selectedModel: string;
  onModelChange: (model: string) => void;
};
export function AIProviderSelector({
  isDisabled,
  selectedModel,
  onModelChange: onModelChangeAction, // Renamed for Next.js diagnostics
}: AIProviderSelectorProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredModels = AI_MODELS.filter(
    (model) =>
      model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.version.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const favoriteModels = filteredModels.filter((model) => model.category === "favorites");
  const otherModels = filteredModels.filter((model) => model.category === "others");
  const selectedModelData = AI_MODELS.find((model) => model.value === selectedModel);

  const handleModelSelect = (modelValue: string) => {
    try {
      const model = AI_MODELS.find((m) => m.value === modelValue);
      if (model && !model.isDisabled) {
        // Removed setModal as it was undefined and onModelChangeAction handles the state update
        onModelChangeAction(modelValue);
        setDialogOpen(false);
        setDropdownOpen(false);
      } else {
        console.warn("Model is disabled or not found:", modelValue);
      }
    } catch (error) {
      console.error("Failed to select model:", error);
    }
  };

  const handleShowAllModels = () => {
    setDropdownOpen(false);
    setDialogOpen(true);
  };

  return (
    <>
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger disabled={isDisabled} asChild>
          <Button variant={"outline"}>
            <div className="flex items-center gap-2">
              {selectedModelData ? (
                <>
                  {selectedModelData.icon}
                  <span className="text-sm">
                    {selectedModelData.name} {selectedModelData.version}
                  </span>
                </>
              ) : (
                "Select Model"
              )}
              <ChevronDown className="text-muted-foreground" />
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="py-1">
          {favoriteModels.map((model) => {
            return (
              <DropdownMenuItem
                key={model.value}
                onClick={() => handleModelSelect(model.value)}
                disabled={model.isDisabled}
              >
                {model.icon}
                <span className="truncate">
                  {model.name} {model.version}
                </span>
                {selectedModel === model.value ? <CheckIcon className="ml-auto" /> : null}
                {/*</div>*/}
              </DropdownMenuItem>
            );
          })}
          <Separator />
          {/*<DropdownMenuItem className="mt-2" asChild onClick={handleShowAllModels}>*/}
          <Button
            variant={"secondary"}
            className="w-full rounded-sm  mt-3"
            onClick={handleShowAllModels}
          >
            Show all models
            <GripIcon />
          </Button>
          {/*</DropdownMenuItem>*/}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Select AI Model</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search models..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <ScrollArea className="h-96">
              <div className="space-y-6">
                {favoriteModels.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <HeartIcon className="size-4 text-primary" />
                      <h3 className="font-medium">Favorites</h3>
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                      {favoriteModels.map((model, index) => {
                        if (model.isDisabled) {
                          return (
                            <TooltipWrapper key={index} title="Upgrade to unlock access">
                              <Button
                                key={model.value}
                                variant="ghost"
                                size={"lg"}
                                className={cn(
                                  "h-28 p-3 flex flex-col items-center justify-between border",
                                  selectedModel === model.value &&
                                    "border-primary bg-primary/20",
                                  model.isDisabled && "opacity-50 cursor-not-allowed",
                                )}
                                onClick={() => handleModelSelect(model.value)}
                                disabled={false}
                              >
                                <div className="flex flex-col items-center gap-3 flex-1">
                                  {model.icon}
                                  <div className="text-center">
                                    <div className="text-xs font-medium">
                                      {model.name}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      {model.version}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex gap-1">
                                  {model.capabilities.map((capability, index) => (
                                    <div key={index} className="text-muted-foreground">
                                      {getCapabilityIcon(capability)}
                                    </div>
                                  ))}
                                </div>
                              </Button>
                            </TooltipWrapper>
                          );
                        } else {
                          return (
                            <Button
                              key={model.value}
                              variant="ghost"
                              size={"lg"}
                              className={cn(
                                "h-28 p-3 flex flex-col items-center justify-between border",
                                selectedModel === model.value &&
                                  "border-primary bg-primary/20",
                                model.isDisabled && "opacity-50 cursor-not-allowed",
                              )}
                              onClick={() => handleModelSelect(model.value)}
                            >
                              <div className="flex flex-col items-center gap-3 flex-1">
                                {model.icon}
                                <div className="text-center">
                                  <div className="text-xs font-medium">{model.name}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {model.version}
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-1">
                                {model.capabilities.map((capability, index) => (
                                  <div key={index} className="text-muted-foreground">
                                    {getCapabilityIcon(capability)}
                                  </div>
                                ))}
                              </div>
                            </Button>
                          );
                        }
                      })}
                    </div>
                  </div>
                )}

                {otherModels.length > 0 && (
                  <div>
                    <h3 className="font-medium mb-3">Others</h3>
                    <div className="grid grid-cols-4 gap-3">
                      {otherModels.map((model) => (
                        <Button
                          key={model.value}
                          variant="ghost"
                          className={cn(
                            "h-24 p-3 flex flex-col items-center justify-between border",
                            selectedModel === model.value &&
                              "border-primary bg-primary/20",
                            model.isDisabled && "opacity-50 cursor-not-allowed",
                          )}
                          onClick={() => handleModelSelect(model.value)}
                          disabled={model.isDisabled}
                        >
                          <div className="flex flex-col items-center gap-1 flex-1">
                            {model.icon}
                            <div className="text-center">
                              <div className="text-xs font-medium">{model.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {model.version}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            {model.capabilities.map((capability, index) => (
                              <div key={index} className="text-muted-foreground">
                                {getCapabilityIcon(capability)}
                              </div>
                            ))}
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
