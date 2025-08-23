import { formatDistanceToNow } from "date-fns"
import type { Database } from "@/types/supabase"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Clock } from "lucide-react"

type PostWithUser = Database["public"]["Tables"]["posts"]["Row"] & {
  users: {
    id: string
    username: string
    avatar_url: string | null
  }
}

interface PostCardProps {
  post: PostWithUser
}

export default function PostCard({ post }: PostCardProps) {
  const timeRemaining = formatDistanceToNow(new Date(post.expires_at), { addSuffix: true })
  const createdTime = formatDistanceToNow(new Date(post.created_at), { addSuffix: true })

  return (
    <div className="panel panel-hover animate-floatUp">
      <Card className="bg-transparent border-none shadow-none">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={post.users.avatar_url || undefined} />
              <AvatarFallback>{post.users.username[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{post.users.username}</div>
              <div className="text-xs text-muted-foreground">{createdTime}</div>
            </div>
          </div>
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="h-3 w-3 mr-1" />
            <span>Expires {timeRemaining}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-line leading-7">{post.content_text}</p>
      </CardContent>
      </Card>
    </div>
  )
}
