"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Bell, User, Search, Trophy, Flame, BarChart2, ChevronDown } from "lucide-react"

const availableCourses = [
  {
    id: "phy",
    title: "Physics",
    description: "Master concepts from mechanics to quantum physics.",
  },
  {
    id: "chem",
    title: "Chemistry",
    description: "Explore organic, inorganic, and physical chemistry.",
  },
  {
    id: "bio",
    title: "Biology",
    description: "Understand life from cells to ecosystems.",
  },
  {
    id: "math",
    title: "Math",
    description: "Sharpen your skills from algebra to calculus.",
  },
]

const enrolledCourses = [
  {
    id: "phy",
    title: "Physics",
    progress: 70,
    stats: { topics: 12, score: 88, streak: 5 },
  },
  {
    id: "math",
    title: "Math",
    progress: 40,
    stats: { topics: 7, score: 75, streak: 2 },
  },
]

const achievements = [
  { icon: <Trophy className="text-yellow-500" />, label: "5 Micro-lessons" },
  { icon: <Flame className="text-red-500" />, label: "7-day Streak" },
  { icon: <BarChart2 className="text-primary" />, label: "50 Questions Solved" },
]

export default function DashboardPage() {
  const [search, setSearch] = useState("")
  const [showProfile, setShowProfile] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation Bar */}
      <header className="border-b border-border bg-background/95 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <span className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white font-bold">SB</span>
            SkillBit
          </Link>
          <div className="flex-1 flex items-center gap-2 max-w-md">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search subjects/topics..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-border bg-muted/40 focus:outline-none"
              />
              <Search className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" aria-label="Notifications">
              <Bell className="h-5 w-5" />
            </Button>
            <div className="relative">
              <Button variant="ghost" size="icon" onClick={() => setShowProfile(v => !v)} aria-label="Profile">
                <User className="h-5 w-5" />
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
              {showProfile && (
                <div className="absolute right-0 mt-2 w-40 bg-background border rounded-lg shadow-lg z-10">
                  <Link href="/settings" className="block px-4 py-2 hover:bg-muted">Settings</Link>
                  <Link href="/logout" className="block px-4 py-2 hover:bg-muted">Logout</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 space-y-16">
        {/* Available Courses */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Available Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {availableCourses.map(course => (
              <Card key={course.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle>{course.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{course.description}</CardDescription>
                  <Button className="mt-4 w-full">Enroll</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Enrolled / Purchased Courses */}
        <section>
          <h2 className="text-2xl font-bold mb-6">My Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {enrolledCourses.map(course => (
              <Card key={course.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle>{course.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-2">
                    <Progress value={course.progress} className="h-2" />
                    <div className="text-xs text-muted-foreground mt-1">Progress: {course.progress}%</div>
                  </div>
                  <div className="flex gap-4 text-sm mt-2">
                    <span>Topics: {course.stats.topics}</span>
                    <span>Avg Score: {course.stats.score}%</span>
                    <span>Streak: {course.stats.streak} days</span>
                  </div>
                  <Button className="mt-4 w-full" variant="secondary">Go to Course</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Dashboard Widgets */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Daily Streak / Goals */}
            <Card className="text-center">
              <CardHeader>
                <CardTitle>Daily Streak</CardTitle>
              </CardHeader>
              <CardContent>
                <Flame className="mx-auto h-8 w-8 text-red-500 mb-2 animate-pulse" />
                <div className="text-lg font-bold">5 days</div>
                <div className="text-muted-foreground text-sm">Keep going!</div>
              </CardContent>
            </Card>
            {/* AI Insights Panel */}
            <Card>
              <CardHeader>
                <CardTitle>AI Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-2 text-sm">Your weak areas:</div>
                <ul className="list-disc pl-5 text-muted-foreground text-sm mb-2">
                  <li>Physics: Thermodynamics</li>
                  <li>Math: Calculus</li>
                </ul>
                <div className="mb-2 text-sm">Recommended next focus:</div>
                <ul className="list-disc pl-5 text-muted-foreground text-sm">
                  <li>Physics: Waves</li>
                  <li>Math: Probability</li>
                </ul>
              </CardContent>
            </Card>
            {/* Achievements/Badges */}
            <Card>
              <CardHeader>
                <CardTitle>Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 justify-center items-center">
                  {achievements.map((ach, i) => (
                    <div key={i} className="flex flex-col items-center">
                      {ach.icon}
                      <span className="text-xs mt-1">{ach.label}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  )
}
