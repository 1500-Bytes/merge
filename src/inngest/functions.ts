// functions.ts
import { inngest } from "./client";
import { google } from '@ai-sdk/google';
import { generateText, tool, CoreMessage } from 'ai';
import { z } from 'zod';
import { Sandbox } from "@e2b/code-interpreter";
import { getSandbox } from "@/lib/utils";
import { PROMPT } from "@/lib/constants";
import { createFilesTool, createReadFilesTool, createTerminalTool } from "@/lib/tools";

export const helloWorld = inngest.createFunction(
  { id: "hello-world", name: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    const sandboxId = await step.run("get-sandbox-id", async () => {
      const sandbox = await Sandbox.create("merge-1st-sandbox");
      return sandbox.sandboxId;
    });

    const result = await step.run("run-ai-agent", async () => {
      // Agent state to track files and summary
      const agentState: { files: Record<string, string>, summary: string } = {
        files: {},
        summary: ""
      };

      // Initialize model
      const model = google('gemini-2.5-flash');


      const tools = [
        createFilesTool(sandboxId, agentState),
        createReadFilesTool(sandboxId),
        createTerminalTool(sandboxId)
      ];


      let messages: CoreMessage[] = [
        {
          role: 'system',
          content: PROMPT
        },
        {
          role: 'user',
          content: event.data.value
        }
      ];

      let iterations = 0; // Initialize iterations counter

      // Agent loop
      while (true) { // Added missing while loop to encapsulate agent iterations
        iterations++; // Increment iterations

        try {
          const response = await generateText({
            model,
            messages,
            // maxTokens: 4000,
            temperature: 0.1,
            maxSteps: 20, // maxSteps applies to the internal tool-using loop within a single generateText call
            tools: {
              createTerminalTool: createTerminalTool(sandboxId),
              createReadFilesTool: createReadFilesTool(sandboxId),
              createFilesTool: createFilesTool(sandboxId, agentState)
            }

          });

          // Add assistant response to conversation history for the next turn
          messages.push({
            role: 'assistant',
            content: response.text
          });

          // Check if we have a summary (task completion indicator)
          if (response.text.includes("<text_summary>") || response.text.includes("<task_summary>")) {
            agentState.summary = response.text;
            break; // Task completed, exit loop
          }

          // If the model did not make any new tool calls and no summary was provided, it's done or stuck.
          if (!response.toolCalls || response.toolCalls.length === 0) {
            break; // No more actions suggested, exit loop
          }

          // If tool calls were made, the `generateText` function *executed* them internally.
          // The loop continues, allowing the model to take another turn based on the updated
          // (internal) state from the last tool execution.

        } catch (error) {
          console.error('AI generation error:', error);
          agentState.summary = `AI agent encountered an error: ${error instanceof Error ? error.message : String(error)}`;
          break; // Exit loop on error
        }
      } // End of the agent loop

      return {
        files: agentState.files,
        summary: agentState.summary,
        iterations,
      };
    }); // Correctly closed step.run("run-ai-agent"...) call

    const url = await step.run("get-sandbox-url", async () => {
      const sandbox = await getSandbox(sandboxId); // sandboxId is correctly in scope
      const host = sandbox.getHost(3000);
      return `https://${host}`;
    });

    return {
      url,
      title: "fragment",
      files: result.files,
      summary: result.summary,
      iterations: result.iterations,
    };
  }
);
