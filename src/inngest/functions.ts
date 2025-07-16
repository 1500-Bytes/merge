import { type AgentState, inngest } from "./client";
import { anthropic, createAgent, createNetwork, createTool, gemini, openai } from "@inngest/agent-kit"
import { Sandbox } from "@e2b/code-interpreter"
import { getSandbox, lastAssistantTextMessageContent } from "@/lib/utils";
import { z } from "zod";
import { PROMPT } from "@/lib/constants";
import { createOrUpdateFilesTool, readFilesTool, terminalTool } from "./tools";
import { config } from "@/lib/config";
import { db, fragments, messages } from "@/db";

export const codeAgentFunction = inngest.createFunction(
  { id: "code-agent", name: "code-agent" },
  { event: "code-agent/run" },
  async ({ event, step }) => {
    const sandboxId = await step.run("get-sandbox-id", async () => {
      const sandbox = await Sandbox.create("merge-1st-sandbox")
      return sandbox.sandboxId
    })

    const codeAgent = createAgent<AgentState>({
      name: "code-agent",
      description: "An expert coding agent.",
      system: PROMPT,
      model: gemini({
        model: "gemini-2.5-pro",
        apiKey: config.env.GOOGLE_GENERATIVE_AI_API_KEY

      }),
      // model: openai({
      //   apiKey: config.env.GITHUB_OPEN_AI_API_KEY!,
      //   model: "gpt-4.1",
      //   baseUrl: "https://models.github.ai/inference",
      // }),
      tools: [
        terminalTool(sandboxId),
        createOrUpdateFilesTool(sandboxId),
        readFilesTool(sandboxId)
      ],
      lifecycle: {
        onResponse: async ({ result, network }) => {
          const lastTextResponse = lastAssistantTextMessageContent(result)

          if (lastTextResponse && network) {
            if (lastTextResponse.includes("<task_summary>")) {
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
      maxIter: 15,
      router: async ({ network }) => {
        const summary = network.state.data.summary

        if (summary) {
          return
        }

        return codeAgent
      }
    })

    const result = await network.run(event.data.value)

    const isError = !result.state.data.summary ||
      Object.keys(result.state.data.files || {}).length === 0

    const sandboxUrl = await step.run("get-sandbox-url", async () => {
      const sandbox = await getSandbox(sandboxId)
      const host = sandbox.getHost(3000)
      return `https://${host}`
    })


    await step.run("save-result", async () => {
      // Insert message first
      const [createdMessage] = await db.insert(messages).values({
        content: result.state.data.summary,
        role: "ASSISTANT",
        type: "RESULT",
      }).returning();

      // Insert fragment with the message ID
      await db.insert(fragments).values({
        title: "Fragment",
        files: result.state.data.files,
        messageId: createdMessage.id,
        sandboxUrl: sandboxUrl,
      });
    });

    return {
      sandboxUrl,
      title: "fragment",
      files: result.state.data.files,
      summary: result.state.data.summary,
    }
  }
);
