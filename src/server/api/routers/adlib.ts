import z from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { saveMadlib } from "@/server/services/adlib.service";
import { createMadlib } from "@/server/lib/openai";

const defaultTemperature = 0.8;
const defaultTopP = 0.9;

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

      return saveMadlib(ctx.db, {
        madlibResponse,
        temperature: defaultTemperature,
        topP: defaultTopP,
        userId: ctx.session?.user?.id,
        prompt: input.prompt,
      });
    }),
});
