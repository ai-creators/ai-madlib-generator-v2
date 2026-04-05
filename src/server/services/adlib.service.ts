import { type db as Db } from "@/server/db";
import { adlibCategories, adlibs, categories } from "@/server/db/schema";
import { createMadlib, type RequestOptions } from "@/server/lib/openai";
import { upsertCategories } from "./category.service";
import { FeedOption } from "@/feed/feed-option";
import { asc, desc, eq, lt, sql } from "drizzle-orm";
import type { PageResult } from "@/common/page-result";
import type { PageRequest } from "@/common/page-request";

export async function getAdlibs(
  db: typeof Db,
  {
    page,
    size,
    timestamp,
    feedOption,
  }: PageRequest & { feedOption: FeedOption },
) {
  const offset = (page - 1) * size;
  const orderByFn = feedOption === FeedOption.Latest ? desc : asc;

  const categoriesSubquery = db
    .select({
      adlibId: adlibCategories.adlibId,
      names: sql<string[]>`array_agg(${categories.name})`.as("names"),
    })
    .from(adlibCategories)
    .innerJoin(categories, eq(adlibCategories.categoryId, categories.id))
    .groupBy(adlibCategories.adlibId)
    .as("adlib_cats");

  const adlibsList = await db
    .select({
      id: adlibs.id,
      title: adlibs.title,
      prompt: adlibs.prompt,
      text: adlibs.text,
      isHidden: adlibs.isHidden,
      isPg: adlibs.isPg,
      temperature: adlibs.temperature,
      topP: adlibs.topP,
      createdById: adlibs.createdById,
      createdAt: adlibs.createdAt,
      categories: categoriesSubquery.names,
    })
    .from(adlibs)
    .leftJoin(categoriesSubquery, eq(adlibs.id, categoriesSubquery.adlibId))
    .where(lt(adlibs.createdAt, timestamp))
    .orderBy(orderByFn(adlibs.createdAt))
    .limit(size)
    .offset(offset);

  const pageResult: PageResult<(typeof adlibsList)[number]> = {
    page,
    size,
    timestamp,
    data: adlibsList,
  };

  return pageResult;
}

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
