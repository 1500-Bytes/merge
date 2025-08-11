import { getSandbox } from "@/lib/utils";
import { tool } from "ai";
import { z } from "zod";

export const terminalTool = (sandboxId: string) =>
  tool({
    description: "Use the terminal to run commands",
    inputSchema: z.object({
      command: z.string().describe("The command to execute in the terminal"),
    }),
    execute: async ({ command }) => {
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
        return {
          success: true,
          output: result.stdout,
        };
      } catch (error) {
        const errorMessage = `Command failed: ${error} \nstdout: ${buffers.stdout}\nstderr: ${buffers.stderr}`;
        console.error(errorMessage);
        return {
          success: false,
          error: errorMessage,
        };
      }
    },
  });

export const createOrUpdateFilesTool = (sandboxId: string) =>
  tool({
    description: "Create or update files in the sandbox",
    inputSchema: z.object({
      files: z
        .array(
          z.object({
            path: z.string().describe("The file path relative to the project root"),
            content: z.string().describe("The content to write to the file"),
          }),
        )
        .describe("Array of files to create or update"),
    }),
    execute: async ({ files }) => {
      try {
        const sandbox = await getSandbox(sandboxId);
        const updatedFiles: Record<string, string> = {};

        for (const file of files) {
          await sandbox.files.write(file.path, file.content);
          updatedFiles[file.path] = file.content;
        }

        return {
          success: true,
          message: `Successfully created/updated ${files.length} file(s)`,
          files: updatedFiles,
        };
      } catch (error) {
        return {
          success: false,
          error: `Error creating or updating files: ${error}`,
        };
      }
    },
  });

export const readFilesTool = (sandboxId: string) =>
  tool({
    description: "Read files from sandbox",
    inputSchema: z.object({
      files: z.array(z.string()).describe("Array of file paths to read"),
    }),
    execute: async ({ files }) => {
      try {
        const sandbox = await getSandbox(sandboxId);
        const contents = [];

        for (const file of files) {
          try {
            const content = await sandbox.files.read(file);
            contents.push({ path: file, content, success: true });
          } catch (fileError) {
            contents.push({
              path: file,
              content: null,
              success: false,
              error: `Failed to read ${file}: ${fileError}`,
            });
          }
        }

        return {
          success: true,
          files: contents,
        };
      } catch (error) {
        return {
          success: false,
          error: `Error reading files during step execution: ${error}`,
        };
      }
    },
  });
