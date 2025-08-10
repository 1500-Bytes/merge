import { neon } from "@neondatabase/serverless";
import { drizzle as DrizzleHttp } from "drizzle-orm/neon-http";
import * as usersSchema from "./schemas/user-schema";
import * as messagesSchema from "./schemas/message-schema";
import * as projectsSchema from "./schemas/projects-schema";
import { config } from "@/lib/config";

// Combine all schemas into a single object
const schema = {
  ...usersSchema,
  ...messagesSchema,
  ...projectsSchema,
};

const client = neon(config.env.DATABASE_URL);
export const db = DrizzleHttp(client, { schema });
export const { fragments, messages, users, projects } = schema;
