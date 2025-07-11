import { inngest } from "./client";
import { createAgent, gemini } from "@inngest/agent-kit"

export const helloWorld = inngest.createFunction(
  { id: "hello-world", name: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    const codeAgent = createAgent({
      name: "code-agent",
      system: "You are an expert programmer who knows almost everything about frontend and specifically nextjs and shadcn. You write readable, maintainable, and efficient code.",
      model: gemini({ model: "gemini-2.0-flash" })
    })

    const output = await codeAgent.run(event.data.value)
    console.log(output)

    return { output }
  }
);
