import { sql } from "drizzle-orm";
import { type db as Db } from "@/server/db";
import { categories } from "@/server/db/schema";

export async function upsertCategories(
  db: typeof Db,
  names: string[],
): Promise<number[]> {
  if (names.length === 0) return [];

  const lower = names.map((n) => n.toLowerCase());

  const rows = await db
    .insert(categories)
    .values(lower.map((name) => ({ name })))
    .onConflictDoUpdate({
      target: categories.name,
      set: { name: sql`excluded.name` },
    })
    .returning({ id: categories.id });

  return rows.map((r) => r.id);
}
