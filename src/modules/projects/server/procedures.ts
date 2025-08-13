import { db, messages, projects } from "@/db";
import { inngest } from "@/inngest/client";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { asc, eq } from "drizzle-orm";
import { generateSlug } from "random-word-slugs";
import { z } from "zod";

export const projectsRouter = createTRPCRouter({
  ///////////////////////////////////////
  ///////////////////////////////////////
  /////// getOne
  getOne: baseProcedure
    .input(
      z.object({
        projectId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const { projectId } = input;

      const [fetchedProject] = await db
        .select()
        .from(projects)
        .where(eq(projects.id, projectId));

      if (!fetchedProject) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found",
        });
      }

      return fetchedProject;
    }),

  ///////////////////////////////////////
  ///////////////////////////////////////
  /////// create
  create: baseProcedure
    .input(
      z.object({
        prompt: z
          .string()
          .min(1, { message: "Prompt is required" })
          .max(3000, "Prompt too long"),
      }),
    )
    .mutation(async ({ input }) => {
      const { prompt } = input;
      const [createdProject] = await db
        .insert(projects)
        .values({
          name: generateSlug(2, { format: "kebab" }),
        })
        .returning({
          id: projects.id,
        });
      console.log({ prompt });

      if (!createdProject) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Project couldn't created",
        });
      }

      const [createdMessage] = await db
        .insert(messages)
        .values({
          projectId: createdProject.id,
          content: prompt,
          role: "USER",
          type: "RESULT",
        })
        .returning({
          id: messages.id,
        });

      if (!createdMessage) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Message couldn't created",
        });
      }

      await inngest.send({
        name: "code-agent/run",
        data: {
          prompt: prompt,
          projectId: createdProject.id,
        },
      });

      return createdProject;
    }),

  ///////////////////////////////////////
  ///////////////////////////////////////
  /////// getMany
  getMany: baseProcedure.query(async () => {
    const fetchedProjects = await db
      .select()
      .from(projects)
      .leftJoin(messages, eq(messages.projectId, projects.id))
      .orderBy(asc(projects.updatedAt));

    return fetchedProjects;
  }),
});
