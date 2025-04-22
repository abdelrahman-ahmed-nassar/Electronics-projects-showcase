import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  // Create a response object that we'll modify and return
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: Do not run code between createServerClient and
  // supabase.auth.getUser() to avoid issues with users being logged out unexpectedly

  // Get the user session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Define which routes are public (don't require authentication)
  const publicRoutes = [
    "/login",
    "/contact",
    "/auth",
    "/",
    "/about",
    "/projects",
    "/teams",
    "/students",
    "/clearCache",
  ];

  // Custom check for course detail pages without lectures
  const isCourseDetailPage = (pathname: string) => {
    // Only match exact course URLs like /courses/1, /courses/123
    // But not /courses/1/lectures or /courses/1/units
    const coursePattern = /^\/courses\/\d+$/;
    return coursePattern.test(pathname);
  };

  const isLectureRoute = (pathname: string) => {
    return pathname.includes("/lectures/") || pathname.includes("/units/");
  };

  const isPublicRoute =
    publicRoutes.some(
      (route) =>
        request.nextUrl.pathname === route ||
        (route !== "/courses" &&
          request.nextUrl.pathname.startsWith(`${route}/`))
    ) ||
    (!isLectureRoute(request.nextUrl.pathname) &&
      isCourseDetailPage(request.nextUrl.pathname));

  // Check if the current route is an API route
  const isApiRoute = request.nextUrl.pathname.startsWith("/api");

  // Check if this is a static asset
  const isStaticAsset = new RegExp(
    "\\.(css|jpg|jpeg|png|gif|ico|svg|webp|js)$"
  ).test(request.nextUrl.pathname);

  if (!user && !isPublicRoute && !isApiRoute && !isStaticAsset) {
    // User is not authenticated and trying to access a protected route
    // Redirect to login page
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
