import { getSandbox } from "@/lib/utils";
import { createTool, Tool } from "@inngest/agent-kit";
import { z } from "zod";
import { type AgentState } from "./client";

export const terminalTool = (sandboxId: string) =>
  createTool({
    name: "terminal",
    description: "Use the terminal to run commands",
    parameters: z.object({
      command: z.string().describe("The command to execute in the terminal"),
    }) as any,
    handler: async ({ command }, { step }) => {
      return await step?.run("terminal", async () => {
        const buffers = { stdout: "", stderr: "" };
        try {
          const sandbox = await getSandbox(sandboxId);
          const result = await sandbox.commands.run(command, {
            onStdout: (data: string) => {
              buffers.stdout += data;
            },
            onStderr: (data: string) => {
              buffers.stderr += data;
            },
          });
          return result.stdout;
        } catch (error) {
          console.error(
            `Command failed: ${error} \nstdout: ${buffers.stdout}\nstderror: ${buffers.stderr}`,
          );
          return `Command failed: ${error} \nstdout: ${buffers.stdout}\nstderror: ${buffers.stderr}`;
        }
      });
    },
  });

export const createOrUpdateFilesTool = (sandboxId: string) =>
  createTool({
    name: "createOrUpdateFiles",
    description: "Create or update files in the sandbox",
    parameters: z.object({
      files: z
        .array(
          z.object({
            path: z.string().describe("The file path relative to the project root"),
            content: z.string().describe("The content to write to the file"),
          }),
        )
        .describe("Array of files to create or update"),
    }) as any,
    handler: async ({ files }, { step, network }: Tool.Options<AgentState>) => {
      const newFiles = await step?.run("createOrUpdateFiles", async () => {
        try {
          const sandbox = await getSandbox(sandboxId);
          const updatedFiles = network.state.data.files || {};
          for (const file of files) {
            await sandbox.files.write(file.path, file.content);
            updatedFiles[file.path] = file.content;
          }

          return updatedFiles;
        } catch (error) {
          return `Error creating or updating files: ${error}`;
        }
      });

      if (typeof newFiles === "object") {
        network.state.data.files = newFiles;
      }
    },
  });

export const readFilesTool = (sandboxId: string) =>
  createTool({
    name: "readFiles",
    description: "Read files from sandbox",
    parameters: z.object({
      files: z.array(z.string()).describe("Array of file paths to read"),
    }) as any,
    handler: async ({ files }, { step }) => {
      return step?.run("readFiles", async () => {
        try {
          const sandbox = await getSandbox(sandboxId);
          const contents = [];
          for (const file of files) {
            const content = await sandbox.files.read(file);
            contents.push({ path: file, content });
          }

          return JSON.stringify(contents);
        } catch (error) {
          return `Error reading files: ${error}`;
        }
      });
    },
  });
