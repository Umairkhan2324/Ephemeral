"use client"

import type { Database } from "@/types/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { ArrowRight, Music, Gamepad2, Dumbbell, Film, Cpu, Code2, Newspaper, Palette, Plane, Utensils, Activity, Wallet } from "lucide-react"
import Link from "next/link"

type Server = Database["public"]["Tables"]["servers"]["Row"]

interface ServerCardProps {
  server: Server
  onCreatePost: () => void
}

export default function ServerCard({ server, onCreatePost }: ServerCardProps) {
  const name = server.name.toLowerCase()
  const Icon =
    name.includes("music") ? Music :
    name.includes("game") || name.includes("gaming") ? Gamepad2 :
    name.includes("fit") || name.includes("workout") ? Dumbbell :
    name.includes("movie") || name.includes("film") ? Film :
    name.includes("tech") ? Cpu :
    name.includes("code") || name.includes("dev") || name.includes("program") ? Code2 :
    name.includes("news") ? Newspaper :
    name.includes("art") || name.includes("design") ? Palette :
    name.includes("travel") || name.includes("trip") ? Plane :
    name.includes("food") || name.includes("cook") ? Utensils :
    name.includes("health") || name.includes("sports") ? Activity :
    name.includes("finance") || name.includes("stock") ? Wallet :
    Music
  // Prefer server-provided image if available; fallback to single icon
  const hasImage = !!server.icon_url
  const displayName = (server.name || "")
    .replace(/[\p{Extended_Pictographic}\uFE0F\u200D]/gu, "")
    .replace(/[\u{1F300}-\u{1FAFF}\u{1F1E6}-\u{1F1FF}\u{2700}-\u{27BF}]/gu, "")
    .trim() || server.name

  return (
    <div className="gradient-border rounded-2xl p-[1px]">
      <div className="panel panel-hover animate-floatUp neon overflow-hidden">
        <Card className="bg-transparent border-none shadow-none">
          <CardHeader>
            <div className="flex flex-col items-start gap-3">
            {hasImage ? (
              <div className="w-14 h-14 rounded-xl overflow-hidden">
                <Image
                  src={server.icon_url as string}
                  alt={displayName}
                  width={112}
                  height={112}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/25 to-accent/20 flex items-center justify-center">
                <Icon className="h-6 w-6" />
              </div>
            )}
              <CardTitle className="text-lg break-words leading-snug">{displayName}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground break-words">{server.description}</p>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button onClick={onCreatePost} className="flex-1">
              Post Here
            </Button>
            <Link href={`/servers/${server.id}`}>
              <Button variant="outline" size="icon">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
