import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase"
import LoginForm from "@/components/auth/login-form"

export default async function LoginPage() {
  const supabase = createServerSupabaseClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // If user is logged in, redirect to dashboard
  if (session) {
    redirect("https://ephemeral-liart.vercel.app/dashboard")
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <LoginForm />
    </div>
  )
}
