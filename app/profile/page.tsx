"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { User, Camera, Save, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { db } from "@/lib/firebase"
import { doc, setDoc, getDoc } from "firebase/firestore"
import { Navigation } from "@/components/navigation"
import { AuthGuard } from "@/components/auth-guard"

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [name, setName] = useState("")
  const [photo, setPhoto] = useState("")
  const [examTrack, setExamTrack] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Get user data from localStorage first
    const userData = localStorage.getItem("user")
    if (userData) {
      const parsed = JSON.parse(userData)
      setUser(parsed)
      setName(parsed.name || "")
      setPhoto(parsed.photo || "")
      
      // Then try to get fresh data from Firestore
      if (parsed.uid) {
        fetchUserFromFirestore(parsed.uid)
      }
    }
    
    // Get exam track
    const track = localStorage.getItem("examTrack")
    if (track) setExamTrack(track)
  }, [])
  
  const fetchUserFromFirestore = async (uid: string) => {
    try {
      const userRef = doc(db, "users", uid)
      const userDoc = await getDoc(userRef)
      
      if (userDoc.exists()) {
        const firestoreData = userDoc.data()
        // Update state with Firestore data
        setName(firestoreData.name || "")
        setPhoto(firestoreData.photo || "")
        
        // Also update localStorage
        localStorage.setItem("user", JSON.stringify({
          ...user,
          ...firestoreData
        }))
      }
    } catch (err) {
      console.error("Error fetching user data:", err)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")
    
    try {
      const updatedUser = { 
        ...user, 
        name, 
        photo,
        updatedAt: new Date().toISOString()
      }
      
      // Update localStorage
      localStorage.setItem("user", JSON.stringify(updatedUser))
      localStorage.setItem("examTrack", examTrack)
      
      // Update Firestore
      if (updatedUser.uid) {
        const userRef = doc(db, "users", updatedUser.uid)
        await setDoc(userRef, {
          ...updatedUser,
          examTrack,
        }, { merge: true })
      }
      
      setSuccess("Profile updated successfully!")
      setIsLoading(false)
    } catch (err: any) {
      console.error("Profile update error:", err)
      setError("Failed to update profile: " + (err.message || "Unknown error"))
      setIsLoading(false)
    }
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <Navigation />
        
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center mb-8">
            <Button variant="ghost" size="sm" asChild className="mr-4">
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">Edit Profile</h1>
          </div>
          
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <div className="relative mx-auto w-32 h-32 mb-4">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-muted flex items-center justify-center border-2 border-border">
                  {photo ? (
                    <img src={photo} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="h-16 w-16 text-muted-foreground" />
                  )}
                </div>
                <label htmlFor="photoInput" className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full cursor-pointer hover:bg-primary/90 transition-colors">
                  <Camera className="h-5 w-5" />
                  <input
                    type="file"
                    id="photoInput"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        // In a production app, you'd upload to Firebase Storage
                        // For the MVP, we'll use a data URL or placeholder
                        const reader = new FileReader()
                        reader.onload = (e) => {
                          setPhoto(e.target?.result as string)
                        }
                        reader.readAsDataURL(file)
                      }
                    }}
                  />
                </label>
              </div>
            </CardHeader>
            
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              {success && (
                <Alert className="mb-4 bg-green-50 border-green-200">
                  <AlertDescription className="text-green-700">{success}</AlertDescription>
                </Alert>
              )}
              
              <form onSubmit={handleSave} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Display Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Your name"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="photo">Profile Photo URL (Optional)</Label>
                  <Input
                    id="photo"
                    type="text"
                    value={photo}
                    onChange={e => setPhoto(e.target.value)}
                    placeholder="https://example.com/your-photo.jpg"
                  />
                  <p className="text-xs text-muted-foreground">Enter a URL or use the camera button above</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="examTrack">Exam Track</Label>
                  <select
                    id="examTrack"
                    value={examTrack}
                    onChange={e => setExamTrack(e.target.value)}
                    className="w-full px-3 py-2 rounded-md border border-border bg-transparent"
                    required
                  >
                    <option value="">Select Exam Track</option>
                    <option value="jee">JEE Aspirant (PCM)</option>
                    <option value="neet">NEET Aspirant (PCB)</option>
                    <option value="both">Both (PCMB)</option>
                  </select>
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthGuard>
  )
}
