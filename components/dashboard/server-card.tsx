"use client"

import type { Database } from "@/types/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
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
  return (
    <div className="panel panel-hover animate-floatUp">
      <Card className="bg-transparent border-none shadow-none">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/25 to-accent/20 flex items-center justify-center">
              <Icon className="h-5 w-5" />
            </div>
            <CardTitle className="text-lg">{server.name}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{server.description}</p>
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
  )
}
