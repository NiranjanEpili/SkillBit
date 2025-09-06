"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, LogIn, Mail } from "lucide-react"
import { FcGoogle } from "react-icons/fc"
import { Separator } from "@/components/ui/separator"

// Firebase imports
import { auth, googleProvider } from "@/lib/firebase"
import { signInWithEmailAndPassword, signInWithPopup, getAdditionalUserInfo } from "firebase/auth"

export default function SignInPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // Check if user exists and has completed profile
      if (!user) {
        setError('Account does not exist. Please sign up first.')
        setIsLoading(false)
        return
      }

      // Store user info
      localStorage.setItem(
        "user",
        JSON.stringify({
          email: user.email,
          name: user.displayName,
          uid: user.uid,
          signedInAt: new Date().toISOString(),
        }),
      )

      setIsLoading(false)
      router.push("/lectures")
    } catch (error: any) {
      setIsLoading(false)
      if (error.code === 'auth/user-not-found') {
        setError('Account does not exist. Please sign up first.')
      } else if (error.code === 'auth/wrong-password') {
        setError('Incorrect password. Please try again.')
      } else if (error.code === 'auth/invalid-credential') {
        setError('Invalid credentials. Account may not exist.')
      } else if (error.code === 'auth/invalid-email') {
        setError('Invalid email format.')
      } else {
        setError(error.message || 'Failed to sign in. Please try again.')
      }
      console.error("Authentication error:", error.code, error.message);
    }
  }

  const handleGoogleSignIn = async () => {
    setError("")
    setIsLoading(true)

    try {
      const result = await signInWithPopup(auth, googleProvider)
      const user = result.user
      
      // For Google Auth, we should check if this is a first-time user
      const additionalInfo = getAdditionalUserInfo(result);
      const isNewUser = additionalInfo?.isNewUser;
      
      // Store user info
      localStorage.setItem(
        "user",
        JSON.stringify({
          email: user.email,
          name: user.displayName,
          uid: user.uid,
          signedInAt: new Date().toISOString(),
          isNewUser: isNewUser, // Track if this is a first-time user
        }),
      )

      setIsLoading(false)
      
      // If it's a new user, we might want to redirect them to complete their profile
      if (isNewUser) {
        router.push("/complete-profile"); // Create this page if you need additional user info
      } else {
        router.push("/lectures");
      }
    } catch (error: any) {
      setIsLoading(false)
      setError(error.message || 'Google sign-in failed. Please try again.')
      console.error("Google Authentication error:", error);
    }
  }

  // Handle phone authentication success
  const handlePhoneAuthSuccess = (phoneNumber: string, userId: string) => {
    // Store user info
    localStorage.setItem(
      "user",
      JSON.stringify({
        phoneNumber,
        uid: userId,
        signedInAt: new Date().toISOString(),
      }),
    )

    // Redirect to lectures page
    router.push("/lectures")
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

          {/* Only Google Sign-In Button */}
          <div className="mb-6">
            <Button 
              variant="outline" 
              type="button" 
              className="w-full flex items-center justify-center gap-3 h-12" 
              onClick={handleGoogleSignIn}
              disabled={isLoading}
            >
              <FcGoogle className="h-5 w-5" />
              <span>Continue with Google</span>
            </Button>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or fill out the form</span>
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

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing In..." : "Sign In"}
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
  

