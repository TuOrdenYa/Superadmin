import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Basic Auth protection for /admin routes (production only)
export function proxy(req: NextRequest) {
  const url = req.nextUrl;
  if (!url.pathname.startsWith("/admin")) return NextResponse.next();

  const isDev = process.env.NODE_ENV === "development";
  if (isDev) return NextResponse.next();

  const authHeader = req.headers.get("authorization");
  const user = process.env.ADMIN_USER || "admin";
  const pass = process.env.ADMIN_PASS || "change-me";

  if (!authHeader || !authHeader.startsWith("Basic ")) {
    return new NextResponse("Authentication required", {
      status: 401,
      headers: { "WWW-Authenticate": "Basic realm=\"TuOrdenYa Admin\"" },
    });
  }

  try {
    const base64 = authHeader.split(" ")[1];
    const [incomingUser, incomingPass] = Buffer.from(base64, "base64").toString().split(":");
    if (incomingUser === user && incomingPass === pass) {
      return NextResponse.next();
    }
  } catch {
    // fall through
  }

  return new NextResponse("Unauthorized", {
    status: 401,
    headers: { "WWW-Authenticate": "Basic realm=\"TuOrdenYa Admin\"" },
  });
}

export const config = {
  matcher: ["/admin/:path*"],
};
