import { tool } from "ai";
import { getSandbox } from "./utils";
import { z } from "zod";

export const createTerminalTool = (sandboxId: string) => tool({
  description: "Use the terminal to run commands",
  parameters: z.object({
    command: z.string().describe("The command to execute in the terminal")
  }),
  execute: async ({ command }) => {
    const buffers = { stdout: "", stderr: "" };
    try {
      console.log({ command })
      const sandbox = await getSandbox(sandboxId);
      const result = await sandbox.commands.run(command, {
        onStdout: (data: string) => {
          buffers.stdout += data;
        },
        onStderr: (data: string) => {
          buffers.stderr += data;
        }
      });
      return result.stdout;
    } catch (error) {
      console.error(
        `Command failed: ${error} \nstdout: ${buffers.stdout}\nstderror: ${buffers.stderr}`
      );
      return `Command failed: ${error} \nstdout: ${buffers.stdout}\nstderror: ${buffers.stderr}`;
    }
  }
});

export const createFilesTool = (sandboxId: string, agentState: any) => tool({
  description: "Create or update files in the sandbox",
  parameters: z.object({
    files: z.array(z.object({
      path: z.string().describe("The file path relative to the project root"),
      content: z.string().describe("The content to write to the file")
    })).describe("Array of files to create or update")
  }),
  execute: async ({ files }) => {
    try {
      console.log({ files })
      const sandbox = await getSandbox(sandboxId);
      const updatedFiles = agentState.files || {};

      for (const file of files) {
        await sandbox.files.write(file.path, file.content);
        updatedFiles[file.path] = file.content;
      }

      agentState.files = updatedFiles;
      return `Successfully created/updated ${files.length} files`;
    } catch (error) {
      return `Error creating or updating files: ${error}`;
    }
  }
});

export const createReadFilesTool = (sandboxId: string) => tool({
  description: "Read files from sandbox",
  parameters: z.object({
    files: z.array(z.string()).describe("Array of file paths to read")
  }),
  execute: async ({ files }) => {
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
  }
});
