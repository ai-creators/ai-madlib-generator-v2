DROP INDEX "categories_name_idx";--> statement-breakpoint
CREATE UNIQUE INDEX "categories_name_idx" ON "ai-madlib-generator-v2_categories" USING btree ("name");