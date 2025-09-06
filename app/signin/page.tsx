"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, LogIn, Loader2 } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { GoogleAuthButton } from "@/components/google-auth-button"
import { GoogleAuthTroubleshooter } from "@/components/google-auth-troubleshoot"

// Firebase imports
import { auth, db } from "@/lib/firebase"
import { signInWithEmailAndPassword } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"

export default function SignInPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [emailLoading, setEmailLoading] = useState(false)
  const router = useRouter()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setEmailLoading(true)

    if (!email || !password) {
      setError("Email and password are required")
      setEmailLoading(false)
      return
    }

    try {
      if (!auth || !db) {
        throw new Error("Firebase not initialized")
      }

      // Show loading toast
      const loadingToast = toast.loading("Signing in...")

      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // Create or update user document
      const userRef = doc(db, "users", user.uid)
      await setDoc(
        userRef,
        {
          email: user.email,
          name: user.displayName || email.split("@")[0],
          uid: user.uid,
          lastLogin: new Date().toISOString(),
        },
        { merge: true }
      )

      // Update localStorage with user data
      localStorage.setItem(
        "user",
        JSON.stringify({
          email: user.email,
          name: user.displayName || email.split("@")[0],
          uid: user.uid,
          lastLogin: new Date().toISOString(),
        })
      )

      // Dismiss loading toast and show success
      toast.dismiss(loadingToast)
      toast.success("Signed in successfully!")

      // Set a short timeout to ensure the UI updates before redirect
      setTimeout(() => {
        router.push("/lectures")
      }, 300)
    } catch (error: any) {
      console.error("Sign in error:", error.code, error.message)

      let errorMessage = "Sign in failed. Please try again."
      if (error.code === "auth/user-not-found") {
        errorMessage = "Account does not exist. Please sign up first."
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Incorrect password. Please try again."
      } else if (error.code === "auth/invalid-credential") {
        errorMessage = "Invalid credentials. Please check your email and password."
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email format."
      } else if (error.code === "auth/too-many-requests")
        errorMessage = "Too many failed login attempts. Please try again later or reset your password."
      else if (error.code === "auth/network-request-failed") errorMessage = "Network error. Please check your internet connection."

      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setEmailLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4">
            <LogIn className="h-6 w-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription>Sign in to continue your learning journey</CardDescription>
        </CardHeader>

        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Google Sign-In Button */}
          <div className="mb-6">
            <GoogleAuthButton mode="signin" />

            {/* Add the troubleshooter component */}
            <div className="text-center mt-2">
              <GoogleAuthTroubleshooter />
            </div>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or sign in with email</span>
            </div>
          </div>

          <form id="email-form" onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <div className="flex justify-end">
              <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="w-full" disabled={emailLoading}>
              {emailLoading ? (
                <span className="flex items-center">
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Signing In...
                </span>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/signup" className="text-primary hover:underline">
              Sign up here
            </Link>
          </div>

          <div className="mt-4 text-center">
            <Link href="/" className="text-sm text-muted-foreground hover:underline">
              Back to Home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


