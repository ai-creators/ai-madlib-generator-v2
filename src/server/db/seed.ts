/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { featureToggles } from "./schema";
import { env } from "@/env";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL not found on .env.development");
}

const main = async () => {
  const connectionString = env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is not defined in environment variables.");
  }

  const client = new Pool({
    connectionString,
  });

  try {
    const db = drizzle(client);
    const featureTogglesData: (typeof featureToggles.$inferInsert)[] = [
      {
        name: "pg_moderation",
        isEnabled: true,
        createdAt: new Date(),
      },
    ];

    console.log("Seed start");
    await db.insert(featureToggles).values(featureTogglesData);
    console.log("Seed done");
  } catch (error) {
    console.error("Seed error:", error);
    throw error;
  } finally {
    await client.end();
  }
};

main().catch((error) => {
  console.error("Failed to run seed:", error);
  process.exit(1);
});
