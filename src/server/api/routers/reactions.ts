import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { adlibReactions } from "@/server/db/schema";
import { and, eq, inArray, sql } from "drizzle-orm";
import { ReactionType } from "@/adlib/reactions/reaction-type";

export const reactionsRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        adlibId: z.number(),
        reactionType: z.nativeEnum(ReactionType),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const [reaction] = await ctx.db
        .insert(adlibReactions)
        .values({
          adlibId: input.adlibId,
          reactionType: input.reactionType,
        })
        .returning({ id: adlibReactions.id });

      return reaction?.id;
    }),

  cancel: publicProcedure
    .input(
      z.object({
        id: z.number(),
        adlibId: z.number(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.db
        .delete(adlibReactions)
        .where(
          and(
            eq(adlibReactions.id, input.id),
            eq(adlibReactions.adlibId, input.adlibId),
          ),
        );
    }),

  getCounts: publicProcedure
    .input(z.object({ adlibId: z.number() }))
    .query(async ({ input, ctx }) => {
      return ctx.db
        .select({
          reactionType: adlibReactions.reactionType,
          count: sql<number>`count(*)`.mapWith(Number),
        })
        .from(adlibReactions)
        .where(eq(adlibReactions.adlibId, input.adlibId))
        .groupBy(adlibReactions.reactionType);
    }),

  getCountsBatch: publicProcedure
    .input(z.object({ adlibIds: z.array(z.number()) }))
    .query(async ({ input, ctx }) => {
      if (input.adlibIds.length === 0) return [];

      return ctx.db
        .select({
          adlibId: adlibReactions.adlibId,
          reactionType: adlibReactions.reactionType,
          count: sql<number>`count(*)`.mapWith(Number),
        })
        .from(adlibReactions)
        .where(inArray(adlibReactions.adlibId, input.adlibIds))
        .groupBy(adlibReactions.adlibId, adlibReactions.reactionType);
    }),
});
