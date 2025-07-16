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
  create: baseProcedure.input(z.object({
    value: z.string()
      .min(1, { message: 'Message is required' })
  })).mutation(async ({ input }) => {
    const { value } = input

    const [createdMssage] = await db.insert(messages)
      .values({
        content: value,
        role: "USER",
        type: "RESULT",
      }).returning()

    if (!createdMssage) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Message couldn't created"
      })
    }

    await inngest.send({
      name: "code-agent/run",
      data: {
        value: value
      }
    })

    return createdMssage
  }),

  ///////////////////////////////////////
  ///////////////////////////////////////
  /////// getMany
  getMany: baseProcedure.query(async () => {
    const fetchedMessages = await db.select()
      .from(messages)
      .leftJoin(fragments, eq(fragments.messageId, messages.id))
      .orderBy(asc(messages.updatedAt))


    return fetchedMessages
  })
});
