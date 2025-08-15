import {
  pgTable,
  serial,
  varchar,
  integer,
  timestamp,
  uuid,
  decimal,
  boolean,
  index,
  unique,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Users table for tracking players
export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 100 }).notNull(),
    userKey: varchar("user_key", { length: 200 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [index("user_key_idx").on(table.userKey)],
);

// Daily colors table - stores the daily color challenges
export const dailyColors = pgTable(
  "daily_colors",
  {
    id: serial("id").primaryKey(),
    date: varchar("date", { length: 10 }).notNull(), // YYYY-MM-DD format
    color: varchar("color", { length: 50 }).notNull(), // hex or hsl color value
    hue: integer("hue").notNull(),
    saturation: integer("saturation").notNull(),
    lightness: integer("lightness").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [unique("daily_colors_date_unique").on(table.date)],
);

// Game sessions table - tracks individual game sessions
export const gameSessions = pgTable(
  "game_sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .references(() => users.id)
      .notNull(),
    gameMode: varchar("game_mode", { length: 20 }).notNull(), // 'daily', 'practice', 'normal', 'mixing'
    targetColor: varchar("target_color", { length: 50 }).notNull(),
    dailyColorId: integer("daily_color_id").references(() => dailyColors.id), // Only for daily mode
    startedAt: timestamp("started_at").defaultNow().notNull(),
    completedAt: timestamp("completed_at"),
    isCompleted: boolean("is_completed").default(false).notNull(),
  },
  (table) => [
    index("game_sessions_user_id_idx").on(table.userId),
    index("game_sessions_game_mode_idx").on(table.gameMode),
    index("game_sessions_daily_color_id_idx").on(table.dailyColorId),
    index("game_sessions_started_at_idx").on(table.startedAt),
  ],
);

// Game attempts table - tracks individual color capture attempts
export const gameAttempts = pgTable(
  "game_attempts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    sessionId: uuid("session_id")
      .references(() => gameSessions.id)
      .notNull(),
    userId: uuid("user_id")
      .references(() => users.id)
      .notNull(),
    attemptNumber: integer("attempt_number").notNull(), // 1, 2, 3, etc.
    capturedColor: varchar("captured_color", { length: 50 }).notNull(),
    targetColor: varchar("target_color", { length: 50 }).notNull(),
    similarity: decimal("similarity", { precision: 5, scale: 2 }).notNull(), // 0.00 to 100.00
    timeTaken: decimal("time_taken", { precision: 8, scale: 3 }).notNull(), // seconds with milliseconds
    timeScore: integer("time_score").notNull(),
    finalScore: integer("final_score").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("game_attempts_session_id_idx").on(table.sessionId),
    index("game_attempts_user_id_idx").on(table.userId),
    index("game_attempts_final_score_idx").on(table.finalScore),
    index("game_attempts_created_at_idx").on(table.createdAt),
  ],
);

// Daily stats table - aggregated daily statistics per user
export const dailyStats = pgTable(
  "daily_stats",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .references(() => users.id)
      .notNull(),
    date: varchar("date", { length: 10 }).notNull(), // YYYY-MM-DD format
    totalAttempts: integer("total_attempts").default(0).notNull(),
    bestScore: integer("best_score").default(0).notNull(),
    averageScore: decimal("average_score", { precision: 8, scale: 2 })
      .default("0")
      .notNull(),
    totalTimePlayed: decimal("total_time_played", { precision: 10, scale: 3 })
      .default("0")
      .notNull(), // total seconds
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    unique("daily_stats_user_date_unique").on(table.userId, table.date),
    index("daily_stats_best_score_idx").on(table.bestScore),
    index("daily_stats_date_idx").on(table.date),
  ],
);

// Leaderboard entries table - best scores per user per day for leaderboard
export const leaderboardEntries = pgTable(
  "leaderboard_entries",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .references(() => users.id)
      .notNull(),
    userName: varchar("user_name", { length: 100 }).notNull(),
    date: varchar("date", { length: 10 }).notNull(), // YYYY-MM-DD format
    score: integer("score").notNull(),
    attemptId: uuid("attempt_id")
      .references(() => gameAttempts.id)
      .notNull(), // Reference to the winning attempt
    rank: integer("rank"), // Daily rank, updated by triggers or cron jobs
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    unique("leaderboard_user_date_unique").on(table.userId, table.date),
    index("leaderboard_score_idx").on(table.score),
    index("leaderboard_date_idx").on(table.date),
    index("leaderboard_rank_idx").on(table.rank),
  ],
);

// Color mixing attempts table - for color mixing game mode
export const colorMixingAttempts = pgTable(
  "color_mixing_attempts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    sessionId: uuid("session_id")
      .references(() => gameSessions.id)
      .notNull(),
    userId: uuid("user_id")
      .references(() => users.id)
      .notNull(),
    targetColor: varchar("target_color", { length: 50 }).notNull(),
    color1: varchar("color1", { length: 50 }).notNull(),
    color2: varchar("color2", { length: 50 }).notNull(),
    color3: varchar("color3", { length: 50 }), // Optional third color
    mixedColor: varchar("mixed_color", { length: 50 }).notNull(),
    mixingMethod: varchar("mixing_method", { length: 20 }).notNull(), // 'additive', 'subtractive', etc.
    similarity: decimal("similarity", { precision: 5, scale: 2 }).notNull(),
    score: integer("score").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("color_mixing_session_id_idx").on(table.sessionId),
    index("color_mixing_user_id_idx").on(table.userId),
    index("color_mixing_score_idx").on(table.score),
  ],
);

// User achievements table - track player achievements
export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: varchar("description", { length: 255 }).notNull(),
  category: varchar("category", { length: 50 }).notNull(), // 'accuracy', 'speed', 'consistency', etc.
  requirement: varchar("requirement", { length: 255 }).notNull(), // JSON string describing requirement
  points: integer("points").default(0).notNull(),
  icon: varchar("icon", { length: 50 }), // icon name or emoji
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// User achievements junction table
export const userAchievements = pgTable(
  "user_achievements",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .references(() => users.id)
      .notNull(),
    achievementId: integer("achievement_id")
      .references(() => achievements.id)
      .notNull(),
    unlockedAt: timestamp("unlocked_at").defaultNow().notNull(),
    progress: decimal("progress", { precision: 5, scale: 2 })
      .default("0")
      .notNull(), // 0-100
  },
  (table) => [
    unique("user_achievement_unique").on(table.userId, table.achievementId),
    index("user_achievements_user_id_idx").on(table.userId),
  ],
);

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  gameSessions: many(gameSessions),
  gameAttempts: many(gameAttempts),
  dailyStats: many(dailyStats),
  leaderboardEntries: many(leaderboardEntries),
  colorMixingAttempts: many(colorMixingAttempts),
  userAchievements: many(userAchievements),
}));

export const dailyColorsRelations = relations(dailyColors, ({ many }) => ({
  gameSessions: many(gameSessions),
}));

export const gameSessionsRelations = relations(
  gameSessions,
  ({ one, many }) => ({
    user: one(users, {
      fields: [gameSessions.userId],
      references: [users.id],
    }),
    dailyColor: one(dailyColors, {
      fields: [gameSessions.dailyColorId],
      references: [dailyColors.id],
    }),
    attempts: many(gameAttempts),
    colorMixingAttempts: many(colorMixingAttempts),
  }),
);

export const gameAttemptsRelations = relations(
  gameAttempts,
  ({ one, many }) => ({
    session: one(gameSessions, {
      fields: [gameAttempts.sessionId],
      references: [gameSessions.id],
    }),
    user: one(users, {
      fields: [gameAttempts.userId],
      references: [users.id],
    }),
    leaderboardEntries: many(leaderboardEntries),
  }),
);

export const dailyStatsRelations = relations(dailyStats, ({ one }) => ({
  user: one(users, {
    fields: [dailyStats.userId],
    references: [users.id],
  }),
}));

export const leaderboardEntriesRelations = relations(
  leaderboardEntries,
  ({ one }) => ({
    user: one(users, {
      fields: [leaderboardEntries.userId],
      references: [users.id],
    }),
    attempt: one(gameAttempts, {
      fields: [leaderboardEntries.attemptId],
      references: [gameAttempts.id],
    }),
  }),
);

export const colorMixingAttemptsRelations = relations(
  colorMixingAttempts,
  ({ one }) => ({
    session: one(gameSessions, {
      fields: [colorMixingAttempts.sessionId],
      references: [gameSessions.id],
    }),
    user: one(users, {
      fields: [colorMixingAttempts.userId],
      references: [users.id],
    }),
  }),
);

export const achievementsRelations = relations(achievements, ({ many }) => ({
  userAchievements: many(userAchievements),
}));

export const userAchievementsRelations = relations(
  userAchievements,
  ({ one }) => ({
    user: one(users, {
      fields: [userAchievements.userId],
      references: [users.id],
    }),
    achievement: one(achievements, {
      fields: [userAchievements.achievementId],
      references: [achievements.id],
    }),
  }),
);

// Export types for TypeScript
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type DailyColor = typeof dailyColors.$inferSelect;
export type NewDailyColor = typeof dailyColors.$inferInsert;
export type GameSession = typeof gameSessions.$inferSelect;
export type NewGameSession = typeof gameSessions.$inferInsert;
export type GameAttempt = typeof gameAttempts.$inferSelect;
export type NewGameAttempt = typeof gameAttempts.$inferInsert;
export type DailyStat = typeof dailyStats.$inferSelect;
export type NewDailyStat = typeof dailyStats.$inferInsert;
export type LeaderboardEntry = typeof leaderboardEntries.$inferSelect;
export type NewLeaderboardEntry = typeof leaderboardEntries.$inferInsert;
export type ColorMixingAttempt = typeof colorMixingAttempts.$inferSelect;
export type NewColorMixingAttempt = typeof colorMixingAttempts.$inferInsert;
export type Achievement = typeof achievements.$inferSelect;
export type NewAchievement = typeof achievements.$inferInsert;
export type UserAchievement = typeof userAchievements.$inferSelect;
export type NewUserAchievement = typeof userAchievements.$inferInsert;
