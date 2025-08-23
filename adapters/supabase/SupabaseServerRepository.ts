import { createServerSupabaseClient } from "@/lib/supabase"
import type { Database } from "@/types/supabase"

type ServerRow = Database["public"]["Tables"]["servers"]["Row"]

export class SupabaseServerRepository {
  async listServers(): Promise<ServerRow[]> {
    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase.from("servers").select("*")
    if (error) throw error
    return data || []
  }
}


