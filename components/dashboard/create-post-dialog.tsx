"use client"

import type React from "react"

import { useState } from "react"
import type { Database } from "@/types/supabase"
import { useSupabase } from "@/components/supabase-provider"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
const autoClassifyPosts = process.env.NEXT_PUBLIC_AUTO_CLASSIFY_POSTS === "true"

type Server = Database["public"]["Tables"]["servers"]["Row"]

interface CreatePostDialogProps {
  isOpen: boolean
  onClose: () => void
  servers: Server[]
  selectedServer: Server | null
  userId: string
}

export default function CreatePostDialog({ isOpen, onClose, servers, selectedServer, userId }: CreatePostDialogProps) {
  const [content, setContent] = useState("")
  const [serverId, setServerId] = useState(selectedServer?.id || "")
  const [expiresIn, setExpiresIn] = useState("24")
  const [loading, setLoading] = useState(false)
  const { supabase } = useSupabase()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!content.trim()) {
      toast.error("Missing info", { description: "Please add content" })
      return
    }

    setLoading(true)

    try {
      if (autoClassifyPosts) {
        const res = await fetch("/api/posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content_text: content, expires_in_hours: Number.parseInt(expiresIn) }),
          // Helps in dev/unload scenarios
          keepalive: true as any,
        })
        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          throw new Error(data?.error || "Failed to create post")
        }
        const data = await res.json().catch(() => ({} as any))
        if (data?.serverId) {
          toast.success("Post created!", { description: "Taking you to the server" })
          router.push(`/servers/${data.serverId}`)
        }
      } else {
        const expiresAt = new Date()
        expiresAt.setHours(expiresAt.getHours() + Number.parseInt(expiresIn))
        const { error } = await supabase.from("posts").insert({
          user_id: userId,
          server_id: serverId,
          content_text: content,
          expires_at: expiresAt.toISOString(),
        })
        if (error) throw error
      }

      toast.success("Post created!", {
        description: "Your post is now live",
      })

      setContent("")
      onClose()
      router.refresh()
    } catch (error: any) {
      // Ignore abort errors triggered by dev reloads/navigation
      if (error?.name === "AbortError" || String(error).includes("The user aborted a request")) {
        return
      }
      toast.error("Error", { description: error?.message || "Something went wrong" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Post</DialogTitle>
          <DialogDescription>Share your thoughts with the community</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            {!autoClassifyPosts && (
              <>
                <Label>Server</Label>
                <Select value={serverId} onValueChange={setServerId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a server" />
                  </SelectTrigger>
                  <SelectContent>
                    {servers.map((server) => (
                      <SelectItem key={server.id} value={server.id}>
                        {server.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </>
            )}
          </div>
          <div>
            <Label>Content</Label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind?"
              className="min-h-[100px]"
            />
          </div>
          <div>
            <Label>Expires in</Label>
            <Select value={expiresIn} onValueChange={setExpiresIn}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 hour</SelectItem>
                <SelectItem value="6">6 hours</SelectItem>
                <SelectItem value="12">12 hours</SelectItem>
                <SelectItem value="24">24 hours</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Post
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
