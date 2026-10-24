import { NextResponse } from "next/server";
import crypto from "crypto";

/**
 * Access Control & Authorization Guard for administrative endpoints
 * Defends against Broken Access Control (OWASP Top 10 A01:2021)
 */

export const ADMIN_SECRET_KEY =
  process.env.ADMIN_SECRET_KEY || "NITHU_ADMIN_SECRET_KEY_2026_ATLAS";

/**
 * Validates whether the incoming HTTP request is authorized as an Admin.
 * Checks 'x-admin-token' or 'authorization: Bearer ...' using constant-time comparison.
 */
export function verifyAdminAccess(req: Request): NextResponse | null {
  const tokenHeader =
    req.headers.get("x-admin-token") ||
    req.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ||
    "";

  if (!tokenHeader) {
    return NextResponse.json(
      {
        success: false,
        error: "Unauthorized: Administrative privileges required. Missing access token.",
      },
      { status: 401 }
    );
  }

  try {
    const expected = Buffer.from(ADMIN_SECRET_KEY);
    const provided = Buffer.from(tokenHeader);

    // Constant-time comparison to prevent timing attacks
    if (
      expected.length !== provided.length ||
      !crypto.timingSafeEqual(expected, provided)
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Forbidden: Invalid administrative credentials.",
        },
        { status: 403 }
      );
    }
  } catch {
    return NextResponse.json(
      { success: false, error: "Forbidden: Access denied." },
      { status: 403 }
    );
  }

  return null; // Authorized
}
