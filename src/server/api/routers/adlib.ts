import z from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { getAdlibs, saveMadlib } from "@/server/services/adlib.service";
import { createMadlib, moderateForPg } from "@/server/lib/openai";
import { FeedOption } from "@/feed/feed-option";
import { featureToggles } from "@/server/db/schema";
import { desc, eq } from "drizzle-orm";

const defaultTemperature = 0.8;
const defaultTopP = 0.9;
const pgModerationToggleName = "pg_moderation";

export const adlibRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        prompt: z.string().min(1).max(255),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const madlibResponse = await createMadlib(input.prompt, {
        model: "gpt-4.1-mini",
        top_p: defaultTopP,
        temperature: defaultTemperature,
      });

      let isPg = madlibResponse.isPg;

      const [pgModerationToggle] = await ctx.db
        .select({ isEnabled: featureToggles.isEnabled })
        .from(featureToggles)
        .where(eq(featureToggles.name, pgModerationToggleName))
        .orderBy(desc(featureToggles.createdAt))
        .limit(1);

      if (pgModerationToggle?.isEnabled) {
        try {
          const moderation = await moderateForPg([
            input.prompt,
            madlibResponse.title,
            madlibResponse.madlib,
          ]);

          isPg = moderation.isPg;
        } catch (error) {
          console.error("PG moderation check failed", error);
        }
      }

      return saveMadlib(ctx.db, {
        madlibResponse: {
          ...madlibResponse,
          isPg,
        },
        temperature: defaultTemperature,
        topP: defaultTopP,
        userId: ctx.session?.user?.id,
        prompt: input.prompt,
      });
    }),

  getFeed: publicProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        size: z.number().min(1).max(100).default(10),
        timestamp: z.date().default(() => new Date()),
        feedOption: z
          .enum(Object.values(FeedOption) as [string, ...string[]])
          .default(FeedOption.Latest),
      }),
    )
    .query(async ({ input, ctx }) => {
      return getAdlibs(ctx.db, {
        page: input.page,
        size: input.size,
        timestamp: input.timestamp,
        feedOption: input.feedOption as FeedOption,
      });
    }),
});
