import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            req.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const isAuthPage = ["/login", "/register", "/forgot"].includes(
    req.nextUrl.pathname
  );
  const isProtectedPage = req.nextUrl.pathname === "/";

  // Static assets matcher
  const staticPattern =
    /^\/(_next\/static|_next\/image|favicon\.ico|.*\.(png|jpg|jpeg|svg|css|js|ico|woff|woff2|ttf|eot))$/;

  if (staticPattern.test(req.nextUrl.pathname)) {
    return response;
  }

  if (isAuthPage && session) {
    // Redirect logged-in users away from auth pages
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (isProtectedPage && !session) {
    // Redirect logged-out users to login
    return NextResponse.redirect(new URL("/login", req.url));
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
     * - Static files with extensions (png, jpg, svg, css, js, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|css|js|ico|woff|woff2|ttf|eot)$).*)",
  ],
};
