import { neon } from "@neondatabase/serverless";
import { drizzle as DrizzleHttp } from "drizzle-orm/neon-http";
import * as userSchema from "./schemas/user-schema";
import * as messageSchema from "./schemas/message-schema";
import { config } from "@/lib/config";

// Combine all schemas into a single object
const schema = {
  ...userSchema,
  ...messageSchema,
};

const client = neon(config.env.DATABASE_URL);
export const db = DrizzleHttp(client, { schema });
export const { fragments, messages, users } = schema;
