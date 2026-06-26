import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

// Routes accessible without authentication
const PUBLIC_ROUTES = ["/login", "/registrieren", "/einladung", "/datenschutz", "/agb", "/auth", "/passwort-neu", "/preview"]

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Must call getUser() to refresh session — do not remove
  const { data: { user } } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl
  const isPublicRoute = PUBLIC_ROUTES.some((r) => pathname.startsWith(r))

  // Unauthenticated user on protected route → redirect to login
  if (!user && !isPublicRoute) {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    return NextResponse.redirect(url)
  }

  // Authenticated user hitting an auth page → redirect to dashboard
  // Exception: /passwort-neu must stay accessible after the recovery link sets the session
  if (user && isPublicRoute && !pathname.startsWith("/passwort-neu")) {
    const url = request.nextUrl.clone()
    url.pathname = "/"
    return NextResponse.redirect(url)
  }

  // Welcome video gate — every user must watch it before using the app.
  // Skipped for API routes so client-side fetches don't get redirected responses.
  if (user && !isPublicRoute && !pathname.startsWith("/api")) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("welcome_video_seen")
      .eq("id", user.id)
      .single()

    const hasSeenWelcome = profile?.welcome_video_seen ?? true

    if (!hasSeenWelcome && pathname !== "/willkommen") {
      const url = request.nextUrl.clone()
      url.pathname = "/willkommen"
      return NextResponse.redirect(url)
    }

    if (hasSeenWelcome && pathname === "/willkommen") {
      const url = request.nextUrl.clone()
      url.pathname = "/"
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
