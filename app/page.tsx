import { createServerSupabaseClient } from "@/lib/supabase"
import LandingPage from "@/components/landing-page"
import { redirect } from "next/navigation"

export default async function Home() {
  try {
    const supabase = createServerSupabaseClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    console.log("Home page session check:", session?.user?.email)

    // If user is logged in, redirect to dashboard
    if (session?.user) {
      redirect("/dashboard")
    }
  } catch (error) {
    console.log("Home page session check failed:", error)
  }

  return <LandingPage />
}
