"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useSupabase } from "@/components/supabase-provider"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

type Props = {
  userId: string
  username: string
  currentUrl?: string
}

function dicebearUrl(sprite: string, seed: string) {
  return `https://api.dicebear.com/7.x/${sprite}/svg?seed=${encodeURIComponent(seed)}`
}

export default function AvatarChooser({ userId, username, currentUrl }: Props) {
  const { supabase } = useSupabase()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const options = useMemo(() => {
    const seedBase = username || "user"
    return [
      dicebearUrl("avataaars", seedBase),
      dicebearUrl("adventurer-neutral", seedBase),
      dicebearUrl("bottts-neutral", seedBase + "-bot"),
      dicebearUrl("shapes", seedBase + "-shapes"),
      dicebearUrl("lorelei", seedBase + "-lorelei"),
      dicebearUrl("notionists-neutral", seedBase + "-notion"),
    ]
  }, [username])

  const [selected, setSelected] = useState<string | undefined>(currentUrl)
  const [saving, setSaving] = useState(false)

  const onSave = async () => {
    if (!selected) return
    setSaving(true)
    try {
      const { error } = await supabase
        .from("users")
        .update({ avatar_url: selected })
        .eq("id", userId)
        .single()
      if (error) throw error
      toast.success("Avatar updated")
      setOpen(false)
      router.refresh()
    } catch (err: any) {
      toast.error("Failed to update avatar", { description: err?.message || "Try again later" })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">Change</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Choose your avatar</DialogTitle>
          <DialogDescription>Pick one of these styles. You can change it anytime.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-3 gap-4">
          {options.map((url) => (
            <button
              key={url}
              type="button"
              onClick={() => setSelected(url)}
              className={`rounded-xl border p-2 transition ${selected === url ? "ring-2 ring-primary" : "hover:border-primary/50"}`}
            >
              <div className="relative w-full pt-[100%] overflow-hidden rounded-lg">
                <Image src={url} alt="avatar" fill className="object-cover" />
              </div>
            </button>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={saving}>Cancel</Button>
          <Button onClick={onSave} disabled={!selected || saving}>{saving ? "Saving..." : "Save"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


