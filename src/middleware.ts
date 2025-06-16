import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken");
  
    if (!accessToken && request.nextUrl.pathname !== "/auth/login") {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }

  export const config = {
    matcher: [
      "/((?!api|auth|_next/static|_next/image|.*\\.png$).*)",
      "/auth/:path*",
    ],
  };