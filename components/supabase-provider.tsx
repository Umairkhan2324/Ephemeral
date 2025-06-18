"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { useRouter } from "next/navigation"
import type { Session, SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

type SupabaseContext = {
  supabase: SupabaseClient<Database>
  session: Session | null
}

const Context = createContext<SupabaseContext | undefined>(undefined)

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [supabase] = useState(() => 
    createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  )
  const [session, setSession] = useState<Session | null>(null)
  const router = useRouter()

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session?.user?.email)
      setSession(session)

      if (event === "SIGNED_IN") {
        console.log("User signed in, navigating to dashboard...")
        // Only navigate if we're not already on dashboard or protected routes
        if (window.location.pathname === "https://ephemeral-liart.vercel.app//login" || window.location.pathname === "https://ephemeral-liart.vercel.app/signup" || window.location.pathname === "https://ephemeral-liart.vercel.app/") {
          router.push("https://ephemeral-liart.vercel.app/dashboard")
        } else {
          router.refresh()
        }
      } else if (event === "SIGNED_OUT") {
        console.log("User signed out, navigating to home...")
        router.push("https://ephemeral-liart.vercel.app/")
      }
    })

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Initial session check:", session?.user?.email)
      setSession(session)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router, supabase])

  return <Context.Provider value={{ supabase, session }}>{children}</Context.Provider>
}

export const useSupabase = () => {
  const context = useContext(Context)
  if (context === undefined) {
    throw new Error("useSupabase must be used inside SupabaseProvider")
  }
  return context
}
