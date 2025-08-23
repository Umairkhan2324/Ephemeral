import { NextResponse } from "next/server"
import { z } from "zod"
import { createServerSupabaseClient } from "@/lib/supabase"
import { PostService } from "@/application/PostService"
import { withRequest } from "@/lib/logger"
import { ensureRequestId } from "@/lib/http"
import { serverEnv } from "@/config/env"

const BodySchema = z.object({
  content_text: z.string().min(1).max(2000),
  expires_in_hours: z.number().int().min(1).max(24).optional(),
  idempotency_key: z.string().max(100).optional(),
})

export async function POST(request: Request) {
  const headers = new Headers(request.headers)
  const requestId = ensureRequestId(headers)
  const log = withRequest({ requestId })

  try {
    const supabase = createServerSupabaseClient()
    const { data: auth } = await supabase.auth.getUser()
    if (!auth?.user) {
      return NextResponse.json({ error: "UNAUTHORIZED", requestId }, { status: 401 })
    }

    const json = await request.json()
    const body = BodySchema.parse(json)

    // Basic per-user rate limiting (memoryless best-effort via Postgres): count posts in window
    const nowIso = new Date().toISOString()
    const { count } = await supabase
      .from("posts")
      .select("id", { count: "exact", head: true })
      .gte("created_at", new Date(Date.now() - serverEnv.rateLimit.window * 1000).toISOString())
      .eq("user_id", auth.user.id)
    if ((count || 0) > serverEnv.rateLimit.max) {
      return NextResponse.json({ error: "RATE_LIMITED", requestId }, { status: 429 })
    }

    // Idempotency heuristic: if key provided, try to find an identical recent post
    if (body.idempotency_key) {
      const { data: existing } = await supabase
        .from("posts")
        .select("id, server_id, content_text, expires_at")
        .eq("user_id", auth.user.id)
        .eq("content_text", body.content_text)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle()
      if (existing) {
        return NextResponse.json({ post: existing, serverId: existing.server_id, requestId })
      }
    }

    const service = new PostService()
    const { post, serverId } = await service.createAutoClassifiedPost({
      userId: auth.user.id,
      content_text: body.content_text,
      expires_in_hours: body.expires_in_hours,
    })

    return NextResponse.json({ post, serverId, requestId })
  } catch (err: any) {
    log.warn("Create post failed", { err: String(err) })
    const status = err?.status || (err?.name === "ZodError" ? 400 : 500)
    return NextResponse.json({ error: "FAILED", requestId }, { status })
  }
}


