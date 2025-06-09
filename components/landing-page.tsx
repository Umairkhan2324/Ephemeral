import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Clock, Sparkles, Zap } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">Ephemeral</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost">Login</Button>
          </Link>
          <Link href="/signup">
            <Button>Sign Up</Button>
          </Link>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                  <span className="gradient-text">Share moments</span> that fade away
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-400 md:text-xl">
                  The social platform where your content disappears. No pressure, just vibes.
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/signup">
                  <Button className="px-8">
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="bg-primary/10 p-4 rounded-full">
                  <Clock className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Ephemeral Content</h3>
                  <p className="text-gray-400">Posts disappear after 24 hours. No digital footprint, no regrets.</p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="bg-primary/10 p-4 rounded-full">
                  <Zap className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">12 Vibrant Servers</h3>
                  <p className="text-gray-400">Find your tribe across 12 different interest-based servers.</p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="bg-primary/10 p-4 rounded-full">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Express Yourself</h3>
                  <p className="text-gray-400">Share text, images, videos, and more with your community.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full border-t px-4 md:px-6">
        <p className="text-xs text-gray-400">© 2025 Ephemeral. All rights reserved.</p>
      </footer>
    </div>
  )
}
