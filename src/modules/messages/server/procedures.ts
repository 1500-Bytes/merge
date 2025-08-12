import { db, fragments, messages } from "@/db";
import { inngest } from "@/inngest/client";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { asc, eq } from "drizzle-orm";
import { z } from "zod";

export const messagesRouter = createTRPCRouter({
  ///////////////////////////////////////
  ///////////////////////////////////////
  /////// create
  create: baseProcedure
    .input(
      z.object({
        prompt: z
          .string()
          .min(1, { message: "Prompt is required" })
          .max(3000, { message: "Prompt too long" }),
        projectId: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const { prompt, projectId } = input;

      const [createdMssage] = await db
        .insert(messages)
        .values({
          projectId: projectId,
          content: prompt,
          role: "USER",
          type: "RESULT",
        })
        .returning();

      if (!createdMssage) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Message couldn't created",
        });
      }

      await inngest.send({
        name: "code-agent/run",
        data: {
          projectId: projectId,
          prompt: prompt,
        },
      });

      return createdMssage;
    }),

  ///////////////////////////////////////
  ///////////////////////////////////////
  /////// getMany
  getMany: baseProcedure
    .input(
      z.object({
        projectId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const { projectId } = input;

      const fetchedMessages = await db
        .select()
        .from(messages)
        .where(eq(messages.projectId, projectId))
        .leftJoin(fragments, eq(fragments.messageId, messages.id))
        .orderBy(asc(messages.createdAt));

      if (!fetchedMessages) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Messages not found",
        });
      }

      return fetchedMessages;
    }),
});
