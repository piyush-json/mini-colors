import {
  pgTable,
  serial,
  varchar,
  integer,
  timestamp,
  decimal,
  index,
  unique,
} from "drizzle-orm/pg-core";

// Simplified daily attempts table - one attempt per user per day
export const dailyAttempts = pgTable(
  "daily_attempts",
  {
    id: serial("id").primaryKey(),
    userId: varchar("user_id", { length: 50 }).notNull(), // Direct FID or user identifier
    userName: varchar("user_name", { length: 100 }).notNull(),
    date: varchar("date", { length: 10 }).notNull(), // YYYY-MM-DD format
    targetColor: varchar("target_color", { length: 50 }).notNull(),
    capturedColor: varchar("captured_color", { length: 50 }).notNull(),
    similarity: decimal("similarity", { precision: 5, scale: 2 }).notNull(), // 0.00 to 100.00
    timeTaken: decimal("time_taken", { precision: 8, scale: 3 }).notNull(), // seconds with milliseconds
    timeScore: integer("time_score").notNull(),
    finalScore: integer("final_score").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    unique("daily_attempts_user_date_unique").on(table.userId, table.date),
    index("daily_attempts_user_id_idx").on(table.userId),
    index("daily_attempts_date_idx").on(table.date),
    index("daily_attempts_final_score_idx").on(table.finalScore),
  ],
);

// Simplified leaderboard - just the best scores per day
export const leaderboard = pgTable(
  "leaderboard",
  {
    id: serial("id").primaryKey(),
    userId: varchar("user_id", { length: 50 }).notNull(), // Direct FID or user identifier
    userName: varchar("user_name", { length: 100 }).notNull(),
    date: varchar("date", { length: 10 }).notNull(), // YYYY-MM-DD format
    score: integer("score").notNull(),
    rank: integer("rank"), // Daily rank
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    unique("leaderboard_user_date_unique").on(table.userId, table.date),
    index("leaderboard_date_score_idx").on(table.date, table.score),
    index("leaderboard_rank_idx").on(table.rank),
  ],
);

// Export types for TypeScript
export type DailyAttempt = typeof dailyAttempts.$inferSelect;
export type NewDailyAttempt = typeof dailyAttempts.$inferInsert;
export type LeaderboardEntry = typeof leaderboard.$inferSelect;
export type NewLeaderboardEntry = typeof leaderboard.$inferInsert;
