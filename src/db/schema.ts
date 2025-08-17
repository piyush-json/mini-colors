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

// Simplified daily attempts table - one attempt per user per day per game type
export const dailyAttempts = pgTable(
  "daily_attempts",
  {
    id: serial("id").primaryKey(),
    userId: varchar("user_id", { length: 50 }).notNull(), // Direct FID or user identifier
    userName: varchar("user_name", { length: 100 }).notNull(),
    date: varchar("date", { length: 10 }).notNull(), // YYYY-MM-DD format
    gameType: varchar("game_type", { length: 20 })
      .notNull()
      .default("color-mixing"), // "color-mixing" or "finding"
    targetColor: varchar("target_color", { length: 50 }).notNull(),
    capturedColor: varchar("captured_color", { length: 50 }).notNull(),
    similarity: decimal("similarity", { precision: 5, scale: 2 }).notNull(), // 0.00 to 100.00
    timeTaken: decimal("time_taken", { precision: 8, scale: 3 }).notNull(), // seconds with milliseconds
    timeScore: integer("time_score").notNull(),
    finalScore: integer("final_score").notNull(),
    streak: integer("streak").notNull().default(1), // Current streak when this attempt was made
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    unique("daily_attempts_user_date_game_unique").on(
      table.userId,
      table.date,
      table.gameType,
    ),
    index("daily_attempts_user_id_idx").on(table.userId),
    index("daily_attempts_date_idx").on(table.date),
    index("daily_attempts_game_type_idx").on(table.gameType),
    index("daily_attempts_final_score_idx").on(table.finalScore),
  ],
);

// Simplified leaderboard - just the best scores per day per game type
export const leaderboard = pgTable(
  "leaderboard",
  {
    id: serial("id").primaryKey(),
    userId: varchar("user_id", { length: 50 }).notNull(), // Direct FID or user identifier
    userName: varchar("user_name", { length: 100 }).notNull(),
    date: varchar("date", { length: 10 }).notNull(), // YYYY-MM-DD format
    gameType: varchar("game_type", { length: 20 })
      .notNull()
      .default("color-mixing"), // "color-mixing" or "finding"
    score: integer("score").notNull(),
    rank: integer("rank"), // Daily rank
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    unique("leaderboard_user_date_game_unique").on(
      table.userId,
      table.date,
      table.gameType,
    ),
    index("leaderboard_date_score_idx").on(table.date, table.score),
    index("leaderboard_game_type_idx").on(table.gameType),
    index("leaderboard_rank_idx").on(table.rank),
  ],
);

// Export types for TypeScript
export type DailyAttempt = typeof dailyAttempts.$inferSelect;
export type NewDailyAttempt = typeof dailyAttempts.$inferInsert;
export type LeaderboardEntry = typeof leaderboard.$inferSelect;
export type NewLeaderboardEntry = typeof leaderboard.$inferInsert;
