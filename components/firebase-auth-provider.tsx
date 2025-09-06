"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { onAuthStateChanged, User } from "firebase/auth"
import { auth, db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"

interface AuthContextType {
  user: any | null
  loading: boolean
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAuthenticated: false,
})

export function useAuth() {
  return useContext(AuthContext)
}

export function FirebaseAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    console.log("Setting up auth state change listener")
    
    // First check localStorage for existing user
    try {
      const localUser = localStorage.getItem("user")
      if (localUser) {
        const userData = JSON.parse(localUser)
        setUser(userData)
        setIsAuthenticated(true)
      }
    } catch (error) {
      console.error("Error reading from localStorage:", error)
      // Clear invalid user data
      localStorage.removeItem("user")
    }

    // Set up auth state listener
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log("Auth state changed:", firebaseUser ? "user signed in" : "user signed out")
      
      if (firebaseUser) {
        try {
          // Get additional user data from Firestore
          const userRef = doc(db, "users", firebaseUser.uid)
          const userSnap = await getDoc(userRef)
          
          if (userSnap.exists()) {
            const userData = userSnap.data()
            setUser(userData)
            
            // Update localStorage
            localStorage.setItem("user", JSON.stringify(userData))
            
            setIsAuthenticated(true)
          } else {
            // Basic user data if no Firestore document exists
            const basicUserData = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              name: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
            }
            setUser(basicUserData)
            localStorage.setItem("user", JSON.stringify(basicUserData))
            setIsAuthenticated(true)
          }
        } catch (error) {
          console.error("Error getting user data:", error)
          // Basic fallback
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
          })
          setIsAuthenticated(true)
        }
      } else {
        // User is signed out
        setUser(null)
        localStorage.removeItem("user")
        setIsAuthenticated(false)
      }
      
      setLoading(false)
    })

    return () => {
      console.log("Cleaning up auth state change listener")
      unsubscribe()
    }
  }, [])

  const value = {
    user,
    loading,
    isAuthenticated,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
