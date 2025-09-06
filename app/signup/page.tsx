"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, UserPlus, Check, X, Mail } from "lucide-react"
import { FcGoogle } from "react-icons/fc"
import { Separator } from "@/components/ui/separator"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { GoogleAuthButton } from "@/components/google-auth-button"
import { GoogleAuthTroubleshooter } from "@/components/google-auth-troubleshoot"

// Firebase imports
import { auth, db } from "@/lib/firebase"
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
  GoogleAuthProvider,
  getAdditionalUserInfo,
} from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"

export default function SignUpPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [passwordFocused, setPasswordFocused] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [emailLoading, setEmailLoading] = useState(false)
  const router = useRouter()

  // Password validation criteria
  const [passwordCriteria, setPasswordCriteria] = useState({
    minLength: false,
    hasLower: false,
    hasUpper: false,
    hasNumber: false,
    hasSpecial: false
  })

  // Update password criteria whenever password changes
  useEffect(() => {
    setPasswordCriteria({
      minLength: password.length >= 8,
      hasLower: /[a-z]/.test(password),
      hasUpper: /[A-Z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    })
  }, [password])

  // Check if all password criteria are met
  const allCriteriaMet = Object.values(passwordCriteria).every(Boolean)

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setEmailLoading(true)

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields")
      setEmailLoading(false)
      return
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address")
      setEmailLoading(false)
      return
    }

    if (!allCriteriaMet) {
      setError("Password does not meet all requirements")
      setEmailLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setEmailLoading(false)
      return
    }

    try {
      console.log("Starting account creation...")
      // Show loading toast
      const loadingToast = toast.loading("Creating your account...")
      
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth!, email, password)
      console.log("User created in Firebase Auth")
      
      // Update profile
      try {
        await updateProfile(userCredential.user, { displayName: name })
        console.log("User profile updated")
      } catch (profileError) {
        console.error("Error updating profile:", profileError)
        // Continue even if profile update fails
      }

      // Prepare user data
      const userData = {
        email,
        name,
        uid: userCredential.user.uid,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      }

      // Store user info in Firestore
      try {
        console.log("Attempting to save to Firestore...")
        const userRef = doc(db!, "users", userCredential.user.uid)
        await setDoc(userRef, userData, { merge: true })
        console.log("User saved to Firestore")
      } catch (firestoreError) {
        console.error("Firestore error:", firestoreError)
        // Continue even if Firestore fails - localStorage will have the user info
      }

      // Store user info in localStorage
      console.log("Saving user to localStorage")
      localStorage.setItem("user", JSON.stringify(userData))

      // Dismiss loading toast and show success
      toast.dismiss(loadingToast)
      toast.success("Account created successfully!")
      
      console.log("Redirecting to lectures page...")
      // Set a short timeout to ensure the UI updates before redirect
      setTimeout(() => {
        router.push("/lectures")
      }, 500)
    } catch (error: any) {
      console.error("Sign up error:", error)
      
      let errorMessage = "Failed to create account. Please try again."
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already in use. Please try another one or sign in.'
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email format.'
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Please create a stronger password.'
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your internet connection.'
      }
      
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setEmailLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setError("")
    setGoogleLoading(true)

    try {
      console.log("Starting Google sign up process...")
      const loadingToast = toast.loading("Signing up with Google...")
      
      // Create a fresh provider instance
      const freshGoogleProvider = new GoogleAuthProvider()
      freshGoogleProvider.setCustomParameters({
        prompt: 'select_account',
        access_type: 'offline',
      })
      
      console.log("Initiating Google popup...")
      // Clear any previous auth state before starting
      // Add a small delay to ensure the UI is ready
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const result = await signInWithPopup(auth!, freshGoogleProvider)
      console.log("Google sign up successful:", result.user.uid)
      
      const user = result.user
      const additionalInfo = getAdditionalUserInfo(result)
      const isNewUser = additionalInfo?.isNewUser
      
      console.log("Is new user:", isNewUser)

      // Store user info in Firestore
      const userRef = doc(db!, "users", user.uid)
      console.log("Updating user data in Firestore...")
      await setDoc(userRef, {
        email: user.email,
        name: user.displayName,
        photoURL: user.photoURL,
        uid: user.uid,
        createdAt: isNewUser ? new Date().toISOString() : null,
        lastLogin: new Date().toISOString(),
        isNewUser,
      }, { merge: true })

      // Store user info in localStorage
      const userData = {
        email: user.email,
        name: user.displayName,
        photoURL: user.photoURL,
        uid: user.uid,
        createdAt: isNewUser ? new Date().toISOString() : null,
        lastLogin: new Date().toISOString(),
        isNewUser,
      }
      
      console.log("Saving user data to localStorage:", userData)
      localStorage.setItem("user", JSON.stringify(userData))

      // Dismiss loading toast and show success
      toast.dismiss(loadingToast)
      toast.success(isNewUser ? "Account created successfully!" : "Signed in successfully!")
      
      console.log("Redirecting user...")
      // Increase timeout to ensure localStorage is properly set
      setTimeout(() => {
        if (isNewUser) {
          router.push("/complete-profile")
        } else {
          router.push("/lectures")
        }
      }, 800)
    } catch (error: any) {
      console.error("Google sign-up error - Code:", error.code)
      console.error("Google sign-up error - Message:", error.message)
      
      let errorMessage = "Google sign-up failed. Please try again."
      
      // Detailed error handling with improved messages
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Sign-up popup was closed. Please try again.'
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage = 'Pop-up was blocked by your browser. Please enable pop-ups for this site.'
      } else if (error.code === 'auth/cancelled-popup-request') {
        errorMessage = 'Sign-up was cancelled. Please try again.'
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your internet connection and try again.'
      } else if (error.code === 'auth/unauthorized-domain') {
        errorMessage = 'This domain is not authorized for Google sign-up. Please contact support.'
      } else if (error.code === 'auth/internal-error') {
        errorMessage = 'An internal error occurred. Please try again later.'
      }
      
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setGoogleLoading(false)
    }
  }

  // Password criteria component
  const PasswordCriteriaIndicator = ({ met, text }: { met: boolean; text: string }) => (
    <div className="flex items-center gap-2 text-sm">
      {met ? (
        <Check className="h-4 w-4 text-green-500" />
      ) : (
        <X className="h-4 w-4 text-red-500" />
      )}
      <span className={met ? "text-green-500" : "text-muted-foreground"}>{text}</span>
    </div>
  )

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4">
            <UserPlus className="h-6 w-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold">Create SkillBit Account</CardTitle>
          <CardDescription>Join SkillBit to start your personalized learning journey</CardDescription>
        </CardHeader>

        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Authentication Button - Replace with new component */}
          <div className="mb-6">
            <GoogleAuthButton mode="signup" />
            
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
              <span className="bg-background px-2 text-muted-foreground">Or fill out the form</span>
            </div>
          </div>

          <form id="email-form" onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

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
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setPasswordFocused(true)}
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
              
              {/* Password criteria checklist */}
              {(passwordFocused || password.length > 0) && (
                <div className="mt-2 space-y-1 p-3 bg-muted/50 rounded-md">
                  <p className="text-sm font-medium mb-2">Password must include:</p>
                  <PasswordCriteriaIndicator met={passwordCriteria.minLength} text="At least 8 characters" />
                  <PasswordCriteriaIndicator met={passwordCriteria.hasLower} text="At least one lowercase letter (a-z)" />
                  <PasswordCriteriaIndicator met={passwordCriteria.hasUpper} text="At least one uppercase letter (A-Z)" />
                  <PasswordCriteriaIndicator met={passwordCriteria.hasNumber} text="At least one number (0-9)" />
                  <PasswordCriteriaIndicator met={passwordCriteria.hasSpecial} text="At least one special character (!@#$%^&*)" />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              {confirmPassword && password !== confirmPassword && (
                <p className="text-sm text-red-500 mt-1">Passwords do not match</p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={emailLoading || googleLoading || !allCriteriaMet || password !== confirmPassword}
            >
              {emailLoading ? (
                <span className="flex items-center">
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating Account...
                </span>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/signin" className="text-primary hover:underline">
              Sign in here
            </Link>
          </div>

          <div className="mt-4 text-center">
            <Link href="/" className="text-sm text-muted-foreground hover:underline">
              Back to SkillBit Home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
