"use client"

import { useState } from "react"
import type { Database } from "@/types/supabase"
import { useSupabase } from "@/components/supabase-provider"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOut, Plus, Sparkles } from "lucide-react"
import ServerCard from "./server-card"
import CreatePostDialog from "./create-post-dialog"

type User = Database["public"]["Tables"]["users"]["Row"]
type Server = Database["public"]["Tables"]["servers"]["Row"]

interface DashboardProps {
  user: User
  servers: Server[]
}

export default function Dashboard({ user, servers }: DashboardProps) {
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false)
  const [selectedServer, setSelectedServer] = useState<Server | null>(null)
  const { supabase } = useSupabase()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = "https://ephemeral-liart.vercel.app/"
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Ephemeral</span>
          </div>
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarImage src={user.avatar_url || undefined} />
              <AvatarFallback>{user.username[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className="font-medium">{user.username}</span>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8 px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Choose Your Vibe</h1>
          <p className="text-muted-foreground">Pick a server and share your thoughts ✨</p>
        </div>

        <div className="flex justify-between items-center mb-6">
          <span className="text-sm text-muted-foreground">{servers.length} servers available</span>
          <Button onClick={() => setIsCreatePostOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Post
          </Button>
        </div>

        {/* Servers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {servers.map((server) => (
            <ServerCard
              key={server.id}
              server={server}
              onCreatePost={() => {
                setSelectedServer(server)
                setIsCreatePostOpen(true)
              }}
            />
          ))}
        </div>
      </main>

      {/* Create Post Dialog */}
      {isCreatePostOpen && (
        <CreatePostDialog
          isOpen={isCreatePostOpen}
          onClose={() => setIsCreatePostOpen(false)}
          servers={servers}
          selectedServer={selectedServer}
          userId={user.id}
        />
      )}
    </div>
  )
}
