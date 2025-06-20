"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useSupabase } from "@/components/supabase-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Sparkles, Eye, EyeOff } from "lucide-react"

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { supabase } = useSupabase()
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const error = searchParams.get('error')
    if (error) {
      let errorMessage = "Authentication Error"
      let errorDescription = "Please try logging in again"

      switch (error) {
        case "profile_fetch_error":
          errorMessage = "Profile Error"
          errorDescription = "There was an issue accessing your profile. Please try again."
          break
        case "profile_creation_failed":
          errorMessage = "Account Setup Error"
          errorDescription = "We couldn't set up your profile. Please contact support."
          break
        case "profile_unavailable":
          errorMessage = "Profile Unavailable"
          errorDescription = "Your profile couldn't be loaded. Please try signing in again."
          break
        case "missing_user_data":
          errorMessage = "Incomplete Account"
          errorDescription = "Your account is missing required information. Please contact support."
          break
        case "unexpected":
          errorMessage = "Unexpected Error"
          errorDescription = "Something went wrong. Please try again or contact support."
          break
      }

      toast.error(errorMessage, {
        description: errorDescription,
      })
    }
  }, [searchParams])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      toast.error("Missing fields", {
        description: "Please enter both email and password",
      })
      return
    }

    setLoading(true)
    
    // Show loading toast
    const loadingToast = toast.loading("Signing you in...", {
      description: "Please wait while we authenticate your account",
    })

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      // Dismiss loading toast
      toast.dismiss(loadingToast)

      if (error) {
        console.error("Login error:", error)
        
        // Better error messaging based on error type
        let errorMessage = "Invalid email or password"
        let errorDescription = "Please check your credentials and try again"
        
        if (error.message.includes("Invalid login credentials")) {
          errorMessage = "Invalid credentials"
          errorDescription = "The email or password you entered is incorrect"
        } else if (error.message.includes("Email not confirmed")) {
          errorMessage = "Email not verified"
          errorDescription = "Please check your email and click the verification link"
        } else if (error.message.includes("Too many requests")) {
          errorMessage = "Too many attempts"
          errorDescription = "Please wait a few minutes before trying again"
        } else if (error.message.includes("Network")) {
          errorMessage = "Connection error"
          errorDescription = "Please check your internet connection and try again"
        }

        toast.error(errorMessage, {
          description: errorDescription,
        })
        return
      }

      if (data.user) {
        console.log("Login successful for user:", data.user.email)
        
        toast.success("Welcome back!", {
          description: `Successfully signed in as ${data.user.email}`,
        })

        // Don't manually navigate - let the SupabaseProvider handle it
        // The auth state change will trigger navigation
      }
    } catch (error: any) {
      console.error("Unexpected login error:", error)
      toast.dismiss(loadingToast)
      toast.error("Login failed", {
        description: "An unexpected error occurred. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-center mb-2">
          <Sparkles className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-2xl text-center">Welcome back</CardTitle>
        <CardDescription className="text-center">Enter your credentials to sign in to your account</CardDescription>
      </CardHeader>
      <form onSubmit={handleLogin}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              autoComplete="email"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                autoComplete="current-password"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                disabled={loading}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col">
          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </Button>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}
