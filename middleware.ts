import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { ensureRequestId } from "./lib/http"
import { withRequest } from "./lib/logger"

export async function middleware(request: NextRequest) {
  // Ensure a request ID exists for correlation.
  const reqId = ensureRequestId(request.headers)
  const headers = new Headers(request.headers)
  headers.set("x-request-id", reqId)

  let response = NextResponse.next({
    request: {
      headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({
            request: {
              headers,
            },
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // This will refresh session if expired - required for Server Components
  const log = withRequest({ requestId: reqId })
  await supabase.auth.getSession().catch((err) => {
    log.warn("Session refresh failed", { err: String(err) })
  })

  return response
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
