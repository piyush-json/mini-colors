CREATE TABLE "daily_attempts" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(50) NOT NULL,
	"user_name" varchar(100) NOT NULL,
	"date" varchar(10) NOT NULL,
	"target_color" varchar(50) NOT NULL,
	"captured_color" varchar(50) NOT NULL,
	"similarity" numeric(5, 2) NOT NULL,
	"time_taken" numeric(8, 3) NOT NULL,
	"time_score" integer NOT NULL,
	"final_score" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "daily_attempts_user_date_unique" UNIQUE("user_id","date")
);
--> statement-breakpoint
CREATE TABLE "leaderboard" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(50) NOT NULL,
	"user_name" varchar(100) NOT NULL,
	"date" varchar(10) NOT NULL,
	"score" integer NOT NULL,
	"rank" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "leaderboard_user_date_unique" UNIQUE("user_id","date")
);
--> statement-breakpoint
CREATE INDEX "daily_attempts_user_id_idx" ON "daily_attempts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "daily_attempts_date_idx" ON "daily_attempts" USING btree ("date");--> statement-breakpoint
CREATE INDEX "daily_attempts_final_score_idx" ON "daily_attempts" USING btree ("final_score");--> statement-breakpoint
CREATE INDEX "leaderboard_date_score_idx" ON "leaderboard" USING btree ("date","score");--> statement-breakpoint
CREATE INDEX "leaderboard_rank_idx" ON "leaderboard" USING btree ("rank");