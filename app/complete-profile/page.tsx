"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { UserCheck } from "lucide-react"

// Firebase imports
import { auth, db } from "@/lib/firebase"
import { updateProfile } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"

export default function CompleteProfilePage() {
  const [userData, setUserData] = useState<any>(null)
  const [additionalInfo, setAdditionalInfo] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem("user")
    if (!user) {
      router.push("/signin")
      return
    }
    
    try {
      const parsedUser = JSON.parse(user)
      setUserData(parsedUser)
      
      // If user is not new, redirect to lectures
      if (!parsedUser.isNewUser) {
        router.push("/lectures")
      }
    } catch (e) {
      localStorage.removeItem("user")
      router.push("/signin")
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const user = auth.currentUser
      if (user) {
        // Update user profile in Firebase Auth if needed
        // await updateProfile(user, { ... })

        // Update Firestore user doc
        const userRef = doc(db, "users", user.uid)
        await setDoc(userRef, {
          ...userData,
          additionalInfo,
          profileCompleted: true,
          isNewUser: false,
        }, { merge: true })

        // Update local storage
        const updatedUser = {
          ...userData,
          additionalInfo,
          profileCompleted: true,
          isNewUser: false,
        }
        localStorage.setItem("user", JSON.stringify(updatedUser))

        setIsLoading(false)
        router.push("/lectures")
      } else {
        throw new Error("No user is signed in")
      }
    } catch (error: any) {
      setIsLoading(false)
      setError(error.message || 'Failed to update profile. Please try again.')
    }
  }

  // If no user data, show loading
  if (!userData) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4">
            <UserCheck className="h-6 w-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold">Complete Your Profile</CardTitle>
          <CardDescription>Just a few more details to personalize your experience</CardDescription>
        </CardHeader>

        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={userData.email || ""}
                disabled
              />
              <p className="text-xs text-muted-foreground">Email cannot be changed</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                value={userData.name || ""}
                disabled
              />
              <p className="text-xs text-muted-foreground">Name from your Google account</p>
            </div>

            {/* Add any other fields you want to collect */}
            <div className="space-y-2">
              <Label htmlFor="additionalInfo">Additional Information</Label>
              <Input
                id="additionalInfo"
                type="text"
                placeholder="Any additional information you'd like to share"
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Saving..." : "Complete Profile"}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <Button variant="ghost" onClick={() => router.push("/lectures")}>
              Skip for Now
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
