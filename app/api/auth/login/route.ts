import { NextRequest, NextResponse } from "next/server";
import { signToken } from "@/lib/auth";
import bcrypt from "bcryptjs";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL!;
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH!;

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT = 5;
const WINDOW_MS = 5 * 60 * 1000;

function getRateLimit(ip: string): boolean {
  const now = Date.now();
  for (const [key, value] of rateLimitMap) {
    if (now > value.resetTime) rateLimitMap.delete(key);
  }

  const record = rateLimitMap.get(ip);
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + WINDOW_MS });
    return true;
  }

  if (record.count >= RATE_LIMIT) return false;
  record.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
      request.headers.get("x-real-ip") ??
      "unknown";

    if (!getRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many attempts." },
        { status: 429 },
      );
    }

    const { email, password } = (await request.json()) as {
      email?: string;
      password?: string;
    };

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 },
      );
    }

    const isValidPassword = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
    console.log({
      inputPassword: password,
      hash: ADMIN_PASSWORD_HASH,
      isValidPassword,
    });
    console.log("ENV HASH:", process.env.ADMIN_PASSWORD_HASH);

    if (email !== ADMIN_EMAIL || !isValidPassword) {
      await new Promise((r) => setTimeout(r, 500));
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    const token = signToken({ email, role: "admin" });

    const response = NextResponse.json({ success: true });

    response.cookies.set("admin-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
