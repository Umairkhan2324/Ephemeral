import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase"
import SignupForm from "@/components/auth/signup-form"

export default async function SignupPage() {
  const supabase = createServerSupabaseClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // If user is logged in, redirect to dashboard
  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <SignupForm />
    </div>
  )
}
