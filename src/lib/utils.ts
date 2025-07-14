import Sandbox from "@e2b/code-interpreter"
import { AgentResult, TextMessage } from "@inngest/agent-kit"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getSandbox = async (sandboxId: string) => {
  const sandbox = await Sandbox.connect(sandboxId)
  return sandbox
}

export const lastAssistantTextMessageContent = (result: AgentResult) => {
  const lasAssistantTextMessageIndex = result.output.findLastIndex((message) =>
    message.role === "assistant")

  const message = result.output[lasAssistantTextMessageIndex] as TextMessage | undefined

  return message?.content
    ? typeof message.content === "string"
      ? message.content
      : message.content.map((c) => c.text).join("")
    : undefined
}
