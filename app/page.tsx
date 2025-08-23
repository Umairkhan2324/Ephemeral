export const dynamic = "force-dynamic"
import { createServerSupabaseClient } from "@/lib/supabase"
import LandingPage from "@/components/landing-page"
import { redirect } from "next/navigation"

export default async function Home() {
  try {
    const supabase = createServerSupabaseClient()
    const { data: userData } = await supabase.auth.getUser()

    console.log("Home page user check:", userData?.user?.email)

    // If user is logged in, redirect to dashboard
    if (userData?.user) {
      redirect("/dashboard")
    }
  } catch (error) {
    console.log("Home page session check failed:", error)
  }

  return <LandingPage />
}
