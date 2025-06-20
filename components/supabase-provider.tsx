"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { useRouter } from "next/navigation"
import type { Session, SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"
import { toast } from "sonner"

type SupabaseContext = {
  supabase: SupabaseClient<Database>
  session: Session | null
  loading: boolean
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
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    let mounted = true

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.email)
      
      if (!mounted) return

      setSession(session)
      setLoading(false)

      if (event === "SIGNED_IN" && session?.user) {
        console.log("User signed in successfully:", session.user.email)
        
        // Small delay to ensure state is updated
        setTimeout(() => {
          const currentPath = window.location.pathname
          console.log("Current path:", currentPath)
          
          if (currentPath === "/login" || currentPath === "/signup" || currentPath === "/") {
            console.log("Redirecting to dashboard...")
            router.push("/dashboard")
          } else {
            console.log("Refreshing current page...")
            router.refresh()
          }
        }, 100)
      } else if (event === "SIGNED_OUT") {
        console.log("User signed out")
        setLoading(false)
        
        // Only redirect if we're on a protected route
        setTimeout(() => {
          const currentPath = window.location.pathname
          const publicPaths = ["/", "/login", "/signup", "/forgot-password", "/reset-password", "/check-email"]
          
          if (!publicPaths.includes(currentPath)) {
            console.log("Redirecting to home after signout...")
            router.push("/")
          }
        }, 100)
      } else if (event === "TOKEN_REFRESHED") {
        console.log("Token refreshed")
      } else if (event === "USER_UPDATED") {
        console.log("User updated")
      }
    })

    // Check for existing session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error("Error getting initial session:", error)
          toast.error("Authentication Error", {
            description: "There was a problem with your session. Please try logging in again.",
          })
        }
        
        console.log("Initial session check:", session?.user?.email || "No session")
        
        if (mounted) {
          setSession(session)
          setLoading(false)
        }
      } catch (error) {
        console.error("Unexpected error getting session:", error)
        if (mounted) {
          setLoading(false)
        }
      }
    }

    getInitialSession()

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [router, supabase])

  return (
    <Context.Provider value={{ supabase, session, loading }}>
      {children}
    </Context.Provider>
  )
}

export const useSupabase = () => {
  const context = useContext(Context)
  if (context === undefined) {
    throw new Error("useSupabase must be used inside SupabaseProvider")
  }
  return context
}
