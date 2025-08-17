ALTER TABLE "daily_attempts" DROP CONSTRAINT "daily_attempts_user_date_unique";--> statement-breakpoint
ALTER TABLE "leaderboard" DROP CONSTRAINT "leaderboard_user_date_unique";--> statement-breakpoint
ALTER TABLE "daily_attempts" ADD COLUMN "game_type" varchar(20) DEFAULT 'color-mixing' NOT NULL;--> statement-breakpoint
ALTER TABLE "leaderboard" ADD COLUMN "game_type" varchar(20) DEFAULT 'color-mixing' NOT NULL;--> statement-breakpoint
CREATE INDEX "daily_attempts_game_type_idx" ON "daily_attempts" USING btree ("game_type");--> statement-breakpoint
CREATE INDEX "leaderboard_game_type_idx" ON "leaderboard" USING btree ("game_type");--> statement-breakpoint
ALTER TABLE "daily_attempts" ADD CONSTRAINT "daily_attempts_user_date_game_unique" UNIQUE("user_id","date","game_type");--> statement-breakpoint
ALTER TABLE "leaderboard" ADD CONSTRAINT "leaderboard_user_date_game_unique" UNIQUE("user_id","date","game_type");