import {
  MiniAppNotificationDetails,
  type SendNotificationRequest,
  sendNotificationResponseSchema,
} from "@farcaster/miniapp-sdk";
import { getUserNotificationDetails } from "@/lib/notification";

const appUrl = process.env.NEXT_PUBLIC_URL || "";

type SendFrameNotificationResult =
  | {
      state: "error";
      error: unknown;
    }
  | { state: "no_token" }
  | { state: "rate_limit" }
  | { state: "success" };

export async function sendFrameNotification({
  fid,
  title,
  body,
  notificationDetails,
}: {
  fid: number;
  title: string;
  body: string;
  notificationDetails?: MiniAppNotificationDetails | null;
}): Promise<SendFrameNotificationResult> {
  if (!notificationDetails) {
    notificationDetails = await getUserNotificationDetails(fid);
  }
  if (!notificationDetails) {
    return { state: "no_token" };
  }

  const response = await fetch(notificationDetails.url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      notificationId: crypto.randomUUID(),
      title,
      body,
      targetUrl: appUrl,
      tokens: [notificationDetails.token],
    } satisfies SendNotificationRequest),
  });

  const responseJson = await response.json();

  if (response.status === 200) {
    const responseBody = sendNotificationResponseSchema.safeParse(responseJson);
    if (responseBody.success === false) {
      return { state: "error", error: responseBody.error.errors };
    }

    if (responseBody.data.result.rateLimitedTokens.length) {
      return { state: "rate_limit" };
    }

    return { state: "success" };
  }

  return { state: "error", error: responseJson };
}

type SendBatchNotificationResult =
  | {
      state: "error";
      error: unknown;
    }
  | {
      state: "success";
      results: Array<{ fid: number; result: SendFrameNotificationResult }>;
    };

export async function sendBatchNotification({
  notifications,
  title,
  body,
  targetUrl,
}: {
  notifications: Array<{
    fid: number;
    notificationDetails: MiniAppNotificationDetails;
  }>;
  title: string;
  body: string;
  targetUrl: string;
}): Promise<SendBatchNotificationResult> {
  const results: Array<{ fid: number; result: SendFrameNotificationResult }> =
    [];
  const notificationId = crypto.randomUUID();

  // Process notifications in batches of 100 (Farcaster limit)
  const batchSize = 100;
  for (let i = 0; i < notifications.length; i += batchSize) {
    const batch = notifications.slice(i, i + batchSize);

    // Group by URL since each URL needs a separate request
    const urlGroups = new Map<
      string,
      Array<{ fid: number; notificationDetails: MiniAppNotificationDetails }>
    >();

    for (const notification of batch) {
      const url = notification.notificationDetails.url;
      if (!urlGroups.has(url)) {
        urlGroups.set(url, []);
      }
      urlGroups.get(url)!.push(notification);
    }

    // Send notifications for each URL group
    for (const [url, urlNotifications] of urlGroups) {
      const tokens = urlNotifications.map((n) => n.notificationDetails.token);

      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            notificationId,
            title,
            body,
            targetUrl,
            tokens,
          } satisfies SendNotificationRequest),
        });

        const responseJson = await response.json();

        if (response.status === 200) {
          const responseBody =
            sendNotificationResponseSchema.safeParse(responseJson);
          if (responseBody.success === false) {
            // Add error result for all tokens in this batch
            for (const notification of urlNotifications) {
              results.push({
                fid: notification.fid,
                result: { state: "error", error: responseBody.error.errors },
              });
            }
            continue;
          }

          const { successfulTokens, invalidTokens, rateLimitedTokens } =
            responseBody.data.result;

          // Process results for each token
          for (const notification of urlNotifications) {
            const token = notification.notificationDetails.token;

            if (successfulTokens.includes(token)) {
              results.push({
                fid: notification.fid,
                result: { state: "success" },
              });
            } else if (invalidTokens.includes(token)) {
              results.push({
                fid: notification.fid,
                result: { state: "no_token" },
              });
            } else if (rateLimitedTokens.includes(token)) {
              results.push({
                fid: notification.fid,
                result: { state: "rate_limit" },
              });
            } else {
              results.push({
                fid: notification.fid,
                result: { state: "error", error: "Unknown error" },
              });
            }
          }
        } else {
          // Add error result for all tokens in this batch
          for (const notification of urlNotifications) {
            results.push({
              fid: notification.fid,
              result: { state: "error", error: responseJson },
            });
          }
        }
      } catch (error) {
        // Add error result for all tokens in this batch
        for (const notification of urlNotifications) {
          results.push({
            fid: notification.fid,
            result: { state: "error", error },
          });
        }
      }
    }
  }

  return { state: "success", results };
}
