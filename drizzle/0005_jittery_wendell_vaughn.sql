ALTER TABLE "ai-madlib-generator-v2_accounts" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "ai-madlib-generator-v2_sessions" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "ai-madlib-generator-v2_users" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "ai-madlib-generator-v2_verification_tokens" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "ai-madlib-generator-v2_accounts" CASCADE;--> statement-breakpoint
DROP TABLE "ai-madlib-generator-v2_sessions" CASCADE;--> statement-breakpoint
DROP TABLE "ai-madlib-generator-v2_users" CASCADE;--> statement-breakpoint
DROP TABLE "ai-madlib-generator-v2_verification_tokens" CASCADE;--> statement-breakpoint
ALTER TABLE "ai-madlib-generator-v2_adlib_results" DROP COLUMN "createdById";--> statement-breakpoint
ALTER TABLE "ai-madlib-generator-v2_adlibs" DROP COLUMN "createdById";