"use client"

import type { Database } from "@/types/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

type Server = Database["public"]["Tables"]["servers"]["Row"]

interface ServerCardProps {
  server: Server
  onCreatePost: () => void
}

export default function ServerCard({ server, onCreatePost }: ServerCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-xl">
            {server.name.split(" ")[0]}
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
        <Link href={`https://ephemeral-liart.vercel.app//servers/${server.id}`}>
          <Button variant="outline" size="icon">
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
