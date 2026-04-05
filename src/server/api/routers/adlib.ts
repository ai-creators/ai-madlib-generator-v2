import z from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { createAdlib } from "@/server/services/adlib.service";

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
        top_p: 0.9,
        temperature: 0.8,
      });
      return saveMadlib(
        ctx.db,
        input,
        { model: "gpt-4.1-mini", top_p: 0.9, temperature: 0.8 },
        ctx.session?.user?.id,
      );
    }),
});
