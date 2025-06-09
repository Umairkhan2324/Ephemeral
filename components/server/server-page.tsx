"use client"

import { useState } from "react"
import Link from "next/link"
import type { Database } from "@/types/supabase"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Plus } from "lucide-react"
import CreatePostDialog from "@/components/dashboard/create-post-dialog"
import PostCard from "./post-card"

type User = Database["public"]["Tables"]["users"]["Row"]
type Server = Database["public"]["Tables"]["servers"]["Row"]
type PostWithUser = Database["public"]["Tables"]["posts"]["Row"] & {
  users: {
    id: string
    username: string
    avatar_url: string | null
  }
}

interface ServerPageProps {
  server: Server
  posts: PostWithUser[]
  user: User
}

export default function ServerPage({ server, posts, user }: ServerPageProps) {
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container flex h-16 items-center px-4">
          <Link href="/dashboard" className="mr-4">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              {server.name.split(" ")[0]}
            </div>
            <h1 className="text-xl font-bold">{server.name}</h1>
          </div>
          <div className="ml-auto">
            <Button onClick={() => setIsCreatePostOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Post
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-6 px-4">
        <div className="max-w-2xl mx-auto">
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-2">No posts yet</h2>
              <p className="text-muted-foreground mb-6">Be the first to share something!</p>
              <Button onClick={() => setIsCreatePostOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Post
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </main>

      {isCreatePostOpen && (
        <CreatePostDialog
          isOpen={isCreatePostOpen}
          onClose={() => setIsCreatePostOpen(false)}
          servers={[server]}
          selectedServer={server}
          userId={user.id}
        />
      )}
    </div>
  )
}
