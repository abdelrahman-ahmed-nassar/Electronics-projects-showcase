import { type NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

const publicRoutes = [
  "/login",
  "/register",
  "/contact",
  "/auth",
  "/",
  "/about",
  "/projects",
  "/teams",
  "/students",
  "/clearCache",
];

const isCourseDetailPage = (pathname: string) => /^\/courses\/\d+$/.test(pathname);

const isLectureRoute = (pathname: string) =>
  pathname.includes("/lectures/") || pathname.includes("/units/");

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthenticated = Boolean(getSessionCookie(request));

  if (isAuthenticated && (pathname === "/login" || pathname === "/register")) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  const isPublicRoute =
    publicRoutes.some(
      (route) =>
        pathname === route || (route !== "/courses" && pathname.startsWith(`${route}/`))
    ) ||
    (!isLectureRoute(pathname) && isCourseDetailPage(pathname));

  const isApiRoute = pathname.startsWith("/api");
  const isStaticAsset = /\.(css|jpg|jpeg|png|gif|ico|svg|webp|js)$/.test(pathname);

  if (isLectureRoute(pathname) && !isAuthenticated) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  if (!isAuthenticated && !isPublicRoute && !isApiRoute && !isStaticAsset) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/auth|public).*)",
    "/api/projects/:path*",
  ],
};
