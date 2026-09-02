import { createTRPCRouter, publicProcedure } from "../trpc";
import { adlibTones } from "@/server/db/schema";
import { asc, eq } from "drizzle-orm";

export const toneRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db
      .select()
      .from(adlibTones)
      .where(eq(adlibTones.available, true))
      .orderBy(asc(adlibTones.toneLevel));
  }),
});
