import { NextResponse } from "next/server";
import { getAllNotificationTokens } from "@/db/queries";
import { sendBatchNotification } from "@/lib/notification-client";

const appName = process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME || "Color Game";
const appUrl = process.env.NEXT_PUBLIC_URL || "";
const cronSecret = process.env.CRON_SECRET || "lmao-bhaijaan";

function verifyAuth(request: Request): boolean {
  const authHeader = request.headers.get("authorization");
  const expectedAuth = `Bearer ${cronSecret}`;
  return authHeader === expectedAuth;
}

export async function GET(request: Request) {
  // Verify authentication
  if (!verifyAuth(request)) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }
  try {
    console.log("Starting daily notification process...");

    const notifications = await getAllNotificationTokens();

    if (notifications.length === 0) {
      console.log("No users with notification tokens found");
      return NextResponse.json({
        success: true,
        message: "No users to notify",
        sent: 0,
      });
    }

    console.log(`Found ${notifications.length} users with notification tokens`);

    // Generate today's color
    const title = "🎨 New Daily Color!";
    const body = "A new color challenge is waiting for you!";
    const targetUrl = `${appUrl}/game`;

    console.log(`Sending notifications`);

    // Send batch notifications
    const result = await sendBatchNotification({
      notifications,
      title,
      body,
      targetUrl,
    });

    if (result.state === "error") {
      console.error("Batch notification failed:", result.error);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to send notifications",
          details: result.error,
        },
        { status: 500 },
      );
    }

    // Count results
    const stats = {
      total: notifications.length,
      successful: 0,
      failed: 0,
      noToken: 0,
      rateLimited: 0,
    };

    for (const { result: notificationResult } of result.results) {
      switch (notificationResult.state) {
        case "success":
          stats.successful++;
          break;
        case "no_token":
          stats.noToken++;
          break;
        case "rate_limit":
          stats.rateLimited++;
          break;
        case "error":
          stats.failed++;
          break;
      }
    }

    console.log("Daily notification stats:", stats);

    return NextResponse.json({
      success: true,
      message: "Daily notifications sent successfully",
      stats,
    });
  } catch (error) {
    console.error("Daily notification cron job failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

// Also support POST for manual triggering
export async function POST(request: Request) {
  return GET(request);
}
