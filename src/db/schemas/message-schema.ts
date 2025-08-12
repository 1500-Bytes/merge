import { sql } from "drizzle-orm";
import { json, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { projects } from "./projects-schema";

export const messageRoleEnum = pgEnum("message_role_enum", ["USER", "ASSISTANT"]);

export const messageTypeEnum = pgEnum("message_type_enum", ["RESULT", "ERROR"]);

export const messages = pgTable("message", {
  id: uuid("id").primaryKey().defaultRandom(),
  content: text("content").notNull(),
  role: messageRoleEnum("role").notNull(),
  type: messageTypeEnum("type").notNull(),
  projectId: uuid("project_id")
    .references(() => projects.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at", {
    mode: "date",
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", {
    mode: "date",
    withTimezone: true,
  })
    .notNull()
    .defaultNow()
    .$onUpdate(() => sql`now()`),
});

export const fragments = pgTable("fragment", {
  id: uuid("id").primaryKey().defaultRandom(),
  messageId: uuid("message_id")
    .notNull()
    .unique()
    .references(() => messages.id, { onDelete: "cascade" }),
  sandboxUrl: text("sandbox_url").notNull(),
  title: text("title").notNull(),
  files: json("files").notNull(),

  createdAt: timestamp("created_at", {
    mode: "date",
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", {
    mode: "date",
    withTimezone: true,
  })
    .notNull()
    .defaultNow()
    .$onUpdate(() => sql`now()`),
});
