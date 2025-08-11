import { db, fragments, messages } from "@/db";
import { SYSTEM_PROMPT } from "@/lib/constants";
import { getSandbox } from "@/lib/utils";
import { gateway } from "@ai-sdk/gateway";
import Sandbox from "@e2b/code-interpreter";
import { GeneratedFile, generateText, stepCountIs } from "ai";
import { inngest } from "./client";
import { createOrUpdateFilesTool, readFilesTool, terminalTool } from "./tools";

type AgentState = {
  summary: string;
  files: GeneratedFile[];
};

export const codeAgentFunction = inngest.createFunction(
  { id: "code-agent", name: "code-agent" },
  { event: "code-agent/run" },
  async ({ event, step }) => {
    const sandboxId = await step.run("get-sandbox-id", async () => {
      const sandbox = await Sandbox.create("merge-1st-sandbox");
      return sandbox.sandboxId;
    });

    const state: AgentState = {
      summary: "",
      files: [],
    };

    await step.run("code-agent-running", async () => {
      const codeAgentResult = await generateText({
        model: gateway("openai/gpt-5"),
        system: SYSTEM_PROMPT,
        prompt: event.data.prompt,
        stopWhen: stepCountIs(10),
        tools: {
          terminalTool: terminalTool(sandboxId),
          readFilesTool: readFilesTool(sandboxId),
          createOrUpdateFilesTool: createOrUpdateFilesTool(sandboxId),
        },
      });

      state.summary = codeAgentResult.text;
      state.files = codeAgentResult.files;

      console.log(codeAgentResult.files);
    });

    const isError = !state.summary || !state.files || state.files.length === 0;

    const sandboxUrl = await step.run("get-sandbox-url", async () => {
      const sandbox = await getSandbox(sandboxId);
      const host = sandbox.getHost(3000);
      return `https://${host}`;
    });

    await step.run("save-result", async () => {
      if (isError) {
        return await db.insert(messages).values({
          projectId: event.data.projectId,
          type: "ERROR",
          role: "ASSISTANT",
          content: "Something went wrong",
        });
      }

      // Insert message first
      const [createdMessage] = await db
        .insert(messages)
        .values({
          projectId: event.data.projectId,
          content: state.summary,
          role: "ASSISTANT",
          type: "RESULT",
        })
        .returning({
          id: messages.id,
        });

      // Insert fragment with the message ID
      await db.insert(fragments).values({
        title: "Fragment",
        files: state.files,
        messageId: createdMessage.id,
        sandboxUrl: sandboxUrl,
      });
    });

    return {
      sandboxUrl,
      title: "fragment",
      summary: state.summary,
      files: state.files,
    };
  },
);
