import { relations, sql } from "drizzle-orm";
import { json, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const messageRoleEnum = pgEnum("message_role_enum", ["USER", "ASSISTANT"]);

export const messageTypeEnum = pgEnum("message_type_enum", ["RESULT", "ERROR"]);

export const messages = pgTable("messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  content: text("content").notNull(),
  role: messageRoleEnum("role").notNull(),
  type: messageTypeEnum("type").notNull(),

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

export const fragments = pgTable("fragments", {
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

export const messageRelations = relations(messages, ({ one }) => ({
  fragment: one(fragments, {
    fields: [messages.id],
    references: [fragments.messageId],
    relationName: "message_fragment",
  }),
}));

export const fragmentsRelations = relations(fragments, ({ one }) => ({
  message: one(messages, {
    fields: [fragments.messageId],
    references: [messages.id],
    relationName: "message_fragment",
  }),
}));
