import { inngest } from "./client";
import { anthropic, createAgent, createNetwork, createTool } from "@inngest/agent-kit"
import { Sandbox } from "@e2b/code-interpreter"
import { getSandbox, lastAssistantTextMessageContent } from "@/lib/utils";
import { z } from "zod";
import { PROMPT } from "@/lib/constants";
import { createOrUpdateFilesTool, readFilesTool, terminalTool } from "./tools";

export const helloWorld = inngest.createFunction(
  { id: "hello-world", name: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    const sandboxId = await step.run("get-sandbox-id", async () => {
      const sandbox = await Sandbox.create("merge-1st-sandbox")
      return sandbox.sandboxId
    })
    const codeAgent = createAgent({
      name: "code-agent",
      description: "An expert coding agent.",
      system: PROMPT,
      model: anthropic({
        model: "claude-3-5-sonnet-latest",
        defaultParameters: {
          max_tokens: 1000,
          temperature: 0.1
        }
      }),
      tools: [
        terminalTool(sandboxId),
        createOrUpdateFilesTool(sandboxId),
        readFilesTool(sandboxId)
      ],
      lifecycle: {
        onResponse: async ({ result, network }) => {
          const lastTextResponse = lastAssistantTextMessageContent(result)

          if (lastTextResponse && network) {
            if (lastTextResponse.includes("<text_summary>")) {
              network.state.data.summary = lastTextResponse
            }
          }

          return result
        }
      }
    })

    const network = createNetwork({
      name: "coding-agent-network",
      description: "A network for coding agents",
      agents: [codeAgent],
      maxIter: 20,
      router: async ({ network }) => {
        const summary = network.state.data.summary

        if (summary) {
          return
        }

        return codeAgent
      }
    })

    const result = await network.run(event.data.value)

    const url = await step.run("get-sandbox-url", async () => {
      const sandbox = await getSandbox(sandboxId)
      const host = sandbox.getHost(3000)
      return `https://${host}`
    })
    return {
      url,
      title: "fragment",
      files: network.state.data.files,
      summary: network.state.data.summary,
    }
  }
);
