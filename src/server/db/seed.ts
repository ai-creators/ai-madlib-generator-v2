import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { sql } from "drizzle-orm";
import { pgTableCreator } from "drizzle-orm/pg-core";

const createTable = pgTableCreator((name) => `ai-madlib-generator-v2_${name}`);

export const featureToggles = createTable("feature_toggles", (d) => ({
  id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
  name: d.varchar({ length: 255 }).notNull(),
  isEnabled: d.boolean().notNull().default(false),
  createdAt: d
    .timestamp({ withTimezone: true })
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
}));

dotenv.config({ path: "./.env" });

if (!("DATABASE_URL" in process.env))
  throw new Error("DATABASE_URL not found on .env");

const main = async () => {
  const client = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
  const db = drizzle(client);
  const data: (typeof featureToggles.$inferInsert)[] = [
    {
      name: "pg_moderation",
      isEnabled: true,
    },
  ];

  console.log("Seed start");
  await db
    .insert(featureToggles)
    .values(data)
    .onConflictDoUpdate({
      target: featureToggles.name,
      set: { isEnabled: sql`excluded."isEnabled"` },
    });
  console.log("Seed completed");
  await client.end();
};

void main();
