import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Create a Supabase client for auth checks
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return req.cookies.get(name)?.value;
        },
        set(name, value, options) {
          req.cookies.set({
            name,
            value,
            ...options,
          });
          res.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name, options) {
          req.cookies.set({
            name,
            value: "",
            ...options,
          });
          res.cookies.set({
            name,
            value: "",
            ...options,
          });
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Check if the request is for the login page
  const isLoginPage = req.nextUrl.pathname === "/login";

  // If user is logged in and trying to access login page, redirect to home
  if (session && isLoginPage) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // If this is an API route, allow it (API routes handle their own auth)
  if (req.nextUrl.pathname.startsWith("/api/")) {
    return res;
  }

  // Check if route is in the public group by examining the file system path
  const isPublicRoute = req.nextUrl.pathname === "/login";

  // If user is not logged in and trying to access protected route, redirect to login
  if (
    !session &&
    !isPublicRoute &&
    !req.nextUrl.pathname.startsWith("/_next")
  ) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!_next/static|_next/image|favicon.ico|public|.*\\.ico).*)",
  ],
};
