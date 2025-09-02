import type { MiniAppNotificationDetails } from "@farcaster/miniapp-sdk";
import {
  getUserNotificationDetails as dbGetUserNotificationDetails,
  setUserNotificationDetails as dbSetUserNotificationDetails,
  deleteUserNotificationDetails as dbDeleteUserNotificationDetails,
} from "@/db/queries";

export async function getUserNotificationDetails(
  fid: number,
): Promise<MiniAppNotificationDetails | null> {
  return await dbGetUserNotificationDetails(fid);
}

export async function setUserNotificationDetails(
  fid: number,
  notificationDetails: MiniAppNotificationDetails,
): Promise<void> {
  await dbSetUserNotificationDetails(fid, notificationDetails);
}

export async function deleteUserNotificationDetails(
  fid: number,
): Promise<void> {
  await dbDeleteUserNotificationDetails(fid);
}
