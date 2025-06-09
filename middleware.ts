import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function middleware(request: NextRequest) {
  // Create a Supabase client configured to use cookies
  const supabase = createServerSupabaseClient()

  // Refresh session if expired - required for Server Components
  // https://supabase.com/docs/guides/auth/auth-helpers/nextjs
  await supabase.auth.getSession()

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     * - api/cron (cron jobs)
     */
    "/((?!_next/static|_next/image|favicon.ico|public|api/cron).*)",
  ],
}
