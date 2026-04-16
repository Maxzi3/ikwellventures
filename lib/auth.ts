import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
  throw new Error("Please define JWT_SECRET in your .env.local file");
}

export type AdminPayload = {
  email: string;
  role: "admin";
};

/** Signs a JWT token */
export function signToken(payload: AdminPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

/** Verifies a JWT token, returns the payload or null */
export function verifyToken(token: string): AdminPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as unknown;
    if (
      decoded &&
      typeof decoded === "object" &&
      "email" in decoded &&
      "role" in decoded
    ) {
      return decoded as AdminPayload;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Require admin middleware.
 * Checks (in order):
 *   1. Cookie:        admin_token=<jwt>
 *   2. Auth header:   Authorization: Bearer <jwt>
 *
 * Returns the decoded payload on success, or a 401 NextResponse on failure.
 */
export function requireAdmin(
  request: NextRequest,
): AdminPayload | NextResponse {

const cookieToken = request.cookies.get("admin-token")?.value;

  // 2️⃣ Authorization header (API clients / Postman)
  const headerToken = request.headers
    .get("authorization")
    ?.replace(/^Bearer\s+/i, "");

  const token = cookieToken ?? headerToken;

  if (!token) {
    return NextResponse.json(
      { error: "Unauthorized: no token provided" },
      { status: 401 },
    );
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    return NextResponse.json(
      { error: "Unauthorized: invalid or expired token" },
      { status: 401 },
    );
  }

  return decoded;
}
