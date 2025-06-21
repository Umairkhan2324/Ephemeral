"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSupabase } from "@/components/supabase-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Sparkles, Eye, EyeOff } from "lucide-react"

export default function SignupForm() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [lastAttempt, setLastAttempt] = useState<number | null>(null)
  const { supabase } = useSupabase()
  const router = useRouter()

  const validateForm = () => {
    // Check if user is trying too quickly
    if (lastAttempt && Date.now() - lastAttempt < 5000) {
      toast.error("Please wait", {
        description: "Wait a few seconds between signup attempts",
      })
      return false
    }

    if (!username.trim()) {
      toast.error("Username required", {
        description: "Please enter a username",
      })
      return false
    }

    if (username.trim().length < 3) {
      toast.error("Username too short", {
        description: "Username must be at least 3 characters long",
      })
      return false
    }

    if (!email.trim()) {
      toast.error("Email required", {
        description: "Please enter your email address",
      })
      return false
    }

    if (!password) {
      toast.error("Password required", {
        description: "Please enter a password",
      })
      return false
    }

    if (password.length < 6) {
      toast.error("Password too short", {
        description: "Password must be at least 6 characters long",
      })
      return false
    }

    return true
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    // Record attempt time
    setLastAttempt(Date.now())
    setLoading(true)

    // Show loading toast
    const loadingToast = toast.loading("Creating your account...", {
      description: "Please wait while we set up your profile",
    })

    console.log("Starting signup process for:", email.trim())

    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            username: username.trim(),
          }
        },
      })

      if (authError) {
        console.error("Auth signup error:", authError)
        toast.dismiss(loadingToast)

        let errorMessage = "Signup failed"
        let errorDescription = "Please try again"

        if (authError.message.includes("already registered")) {
          errorMessage = "Email already exists"
          errorDescription = "This email is already registered. Please use a different email or try logging in."
        } else if (authError.message.includes("Invalid email")) {
          errorMessage = "Invalid email"
          errorDescription = "Please enter a valid email address"
        } else if (authError.message.includes("Password")) {
          errorMessage = "Password requirements not met"
          errorDescription = "Password must be at least 6 characters long"
        } else if (authError.message.includes("Too many requests") || authError.message.includes("rate limit") || authError.status === 429) {
          errorMessage = "Too many signup attempts"
          errorDescription = "Please wait a few minutes before trying again. If this persists, try again in an hour."
        } else if (authError.message.includes("Network")) {
          errorMessage = "Connection error"
          errorDescription = "Please check your internet connection and try again"
        }

        toast.error(errorMessage, {
          description: errorDescription,
        })
        return
      }

      if (authData.user) {
        console.log("Auth user created successfully:", authData.user.id)

        // Create user profile in database
        console.log("Creating user profile...")
        const { error: profileError } = await supabase.from("users").insert({
          id: authData.user.id,
          username: username.trim(),
          email: email.trim(),
          avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username.trim()}`,
        })

        toast.dismiss(loadingToast)

        if (profileError) {
          console.error("Profile creation error:", profileError)
          
          // Even if profile creation fails, the user was created
          toast.warning("Account created with issues", {
            description: "Your account was created but there was an issue setting up your profile. Please try logging in.",
          })
        } else {
          console.log("Profile created successfully")
          toast.success("Account created successfully!", {
            description: "Your account has been created. Please sign in to continue.",
          })
        }

        // Always redirect to login page after signup
        setTimeout(() => {
          router.push("/login")
        }, 1500)
      }
    } catch (error: any) {
      console.error("Unexpected signup error:", error)
      toast.dismiss(loadingToast)
      toast.error("Signup failed", {
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
        <CardTitle className="text-2xl text-center">Create an account</CardTitle>
        <CardDescription className="text-center">Enter your details to create your Ephemeral account</CardDescription>
      </CardHeader>
      <form onSubmit={handleSignup}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="cooluser"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
              autoComplete="username"
              minLength={3}
            />
            <p className="text-xs text-muted-foreground">At least 3 characters</p>
          </div>
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
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                autoComplete="new-password"
                minLength={6}
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
            <p className="text-xs text-muted-foreground">Must be at least 6 characters</p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col">
          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
          </Button>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}
