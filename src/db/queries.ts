import { db } from "./index";
import {
  dailyAttempts,
  leaderboard,
  type NewDailyAttempt,
  type NewLeaderboardEntry,
} from "./schema";
import { eq, desc, and, sql, asc, gt, lt, or } from "drizzle-orm";

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

export async function submitToLeaderboard(
  userId: string,
  userName: string,
  score: number,
  timeTaken: number,
  gameType: string = "color-mixing",
  date?: string,
): Promise<{ updated: boolean }> {
  const leaderboardDate = date || new Date().toISOString().split("T")[0];

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

export async function getLeaderboard(
  date: string,
  userId?: string,
  gameType: string = "all",
) {
  const whereConditions = [eq(leaderboard.date, date)];
  if (gameType !== "all") {
    whereConditions.push(eq(leaderboard.gameType, gameType));
  }

  const whereClause =
    whereConditions.length > 1 ? and(...whereConditions) : whereConditions[0];

  const topScoresQuery = db
    .select({
      userId: leaderboard.userId,
      userName: leaderboard.userName,
      score: leaderboard.score,
      gameType: leaderboard.gameType,
      timeTaken: leaderboard.timeTaken,
    })
    .from(leaderboard)
    .where(whereClause)
    .orderBy(desc(leaderboard.score), asc(leaderboard.timeTaken))
    .limit(10);

  const topScores = await topScoresQuery;

  let userRanking = null;
  if (userId) {
    const userInTop10 = topScores.find((entry) => entry.userId === userId);

    if (userInTop10) {
      const rank = topScores.findIndex((entry) => entry.userId === userId) + 1;
      userRanking = {
        userId: userInTop10.userId,
        userName: userInTop10.userName,
        score: userInTop10.score,
        gameType: userInTop10.gameType,
        rank,
      };
    } else {
      const userRankingQuery = db
        .select({
          userId: leaderboard.userId,
          userName: leaderboard.userName,
          score: leaderboard.score,
          gameType: leaderboard.gameType,
          timeTaken: leaderboard.timeTaken,
        })
        .from(leaderboard)
        .where(
          gameType !== "all"
            ? and(
                eq(leaderboard.date, date),
                eq(leaderboard.userId, userId),
                eq(leaderboard.gameType, gameType),
              )
            : and(eq(leaderboard.date, date), eq(leaderboard.userId, userId)),
        )
        .limit(1);

      const userRankingResult = await userRankingQuery;
      if (userRankingResult.length > 0) {
        const userEntry = userRankingResult[0];

        // Calculate rank by counting how many players are better
        const rankQuery = db
          .select({
            count: sql<number>`COUNT(*)`.as("count"),
          })
          .from(leaderboard)
          .where(
            gameType !== "all"
              ? and(
                  eq(leaderboard.date, date),
                  eq(leaderboard.gameType, gameType),
                  or(
                    gt(leaderboard.score, userEntry.score),
                    and(
                      eq(leaderboard.score, userEntry.score),
                      lt(leaderboard.timeTaken, userEntry.timeTaken),
                    ),
                  ),
                )
              : and(
                  eq(leaderboard.date, date),
                  or(
                    gt(leaderboard.score, userEntry.score),
                    and(
                      eq(leaderboard.score, userEntry.score),
                      lt(leaderboard.timeTaken, userEntry.timeTaken),
                    ),
                  ),
                ),
          );

        const rankResult = await rankQuery;
        const rank = Number(rankResult[0]?.count || 0) + 1;

        userRanking = {
          userId: userEntry.userId,
          userName: userEntry.userName,
          score: userEntry.score,
          gameType: userEntry.gameType,
          rank,
        };
      }
    }
  }

  return {
    topScores,
    userRanking,
  };
}

// Get user's game history
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
      gameMode: dailyAttempts.gameType,
    })
    .from(dailyAttempts)
    .where(eq(dailyAttempts.userId, userId))
    .orderBy(desc(dailyAttempts.createdAt))
    .limit(limit);

  let totalGames = 0;
  let bestScore = 0;
  let totalScore = 0;

  const processedHistory = history.map((h) => {
    totalGames++;
    const score = h.score;
    totalScore += score;
    if (score > bestScore) bestScore = score;

    return {
      ...h,
      similarity: parseFloat(h.similarity),
      timeTaken: parseFloat(h.timeTaken),
    };
  });

  const averageScore = totalGames > 0 ? totalScore / totalGames : 0;

  return {
    history: processedHistory,
    stats: {
      totalGames,
      bestScore,
      averageScore,
    },
  };
}

// Get current streak for a user
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

  if (date === today || date === yesterdayStr) {
    return streak;
  }

  return 0;
}
