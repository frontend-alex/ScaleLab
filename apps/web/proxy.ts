import { type NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const hasAuth = Boolean(request.cookies.get("auth")?.value);
  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith("/app") && !hasAuth) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (pathname === "/sign-in" && hasAuth) {
    return NextResponse.redirect(new URL("/app", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/sign-in", "/app/:path*"],
};
