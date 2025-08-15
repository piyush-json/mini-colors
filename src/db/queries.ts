import { db } from "./index";
import {
  users,
  dailyColors,
  gameSessions,
  gameAttempts,
  dailyStats,
  leaderboardEntries,
  type NewUser,
  type NewDailyColor,
  type NewGameSession,
  type NewGameAttempt,
  type NewDailyStat,
  type NewLeaderboardEntry,
  type DailyStat,
  type LeaderboardEntry,
} from "./schema";
import { eq, desc, and, sql } from "drizzle-orm";

// User management
export async function createOrGetUser(
  userKey: string,
  name?: string,
): Promise<string> {
  const existingUser = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.userKey, userKey))
    .limit(1);

  if (existingUser.length > 0) {
    return existingUser[0].id;
  }

  const newUser: NewUser = {
    name: name || "Anonymous Player",
    userKey,
  };

  const result = await db
    .insert(users)
    .values(newUser)
    .returning({ id: users.id });
  return result[0].id;
}

// Daily color management
export async function getDailyColor(date: string): Promise<string> {
  const existingColor = await db
    .select({ color: dailyColors.color })
    .from(dailyColors)
    .where(eq(dailyColors.date, date))
    .limit(1);

  if (existingColor.length > 0) {
    return existingColor[0].color;
  }

  // Generate new daily color
  const seed = parseInt(date.replace(/-/g, ""));
  const hue = seed % 360;
  const saturation = 70 + (seed % 30);
  const lightness = 40 + (seed % 20);
  const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

  const newDailyColor: NewDailyColor = {
    date,
    color,
    hue,
    saturation,
    lightness,
  };

  await db.insert(dailyColors).values(newDailyColor);
  return color;
}

// Game session management
export async function createGameSession(
  userId: string,
  gameMode: string,
  targetColor: string,
  dailyColorId?: number,
): Promise<string> {
  const newSession: NewGameSession = {
    userId,
    gameMode,
    targetColor,
    dailyColorId,
  };

  const result = await db
    .insert(gameSessions)
    .values(newSession)
    .returning({ id: gameSessions.id });
  return result[0].id;
}

// Game attempt management
export async function saveGameAttempt(
  sessionId: string,
  userId: string,
  attemptData: {
    attemptNumber: number;
    capturedColor: string;
    targetColor: string;
    similarity: number;
    timeTaken: number;
    timeScore: number;
    finalScore: number;
  },
): Promise<string> {
  const newAttempt: NewGameAttempt = {
    ...attemptData,
    sessionId,
    userId,
    similarity: attemptData.similarity.toFixed(2),
    timeTaken: attemptData.timeTaken.toString(),
  };

  const result = await db
    .insert(gameAttempts)
    .values(newAttempt)
    .returning({ id: gameAttempts.id });
  return result[0].id;
}

// Daily stats management
export async function getDailyStats(
  userId: string,
  date: string,
): Promise<DailyStat | null> {
  const stats = await db
    .select()
    .from(dailyStats)
    .where(and(eq(dailyStats.userId, userId), eq(dailyStats.date, date)))
    .limit(1);

  return stats[0] || null;
}

export async function updateDailyStats(
  userId: string,
  date: string,
  newScore: number,
  timeTaken: number,
): Promise<{
  totalAttempts: number;
  bestScore: number;
  currentScore: number;
  isNewBest: boolean;
}> {
  const existingStats = await getDailyStats(userId, date);

  if (existingStats) {
    // Update existing stats
    const newTotalAttempts = existingStats.totalAttempts + 1;
    const newBestScore = Math.max(existingStats.bestScore, newScore);
    const isNewBest = newScore > existingStats.bestScore;

    // Calculate new average
    const totalScores =
      parseFloat(existingStats.averageScore.toString()) *
        existingStats.totalAttempts +
      newScore;
    const newAverageScore = totalScores / newTotalAttempts;

    const newTotalTime =
      parseFloat(existingStats.totalTimePlayed.toString()) + timeTaken;

    await db
      .update(dailyStats)
      .set({
        totalAttempts: newTotalAttempts,
        bestScore: newBestScore,
        averageScore: newAverageScore.toString(),
        totalTimePlayed: newTotalTime.toString(),
        updatedAt: new Date(),
      })
      .where(and(eq(dailyStats.userId, userId), eq(dailyStats.date, date)));

    return {
      totalAttempts: newTotalAttempts,
      bestScore: newBestScore,
      currentScore: newScore,
      isNewBest,
    };
  } else {
    // Create new stats
    const newStats: NewDailyStat = {
      userId,
      date,
      totalAttempts: 1,
      bestScore: newScore,
      averageScore: newScore.toString(),
      totalTimePlayed: timeTaken.toString(),
    };

    await db.insert(dailyStats).values(newStats);

    return {
      totalAttempts: 1,
      bestScore: newScore,
      currentScore: newScore,
      isNewBest: true,
    };
  }
}

// Leaderboard management
export async function getLeaderboard(
  date?: string,
): Promise<LeaderboardEntry[]> {
  let query = db
    .select({
      id: leaderboardEntries.id,
      userId: leaderboardEntries.userId,
      userName: leaderboardEntries.userName,
      date: leaderboardEntries.date,
      score: leaderboardEntries.score,
      attemptId: leaderboardEntries.attemptId,
      rank: leaderboardEntries.rank,
      createdAt: leaderboardEntries.createdAt,
      updatedAt: leaderboardEntries.updatedAt,
    })
    .from(leaderboardEntries)
    .orderBy(desc(leaderboardEntries.score), leaderboardEntries.createdAt)
    .$dynamic();

  if (date) {
    query = query.where(eq(leaderboardEntries.date, date));
  }

  return await query.limit(100);
}

export async function submitToLeaderboard(
  userId: string,
  userName: string,
  score: number,
  date: string,
  attemptId: string,
): Promise<{ updated: boolean; entry: LeaderboardEntry }> {
  const existingEntry = await db
    .select()
    .from(leaderboardEntries)
    .where(
      and(
        eq(leaderboardEntries.userId, userId),
        eq(leaderboardEntries.date, date),
      ),
    )
    .limit(1);

  if (existingEntry.length > 0) {
    const existing = existingEntry[0];
    if (score > existing.score) {
      // Update with better score
      const updated = await db
        .update(leaderboardEntries)
        .set({
          userName,
          score,
          attemptId,
          updatedAt: new Date(),
        })
        .where(eq(leaderboardEntries.id, existing.id))
        .returning();

      return { updated: true, entry: updated[0] };
    } else {
      return { updated: false, entry: existing };
    }
  } else {
    // Create new entry
    const newEntry: NewLeaderboardEntry = {
      userId,
      userName,
      date,
      score,
      attemptId,
    };

    const created = await db
      .insert(leaderboardEntries)
      .values(newEntry)
      .returning();
    return { updated: false, entry: created[0] };
  }
}

// Helper function to get user key from request
export function getUserKey(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const ip = forwardedFor?.split(",")[0] || realIp || "unknown";
  const userAgent = request.headers.get("user-agent") || "unknown";
  return `${ip}-${userAgent.slice(0, 50)}`;
}
