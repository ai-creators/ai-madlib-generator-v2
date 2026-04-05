import { type db as Db } from "@/server/db";
import { adlibCategories, adlibs } from "@/server/db/schema";
import { createMadlib, type RequestOptions } from "@/server/lib/openai";
import { upsertCategories } from "./category.service";

export async function saveMadlib(
  db: typeof Db,
  input: { prompt: string },
  options: RequestOptions,
  userId?: string | null,
): Promise<number> {
  const categoryIds = await upsertCategories(db, madlibResponse.categories);

  const [madlib] = await db
    .insert(adlibs)
    .values({
      title: madlibResponse.title,
      prompt: input.prompt,
      text: madlibResponse.madlib,
      isPg: madlibResponse.isPg,
      temperature: options.temperature ?? 0.8,
      topP: options.top_p ?? 0.9,
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
