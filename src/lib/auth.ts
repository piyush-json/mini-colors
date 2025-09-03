import { Errors } from "@farcaster/quick-auth";
import { NextRequest, NextResponse } from "next/server";
import client from "./server-client";

const domain = process.env.HOSTNAME || "playshade.fun";
export async function authenticateRequest(request: NextRequest) {
  const authorization = request.headers.get("Authorization");
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return {
      success: false,
      error: "Unauthorized",
    };
  }

  try {
    const payload = await client.verifyJwt({
      token: authorization.split(" ")[1] as string,
      domain,
    });
  } catch (e) {
    if (e instanceof Errors.InvalidTokenError) {
      console.info("Invalid token:", e.message);
      return {
        success: false,
        error: "Invalid token",
      };
    }
  }

  return {
    success: true,
  };
}
