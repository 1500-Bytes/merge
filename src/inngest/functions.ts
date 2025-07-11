import { inngest } from "./client";
import { createAgent, gemini } from "@inngest/agent-kit"
import { Sandbox } from "@e2b/code-interpreter"
import { getSandbox } from "@/lib/utils";

export const helloWorld = inngest.createFunction(
  { id: "hello-world", name: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {

    const sandboxId = await step.run("get-sandbox-id", async () => {
      const sanddbox = await Sandbox.create("merge-1st-sandbox")
      return sanddbox.sandboxId
    })


    const codeAgent = createAgent({
      name: "code-agent",
      system: "You are an expert programmer who knows almost everything about frontend and specifically nextjs and shadcn. You write readable, maintainable, and efficient code.",
      model: gemini({ model: "gemini-2.0-flash" })
    })

    const output = await codeAgent.run(event.data.value)
    console.log(output)


    const url = await step.run("get-sandbox-url", async () => {
      const sandbox = await getSandbox(sandboxId)
      const host = sandbox.getHost(3000)
      return `https://${host}`
    })



    return { output, url }
  }
);
