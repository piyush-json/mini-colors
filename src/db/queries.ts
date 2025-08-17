import { db } from "./index";
import {
  dailyAttempts,
  leaderboard,
  type NewDailyAttempt,
  type NewLeaderboardEntry,
} from "./schema";
import { eq, desc, and, sql } from "drizzle-orm";

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
  },
  date?: string,
): Promise<number> {
  const attemptDate = date || new Date().toISOString().split("T")[0];

  const newAttempt: NewDailyAttempt = {
    userId,
    userName,
    date: attemptDate,
    targetColor: attemptData.targetColor,
    capturedColor: attemptData.capturedColor,
    similarity: attemptData.similarity.toString(),
    timeTaken: attemptData.timeTaken.toString(),
    timeScore: attemptData.timeScore,
    finalScore: attemptData.finalScore,
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
  date?: string,
): Promise<{ updated: boolean }> {
  const leaderboardDate = date || new Date().toISOString().split("T")[0];

  // Check if user already has an entry for this date
  const existingEntry = await db
    .select({ score: leaderboard.score })
    .from(leaderboard)
    .where(
      and(
        eq(leaderboard.userId, userId),
        eq(leaderboard.date, leaderboardDate),
      ),
    )
    .limit(1);

  if (existingEntry.length > 0) {
    // Update only if new score is better
    // if (score > existingEntry[0].score) {
    //   await db
    //     .update(leaderboard)
    //     .set({
    //       score,
    //       userName,
    //       updatedAt: new Date(),
    //     })
    //     .where(
    //       and(
    //         eq(leaderboard.userId, userId),
    //         eq(leaderboard.date, leaderboardDate),
    //       ),
    //     );
    //   return { updated: true };
    // }
    return { updated: false };
  }

  // Create new leaderboard entry
  const newEntry: NewLeaderboardEntry = {
    userId,
    userName,
    date: leaderboardDate,
    score,
  };

  await db.insert(leaderboard).values(newEntry);
  return { updated: true };
}

// Get leaderboard for a specific date
export async function getLeaderboard(date: string, userId?: string) {
  // Get top 10 scores for the date
  const topScores = await db
    .select({
      userId: leaderboard.userId,
      userName: leaderboard.userName,
      score: leaderboard.score,
      rank: sql<number>`ROW_NUMBER() OVER (ORDER BY ${leaderboard.score} DESC)`.as(
        "rank",
      ),
    })
    .from(leaderboard)
    .where(eq(leaderboard.date, date))
    .orderBy(desc(leaderboard.score))
    .limit(10);

  let userRanking = null;

  // If userId provided, get user's ranking
  if (userId) {
    const userRankQuery = await db
      .select({
        userId: leaderboard.userId,
        userName: leaderboard.userName,
        score: leaderboard.score,
        rank: sql<number>`ROW_NUMBER() OVER (ORDER BY ${leaderboard.score} DESC)`.as(
          "rank",
        ),
      })
      .from(leaderboard)
      .where(and(eq(leaderboard.date, date), eq(leaderboard.userId, userId)))
      .limit(1);

    if (userRankQuery.length > 0) {
      userRanking = userRankQuery[0];
    }
  }

  return {
    topScores,
    userRanking,
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
      similarity: dailyAttempts.similarity,
      date: dailyAttempts.date,
      gameMode: sql<string>`'daily'`.as("gameMode"), // Always daily for this simplified version
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
