import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { SupabaseProvider } from "@/components/supabase-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Ephemeral - Gen Z Social Platform",
  description: "Share moments that disappear. Connect with your tribe.",
    generator: 'UMAIR KHAN',
    icons: {
      icon: '/favicon.ico',
    },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <SupabaseProvider>
            {children}
            <Toaster 
              position="top-right"
              expand={true}
              richColors={true}
              closeButton={true}
            />
          </SupabaseProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
