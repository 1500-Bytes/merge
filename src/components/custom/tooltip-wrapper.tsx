import { ReactNode } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

type TooltipWrapperProps = {
  children: ReactNode;
  title: string;
  side: "top" | "bottom" | "left" | "right";
  align: "start" | "center" | "end";
};

export function TooltipWrapper({ children, title, side, align }: TooltipWrapperProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side={side} align={align}>
          {title}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
