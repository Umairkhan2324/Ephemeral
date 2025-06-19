import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MailCheck } from "lucide-react"

export default function CheckEmailPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="items-center text-center space-y-2">
          <MailCheck className="h-12 w-12 text-primary" />
          <CardTitle className="text-2xl">Check your email</CardTitle>
          <CardDescription>
            We&apos;ve sent a verification link to your email address. Please click the link to activate your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-center text-muted-foreground">
            You can close this window.
          </p>
        </CardContent>
        <CardFooter className="flex-col gap-4">
          <Link href="/login" className="w-full">
            <Button variant="outline" className="w-full">
              Back to Login
            </Button>
          </Link>
          <p className="text-xs text-muted-foreground text-center">
            (Debug: Emails are being sent with this base URL: {siteUrl || "URL not set"})
          </p>
        </CardFooter>
      </Card>
    </div>
  )
} 