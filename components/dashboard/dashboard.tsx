"use client"

import { useEffect, useState } from "react"
import type { Database } from "@/types/supabase"
import { useSupabase } from "@/components/supabase-provider"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOut, Plus, Sparkles } from "lucide-react"
import ServerCard from "./server-card"
import CreatePostDialog from "./create-post-dialog"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel"
import { useIsMobile } from "@/components/ui/use-mobile"

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
  const [carouselApi, setCarouselApi] = useState<CarouselApi | undefined>()
  const [current, setCurrent] = useState(0)
  const isMobile = useIsMobile()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = "/"
  }

  useEffect(() => {
    if (!carouselApi) return
    const onSelect = () => setCurrent(carouselApi.selectedScrollSnap())
    onSelect()
    carouselApi.on("select", onSelect)
    return () => carouselApi.off("select", onSelect)
  }, [carouselApi])

  // Auto-rotate every 2s (all breakpoints)
  useEffect(() => {
    if (!carouselApi) return
    const id = setInterval(() => {
      try { carouselApi.scrollNext() } catch {}
    }, 2000)
    return () => clearInterval(id)
  }, [carouselApi])

  return (
    <div className="min-h-screen bg-background bg-radial-soft">
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
        <div className="relative overflow-hidden">
          <Carousel opts={{ align: "center", loop: servers.length > 1 }} setApi={setCarouselApi}>
            <CarouselContent className="px-2 sm:px-6">
              {servers.map((server, index) => (
                <CarouselItem key={server.id} className="basis-[90%] sm:basis-[85%] md:basis-[70%] lg:basis-[55%] xl:basis-[45%]">
                  <div className={`transition duration-300 ${index === current ? "opacity-100 scale-100" : "opacity-75 scale-95"}`}>
                    <ServerCard
                      server={server}
                      onCreatePost={() => {
                        setSelectedServer(server)
                        setIsCreatePostOpen(true)
                      }}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-2" />
            <CarouselNext className="hidden md:flex -right-2" />
          </Carousel>
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
