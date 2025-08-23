export const dynamic = "force-dynamic"
import { createServerSupabaseClient } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()

    // Delete expired posts
    const { error, count } = await supabase
      .from("posts")
      .delete({ count: "exact" })
      .lt("expires_at", new Date().toISOString())

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${count} expired posts.`,
    })
  } catch (error: any) {
    console.error("Error deleting expired posts:", error.message)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
