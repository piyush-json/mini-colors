CREATE TABLE "notification_details" (
	"id" serial PRIMARY KEY NOT NULL,
	"fid" integer NOT NULL,
	"notification_details" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "notification_details_fid_unique" UNIQUE("fid")
);
--> statement-breakpoint
CREATE INDEX "notification_details_fid_idx" ON "notification_details" USING btree ("fid");