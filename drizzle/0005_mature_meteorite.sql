ALTER TABLE "daily_attempts" DROP CONSTRAINT "daily_attempts_user_date_game_unique";--> statement-breakpoint
DROP INDEX "daily_attempts_user_id_idx";--> statement-breakpoint
DROP INDEX "daily_attempts_date_idx";--> statement-breakpoint
DROP INDEX "daily_attempts_game_type_idx";--> statement-breakpoint
DROP INDEX "leaderboard_date_score_idx";--> statement-breakpoint
DROP INDEX "leaderboard_game_type_idx";--> statement-breakpoint
DROP INDEX "leaderboard_rank_idx";--> statement-breakpoint
CREATE INDEX "daily_attempts_user_date_idx" ON "daily_attempts" USING btree ("user_id","date");--> statement-breakpoint
CREATE INDEX "daily_attempts_user_created_idx" ON "daily_attempts" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "daily_attempts_date_game_idx" ON "daily_attempts" USING btree ("date","game_type");--> statement-breakpoint
CREATE INDEX "daily_attempts_streak_idx" ON "daily_attempts" USING btree ("streak");--> statement-breakpoint
CREATE INDEX "leaderboard_date_game_score_time_idx" ON "leaderboard" USING btree ("date","game_type","score","time_taken");--> statement-breakpoint
CREATE INDEX "leaderboard_user_date_game_idx" ON "leaderboard" USING btree ("user_id","date","game_type");--> statement-breakpoint
CREATE INDEX "leaderboard_date_idx" ON "leaderboard" USING btree ("date");--> statement-breakpoint
CREATE INDEX "leaderboard_score_idx" ON "leaderboard" USING btree ("score");--> statement-breakpoint