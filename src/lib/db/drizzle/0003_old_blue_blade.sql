CREATE TABLE IF NOT EXISTS "details" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"contactNumber" text NOT NULL,
	"email" text NOT NULL,
	"address" text NOT NULL,
	"bankName" text NOT NULL,
	"bankAccountNumber" text NOT NULL,
	"bankBranchCode" text NOT NULL,
	"bankHolderName" text NOT NULL,
	"rate" numeric NOT NULL,
	"invoiceNumber" numeric NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "project" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"billedToName" text NOT NULL,
	"address" text NOT NULL
);
