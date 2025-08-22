import { ReactNode } from "react";

export type TreeItem = string | [string, ...TreeItem[]];

export type AIModel = {
  name: string;
  version: string;
  value: string;
  icon: ReactNode;
  isDisabled?: boolean;
  capabilities: string[];
  category: "favorites" | "others";
  isPopular?: boolean;
};
