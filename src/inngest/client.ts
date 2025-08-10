import { Inngest } from "inngest";


export type AgentState = {
  summary: string,
  files: { [path: string]: string },
}


// Create a client to send and receive events
export const inngest = new Inngest({ id: "merge" });
