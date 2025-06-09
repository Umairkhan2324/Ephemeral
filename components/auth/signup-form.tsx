"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useSupabase } from "@/components/supabase-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Sparkles } from "lucide-react"

export default function SignupForm() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const { supabase } = useSupabase()
  const { toast } = useToast()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      })

      if (authError) throw authError

      if (authData.user) {
        // Create user profile
        const { error: profileError } = await supabase.from("users").insert({
          id: authData.user.id,
          username,
          email,
          avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
        })

        if (profileError) {
          console.error("Profile creation error:", profileError)
        }

        toast({
          title: "Account created!",
          description: "Please check your email to verify your account, then you can log in.",
        })

        // Redirect to login page
        setTimeout(() => {
          window.location.href = "/login"
        }, 2000)
      }
    } catch (error: any) {
      console.error("Signup error:", error)
      toast({
        title: "Signup failed",
        description: error.message || "Something went wrong",
        variant: "destructive",
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
            />
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
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
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
