import { notFound, redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase"
import ServerPage from "@/components/server/server-page"

interface ServerPageProps {
  params: {
    id: string
  }
}

export default async function ServerDetailPage({ params }: ServerPageProps) {
  const supabase = createServerSupabaseClient()

  const { data: userData, error: userError } = await supabase.auth.getUser()
  if (userError || !userData?.user) redirect("/login")

  const { data: server } = await supabase.from("servers").select("*").eq("id", params.id).single()

  if (!server) notFound()

  const { data: posts } = await supabase
    .from("posts")
    .select(`
      *,
      users:user_id (
        id,
        username,
        avatar_url
      )
    `)
    .eq("server_id", params.id)
    .gt("expires_at", new Date().toISOString())
    .order("created_at", { ascending: false })

  const { data: user } = await supabase.from("users").select("*").eq("id", userData.user.id).single()

  return <ServerPage server={server} posts={posts || []} user={user!} />
}
