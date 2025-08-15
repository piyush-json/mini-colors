CREATE TABLE "achievements" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" varchar(255) NOT NULL,
	"category" varchar(50) NOT NULL,
	"requirement" varchar(255) NOT NULL,
	"points" integer DEFAULT 0 NOT NULL,
	"icon" varchar(50),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "color_mixing_attempts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"target_color" varchar(50) NOT NULL,
	"color1" varchar(50) NOT NULL,
	"color2" varchar(50) NOT NULL,
	"color3" varchar(50),
	"mixed_color" varchar(50) NOT NULL,
	"mixing_method" varchar(20) NOT NULL,
	"similarity" numeric(5, 2) NOT NULL,
	"score" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "daily_colors" (
	"id" serial PRIMARY KEY NOT NULL,
	"date" varchar(10) NOT NULL,
	"color" varchar(50) NOT NULL,
	"hue" integer NOT NULL,
	"saturation" integer NOT NULL,
	"lightness" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "daily_colors_date_unique" UNIQUE("date")
);
--> statement-breakpoint
CREATE TABLE "daily_stats" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"date" varchar(10) NOT NULL,
	"total_attempts" integer DEFAULT 0 NOT NULL,
	"best_score" integer DEFAULT 0 NOT NULL,
	"average_score" numeric(8, 2) DEFAULT '0' NOT NULL,
	"total_time_played" numeric(10, 3) DEFAULT '0' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "daily_stats_user_date_unique" UNIQUE("user_id","date")
);
--> statement-breakpoint
CREATE TABLE "game_attempts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"attempt_number" integer NOT NULL,
	"captured_color" varchar(50) NOT NULL,
	"target_color" varchar(50) NOT NULL,
	"similarity" numeric(5, 2) NOT NULL,
	"time_taken" numeric(8, 3) NOT NULL,
	"time_score" integer NOT NULL,
	"final_score" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "game_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"game_mode" varchar(20) NOT NULL,
	"target_color" varchar(50) NOT NULL,
	"daily_color_id" integer,
	"started_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp,
	"is_completed" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "leaderboard_entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"user_name" varchar(100) NOT NULL,
	"date" varchar(10) NOT NULL,
	"score" integer NOT NULL,
	"attempt_id" uuid NOT NULL,
	"rank" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "leaderboard_user_date_unique" UNIQUE("user_id","date")
);
--> statement-breakpoint
CREATE TABLE "user_achievements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"achievement_id" integer NOT NULL,
	"unlocked_at" timestamp DEFAULT now() NOT NULL,
	"progress" numeric(5, 2) DEFAULT '0' NOT NULL,
	CONSTRAINT "user_achievement_unique" UNIQUE("user_id","achievement_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"user_key" varchar(200) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "color_mixing_attempts" ADD CONSTRAINT "color_mixing_attempts_session_id_game_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."game_sessions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "color_mixing_attempts" ADD CONSTRAINT "color_mixing_attempts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "daily_stats" ADD CONSTRAINT "daily_stats_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "game_attempts" ADD CONSTRAINT "game_attempts_session_id_game_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."game_sessions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "game_attempts" ADD CONSTRAINT "game_attempts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "game_sessions" ADD CONSTRAINT "game_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "game_sessions" ADD CONSTRAINT "game_sessions_daily_color_id_daily_colors_id_fk" FOREIGN KEY ("daily_color_id") REFERENCES "public"."daily_colors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leaderboard_entries" ADD CONSTRAINT "leaderboard_entries_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leaderboard_entries" ADD CONSTRAINT "leaderboard_entries_attempt_id_game_attempts_id_fk" FOREIGN KEY ("attempt_id") REFERENCES "public"."game_attempts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_achievements" ADD CONSTRAINT "user_achievements_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_achievements" ADD CONSTRAINT "user_achievements_achievement_id_achievements_id_fk" FOREIGN KEY ("achievement_id") REFERENCES "public"."achievements"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "color_mixing_session_id_idx" ON "color_mixing_attempts" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX "color_mixing_user_id_idx" ON "color_mixing_attempts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "color_mixing_score_idx" ON "color_mixing_attempts" USING btree ("score");--> statement-breakpoint
CREATE INDEX "daily_stats_best_score_idx" ON "daily_stats" USING btree ("best_score");--> statement-breakpoint
CREATE INDEX "daily_stats_date_idx" ON "daily_stats" USING btree ("date");--> statement-breakpoint
CREATE INDEX "game_attempts_session_id_idx" ON "game_attempts" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX "game_attempts_user_id_idx" ON "game_attempts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "game_attempts_final_score_idx" ON "game_attempts" USING btree ("final_score");--> statement-breakpoint
CREATE INDEX "game_attempts_created_at_idx" ON "game_attempts" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "game_sessions_user_id_idx" ON "game_sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "game_sessions_game_mode_idx" ON "game_sessions" USING btree ("game_mode");--> statement-breakpoint
CREATE INDEX "game_sessions_daily_color_id_idx" ON "game_sessions" USING btree ("daily_color_id");--> statement-breakpoint
CREATE INDEX "game_sessions_started_at_idx" ON "game_sessions" USING btree ("started_at");--> statement-breakpoint
CREATE INDEX "leaderboard_score_idx" ON "leaderboard_entries" USING btree ("score");--> statement-breakpoint
CREATE INDEX "leaderboard_date_idx" ON "leaderboard_entries" USING btree ("date");--> statement-breakpoint
CREATE INDEX "leaderboard_rank_idx" ON "leaderboard_entries" USING btree ("rank");--> statement-breakpoint
CREATE INDEX "user_achievements_user_id_idx" ON "user_achievements" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_key_idx" ON "users" USING btree ("user_key");