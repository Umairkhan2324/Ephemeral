import { createServerSupabaseClient } from "@/lib/supabase"
import type { Database } from "@/types/supabase"

type PostInsert = Database["public"]["Tables"]["posts"]["Insert"]
type PostRow = Database["public"]["Tables"]["posts"]["Row"]

export class SupabasePostRepository {
  async insertPost(input: PostInsert): Promise<PostRow> {
    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase
      .from("posts")
      .insert(input)
      .select("*")
      .single()
    if (error) throw error
    return data!
  }
}


