"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LogOut, User } from "lucide-react"

export function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)

  useEffect(() => {
    // This should run only once on component mount
    const checkUserAuth = () => {
      const userData = localStorage.getItem("user")
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData)
          setUser(parsedUser)
          
          // If user is on auth pages, redirect to lectures
          if (["/signin", "/signup"].includes(pathname || "")) {
            router.push("/lectures")
          }
        } catch (e) {
          // Invalid user data in localStorage, remove it
          localStorage.removeItem("user")
          setUser(null)
          
          // Only redirect to login if on a protected page
          if (!["/", "/signin", "/signup"].includes(pathname || "")) {
            router.push("/signin")
          }
        }
      } else if (!["/", "/signin", "/signup"].includes(pathname || "")) {
        // If no user and on protected page, redirect to signin
        router.push("/signin")
      }
    }
    
    checkUserAuth()
    // We deliberately don't include pathname or router as dependencies
    // because we only want this to run once on mount
  }, [])

  const handleSignOut = () => {
    localStorage.removeItem("user")
    setUser(null)
    router.push("/")
  }

  const navItems = user
    ? [
        { href: "/lectures", label: "Lectures" },
        { href: "/diagnostic", label: "Assessment" },
        { href: "/results", label: "Results" },
      ]
    : [{ href: "/", label: "Home" }]

  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">SB</span>
              </div>
              <span className="font-bold text-lg text-foreground">SkillBit</span>
            </Link>

            <div className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    pathname === item.href ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link href="/profile" className="flex items-center">
                  {user.photo ? (
                    <img src={user.photo} alt={user.name} className="h-8 w-8 rounded-full mr-2" />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-primary/20 text-primary flex items-center justify-center mr-2">
                      {user.name?.charAt(0) || "U"}
                    </div>
                  )}
                  <span className="text-sm hidden md:inline">{user.name}</span>
                </Link>
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/signin">
                  <Button variant="outline" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
