import { type db as Db } from "@/server/db";
import { adlibCategories, adlibs } from "@/server/db/schema";
import { createMadlib, type RequestOptions } from "@/server/lib/openai";
import { upsertCategories } from "./category.service";

export async function saveMadlib(
  db: typeof Db,
  {
    madlibResponse,
    temperature,
    topP,
    userId,
    prompt,
  }: {
    madlibResponse: Awaited<ReturnType<typeof createMadlib>>;
    temperature: number;
    topP: number;
    userId?: string | null;
    prompt: string;
  },
): Promise<number> {
  const categoryIds = await upsertCategories(db, madlibResponse.categories);

  const [madlib] = await db
    .insert(adlibs)
    .values({
      title: madlibResponse.title,
      prompt,
      text: madlibResponse.madlib,
      isPg: madlibResponse.isPg,
      temperature,
      topP,
      createdById: userId ?? null,
    })
    .returning({ id: adlibs.id });

  if (!madlib) {
    throw new Error("Failed to insert adlib");
  }

  if (categoryIds.length > 0) {
    await db
      .insert(adlibCategories)
      .values(
        categoryIds.map((categoryId) => ({ adlibId: madlib.id, categoryId })),
      )
      .onConflictDoNothing();
  }

  return madlib.id;
}
