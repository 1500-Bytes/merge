import Sandbox from "@e2b/code-interpreter"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getSandbox = async (sandboxId: string) => {
  const sandbox = await Sandbox.connect(sandboxId)
  return sandbox
}
