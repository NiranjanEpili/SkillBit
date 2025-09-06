"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { FcGoogle } from "react-icons/fc"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

// Firebase imports (named exports)
import { GoogleAuthProvider, signInWithPopup, getAdditionalUserInfo } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"

interface GoogleAuthButtonProps {
  mode?: "signin" | "signup"
  redirectTo?: string
  className?: string
}

export function GoogleAuthButton({
  mode = "signin",
  redirectTo = "/lectures",
  className = "",
}: GoogleAuthButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (!auth) {
      console.warn("Firebase auth not initialized yet")
    }
  }, [])

  const handleGoogleAuth = async () => {
    setIsLoading(true)
    const loadingToast = toast.loading(mode === "signin" ? "Signing in with Google..." : "Signing up with Google...")

    try {
      const provider = new GoogleAuthProvider()
      provider.addScope("https://www.googleapis.com/auth/userinfo.email")
      provider.addScope("https://www.googleapis.com/auth/userinfo.profile")
      provider.setCustomParameters({
        prompt: "select_account",
        access_type: "offline",
      })

      const result = await signInWithPopup(auth, provider)
      if (!result || !result.user) throw new Error("No user returned from Google sign-in")

      const user = result.user
      const additionalInfo = getAdditionalUserInfo(result)
      const isNewUser = !!additionalInfo?.isNewUser

      const userData = {
        uid: user.uid,
        email: user.email,
        name: user.displayName || "",
        photoURL: user.photoURL || null,
        lastLogin: new Date().toISOString(),
        isNewUser,
        provider: "google",
      }

      try {
        const userRef = doc(db, "users", user.uid)
        await setDoc(userRef, userData, { merge: true })
      } catch (fsErr) {
        console.error("Failed to save user to Firestore:", fsErr)
      }

      try {
        localStorage.setItem("user", JSON.stringify(userData))
      } catch (lsErr) {
        console.warn("Failed to save user to localStorage:", lsErr)
      }

      toast.dismiss(loadingToast)
      toast.success(mode === "signin" ? "Signed in successfully!" : "Account created successfully!")

      setTimeout(() => {
        if (isNewUser) router.push("/complete-profile")
        else router.push(redirectTo)
      }, 400)
    } catch (err: any) {
      console.error("Google auth error:", err)
      let message = "Google authentication failed. Please try again."
      if (err?.code === "auth/popup-closed-by-user") message = "Sign-in popup was closed. Please try again."
      else if (err?.code === "auth/popup-blocked") message = "Pop-up blocked. Please enable pop-ups for this site."
      else if (err?.code === "auth/network-request-failed") message = "Network error. Check your connection."

      toast.dismiss(loadingToast)
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant="outline"
      type="button"
      className={`flex items-center justify-center gap-3 h-12 w-full ${className}`}
      onClick={handleGoogleAuth}
      disabled={isLoading}
    >
      {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <FcGoogle className="h-5 w-5" />}
      <span>
        {isLoading
          ? mode === "signin"
            ? "Signing in..."
            : "Signing up..."
          : mode === "signin"
          ? "Continue with Google"
          : "Sign up with Google"}
      </span>
    </Button>
  )
}
