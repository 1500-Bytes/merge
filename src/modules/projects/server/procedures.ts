import { db, messages, projects } from "@/db";
import { inngest } from "@/inngest/client";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { desc, eq, lt } from "drizzle-orm";
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
  /////// getMany - Updated for infinite query support
  getMany: baseProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(20),
        cursor: z.string().nullish(), // cursor for infinite queries
      }),
    )
    .query(async ({ input }) => {
      const { limit, cursor } = input;

      // Build the where condition based on cursor
      const whereCondition = cursor
        ? lt(projects.updatedAt, new Date(cursor))
        : undefined;

      const fetchedProjects = await db
        .select({
          id: projects.id,
          name: projects.name,
          createdAt: projects.createdAt,
          updatedAt: projects.updatedAt,
        })
        .from(projects)
        .where(whereCondition)
        .orderBy(desc(projects.updatedAt))
        .limit(limit + 1); // Get one extra to determine if there are more

      // Determine next cursor
      let nextCursor: string | undefined = undefined;
      if (fetchedProjects.length > limit) {
        const nextItem = fetchedProjects.pop(); // Remove the extra item
        nextCursor = nextItem!.updatedAt.toISOString();
      }

      return {
        projects: fetchedProjects,
        nextCursor,
      };
    }),
});
