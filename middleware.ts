import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";
import { cookies } from "next/headers";

export async function middleware(request: NextRequest) {
  // First update the Supabase session
  const response = await updateSession(request);

  const { pathname } = request.nextUrl;
  const cookiesData = await cookies();
  const isAuthenticated = cookiesData.get("isAuthenticated")?.value === "true";

  // Check if the path is a lecture route
  const isLectureRoute =
    pathname.includes("/lectures/") || pathname.includes("/units/");

  // Redirect authenticated users away from login and register pages
  if (isAuthenticated && (pathname === "/login" || pathname === "/register")) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // Force authentication for lecture routes
  if (isLectureRoute && !isAuthenticated) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public/*)
     * - API routes (/api/*)
     * - Static assets
     */
    "/((?!_next/static|_next/image|favicon.ico|api|public).*)",
    // "/me",
    // "/me/user",
    // "/login",
    // "/register",
    // "/courses/:id*/units/:unitId*/lectures/:path*",
    // "/courses/:id*/lectures/:path*",
  ],
};
