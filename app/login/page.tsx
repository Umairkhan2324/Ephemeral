import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase"
import LoginForm from "@/components/auth/login-form"
import { Suspense } from "react"

function LoginPageContent() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <LoginForm />
    </div>
  )
}

export default async function LoginPage() {
  const supabase = createServerSupabaseClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // If user is logged in, redirect to dashboard
  if (session) {
    redirect("/dashboard")
  }

  return (
    <Suspense fallback={<div className="container flex h-screen w-screen flex-col items-center justify-center">Loading...</div>}>
      <LoginPageContent />
    </Suspense>
  )
}
