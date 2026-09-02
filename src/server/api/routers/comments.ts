import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { adlibComments } from "@/server/db/schema";
import { and, desc, eq } from "drizzle-orm";

export const commentsRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        adlibId: z.number(),
        body: z.string().trim().min(1).max(1000),
        authorName: z.string().trim().max(50).optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const [comment] = await ctx.db
        .insert(adlibComments)
        .values({
          adlibId: input.adlibId,
          body: input.body,
          authorName: input.authorName ?? null,
        })
        .returning({ id: adlibComments.id });

      if (!comment) {
        throw new Error("Failed to create comment");
      }

      return comment.id;
    }),

  getByAdlibId: publicProcedure
    .input(z.object({ adlibId: z.number() }))
    .query(async ({ input, ctx }) => {
      return ctx.db.query.adlibComments.findMany({
        where: and(
          eq(adlibComments.adlibId, input.adlibId),
          eq(adlibComments.isHidden, false),
        ),
        orderBy: desc(adlibComments.createdAt),
      });
    }),
});
