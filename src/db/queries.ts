import { db } from "./index";
import {
  dailyAttempts,
  leaderboard,
  type NewDailyAttempt,
  type NewLeaderboardEntry,
} from "./schema";
import { eq, desc, and, sql, asc } from "drizzle-orm";

// Save daily attempt (simplified - no sessions)
export async function saveDailyAttempt(
  userId: string,
  userName: string,
  attemptData: {
    targetColor: string;
    capturedColor: string;
    similarity: number;
    timeTaken: number;
    timeScore: number;
    finalScore: number;
    streak: number;
    gameType?: string;
  },
  date?: string,
): Promise<number> {
  const attemptDate = date || new Date().toISOString().split("T")[0];

  const newAttempt: NewDailyAttempt = {
    userId,
    userName,
    date: attemptDate,
    gameType: attemptData.gameType || "color-mixing",
    targetColor: attemptData.targetColor,
    capturedColor: attemptData.capturedColor,
    similarity: attemptData.similarity.toString(),
    timeTaken: attemptData.timeTaken.toString(),
    timeScore: attemptData.timeScore,
    finalScore: attemptData.finalScore,
    streak: attemptData.streak,
  };

  const result = await db
    .insert(dailyAttempts)
    .values(newAttempt)
    .returning({ id: dailyAttempts.id });

  return result[0].id;
}

// Submit to leaderboard (simplified)
export async function submitToLeaderboard(
  userId: string,
  userName: string,
  score: number,
  timeTaken: number,
  gameType: string = "color-mixing",
  date?: string,
): Promise<{ updated: boolean }> {
  const leaderboardDate = date || new Date().toISOString().split("T")[0];

  // Check if user already has an entry for this date and game type
  const existingEntry = await db
    .select({ score: leaderboard.score })
    .from(leaderboard)
    .where(
      and(
        eq(leaderboard.userId, userId),
        eq(leaderboard.date, leaderboardDate),
        eq(leaderboard.gameType, gameType),
      ),
    )
    .limit(1);

  if (existingEntry.length > 0) {
    if (score > existingEntry[0].score) {
      await db
        .update(leaderboard)
        .set({
          score,
          userName,
          timeTaken: timeTaken.toString(),
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(leaderboard.userId, userId),
            eq(leaderboard.date, leaderboardDate),
            eq(leaderboard.gameType, gameType),
          ),
        );
      return { updated: true };
    }
    return { updated: false };
  }

  // Create new leaderboard entry
  const newEntry: NewLeaderboardEntry = {
    userId,
    userName,
    date: leaderboardDate,
    gameType,
    score,
    timeTaken: timeTaken.toString(),
  };

  await db.insert(leaderboard).values(newEntry);
  return { updated: true };
}

// Get leaderboard for a specific date
export async function getLeaderboard(
  date: string,
  userId?: string,
  gameType: string = "all",
) {
  // Build where conditions
  const whereConditions = [eq(leaderboard.date, date)];
  if (gameType !== "all") {
    whereConditions.push(eq(leaderboard.gameType, gameType));
  }

  // Get top 10 scores for the date and gameType
  const topScores = await db
    .select({
      userId: leaderboard.userId,
      userName: leaderboard.userName,
      score: leaderboard.score,
      gameType: leaderboard.gameType,
      rank: sql<number>`ROW_NUMBER() OVER (ORDER BY ${leaderboard.score} DESC, ${leaderboard.timeTaken} ASC)`.as(
        "rank",
      ),
    })
    .from(leaderboard)
    .where(
      whereConditions.length > 1 ? and(...whereConditions) : whereConditions[0],
    )
    .orderBy(desc(leaderboard.score), asc(leaderboard.timeTaken))
    .limit(10);

  let userRanking = null;

  // If userId provided, get user's ranking
  if (userId) {
    const userWhereConditions = [
      eq(leaderboard.date, date),
      eq(leaderboard.userId, userId),
    ];

    if (gameType !== "all") {
      userWhereConditions.push(eq(leaderboard.gameType, gameType));
    }

    const userRankQuery = await db
      .select({
        userId: leaderboard.userId,
        userName: leaderboard.userName,
        score: leaderboard.score,
        gameType: leaderboard.gameType,
        rank: sql<number>`ROW_NUMBER() OVER (ORDER BY ${leaderboard.score} DESC, ${leaderboard.timeTaken} ASC)`.as(
          "rank",
        ),
      })
      .from(leaderboard)
      .where(and(...userWhereConditions))
      .limit(1);

    if (userRankQuery.length > 0) {
      userRanking = userRankQuery[0];
    }
  }

  // Get total count for the date and gameType
  const totalResult = await db
    .select({
      count: sql<number>`COUNT(*)`.as("count"),
    })
    .from(leaderboard)
    .where(
      whereConditions.length > 1 ? and(...whereConditions) : whereConditions[0],
    );

  const total = totalResult[0]?.count || 0;

  return {
    topScores,
    userRanking,
    total,
  };
}

// Get user's game history (simplified)
export async function getUserGameHistory(userId: string, limit: number = 20) {
  const history = await db
    .select({
      id: dailyAttempts.id,
      score: dailyAttempts.finalScore,
      timeTaken: dailyAttempts.timeTaken,
      targetColor: dailyAttempts.targetColor,
      capturedColor: dailyAttempts.capturedColor,
      similarity: dailyAttempts.similarity,
      date: dailyAttempts.date,
      gameMode: dailyAttempts.gameType, // Always daily for this simplified version
    })
    .from(dailyAttempts)
    .where(eq(dailyAttempts.userId, userId))
    .orderBy(desc(dailyAttempts.createdAt))
    .limit(limit);

  // Calculate light stats
  const totalGames = history.length;
  const bestScore =
    totalGames > 0 ? Math.max(...history.map((h) => h.score)) : 0;
  const averageScore =
    totalGames > 0
      ? history.reduce((sum, h) => sum + h.score, 0) / totalGames
      : 0;

  return {
    history: history.map((h) => ({
      ...h,
      similarity: parseFloat(h.similarity),
      timeTaken: parseFloat(h.timeTaken),
    })),
    stats: {
      totalGames,
      bestScore,
      averageScore,
    },
  };
}

// Get current streak for a user (optimized - just get latest streak value)
export async function getUserStreak(userId: string): Promise<number> {
  const latestAttempt = await db
    .select({
      streak: dailyAttempts.streak,
      date: dailyAttempts.date,
    })
    .from(dailyAttempts)
    .where(eq(dailyAttempts.userId, userId))
    .orderBy(desc(dailyAttempts.date))
    .limit(1);

  if (latestAttempt.length === 0) {
    return 0;
  }

  const { streak, date } = latestAttempt[0];
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  // If the latest attempt was today or yesterday, return the streak
  // Otherwise, the streak has been broken
  if (date === today || date === yesterdayStr) {
    return streak;
  }

  return 0;
}
