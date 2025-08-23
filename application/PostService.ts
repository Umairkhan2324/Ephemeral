import type { Database } from "@/types/supabase"
import { SupabaseServerRepository } from "@/adapters/supabase/SupabaseServerRepository"
import { SupabasePostRepository } from "@/adapters/supabase/SupabasePostRepository"
import { classifyServerId } from "@/domain/classifier"

type PostRow = Database["public"]["Tables"]["posts"]["Row"]

export class PostService {
  private servers = new SupabaseServerRepository()
  private posts = new SupabasePostRepository()

  async createAutoClassifiedPost(args: { userId: string; content_text: string; expires_in_hours?: number }): Promise<{ post: PostRow; serverId: string }> {
    const servers = await this.servers.listServers()
    const { serverId } = await classifyServerId(args.content_text, servers)

    const expiresAt = new Date()
    const hours = Math.max(1, Math.min(24, args.expires_in_hours || 24))
    expiresAt.setHours(expiresAt.getHours() + hours)

    const post = await this.posts.insertPost({
      user_id: args.userId,
      server_id: serverId,
      content_text: args.content_text,
      expires_at: expiresAt.toISOString(),
    })
    return { post, serverId }
  }
}


