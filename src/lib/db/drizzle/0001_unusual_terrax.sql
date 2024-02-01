CREATE TABLE IF NOT EXISTS "kv" (
	"key" text PRIMARY KEY NOT NULL,
	"value" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "time" (
	"id" serial PRIMARY KEY NOT NULL,
	"date" date NOT NULL,
	"hours" numeric NOT NULL,
	"description" text NOT NULL
);
--> statement-breakpoint
DROP TABLE "myTableName";