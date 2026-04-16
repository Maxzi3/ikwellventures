import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE_NAME = "admin-token";

export function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;

  const isProtected =
    path.startsWith("/admin") && !path.startsWith("/admin/login");

  if (isProtected) {
    const token = req.cookies.get(COOKIE_NAME)?.value;

    if (!token) {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("from", path);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
