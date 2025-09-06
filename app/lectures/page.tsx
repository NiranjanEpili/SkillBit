"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { AuthGuard } from "@/components/auth-guard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"
import { Play, CheckCircle, Clock, BookOpen, ArrowRight } from "lucide-react"

interface Lecture {
  id: string
  title: string
  description: string
  duration: string
  videoUrl: string
  thumbnail: string
  completed: boolean
}

const lecturesData: Lecture[] = [
  {
    id: "1",
    title: "Introduction to Adaptive Learning",
    description:
      "Understanding the fundamentals of personalized education and how adaptive systems work to optimize your learning experience.",
    duration: "12:30",
    videoUrl: "/educational-video-adaptive-learning.jpg",
    thumbnail: "/adaptive-learning-concept.jpg",
    completed: false,
  },
  {
    id: "2",
    title: "Competence-Based Learning Theory",
    description:
      "Explore how competence tracking helps identify your strengths and areas for improvement in real-time.",
    duration: "15:45",
    videoUrl: "/competence-based-learning-theory.jpg",
    thumbnail: "/competence-tracking-dashboard.jpg",
    completed: false,
  },
  {
    id: "3",
    title: "Fatigue Management in Learning",
    description:
      "Learn about cognitive load theory and how managing fatigue can dramatically improve retention and performance.",
    duration: "10:20",
    videoUrl: "/fatigue-management-cognitive-load.jpg",
    thumbnail: "/brain-fatigue-management.jpg",
    completed: false,
  },
  {
    id: "4",
    title: "Micro-Learning Best Practices",
    description:
      "Discover the science behind bite-sized learning and how to maximize knowledge retention through spaced repetition.",
    duration: "18:15",
    videoUrl: "/micro-learning-best-practices.jpg",
    thumbnail: "/micro-learning-chunks.jpg",
    completed: false,
  },
]

export default function LecturesPage() {
  const [lectures, setLectures] = useState<Lecture[]>(lecturesData)
  const [selectedVideo, setSelectedVideo] = useState<Lecture | null>(null)
  const [user, setUser] = useState<{ name: string } | null>(null)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }

    // Load lecture progress from localStorage
    const progress = localStorage.getItem("lectureProgress")
    if (progress) {
      const completedIds = JSON.parse(progress)
      setLectures((prev) =>
        prev.map((lecture) => ({
          ...lecture,
          completed: completedIds.includes(lecture.id),
        })),
      )
    }
  }, [])

  const completedCount = lectures.filter((l) => l.completed).length
  const progressPercentage = (completedCount / lectures.length) * 100
  const allCompleted = completedCount === lectures.length

  const markAsCompleted = (lectureId: string) => {
    setLectures((prev) => {
      const updated = prev.map((lecture) => (lecture.id === lectureId ? { ...lecture, completed: true } : lecture))

      // Save progress to localStorage
      const completedIds = updated.filter((l) => l.completed).map((l) => l.id)
      localStorage.setItem("lectureProgress", JSON.stringify(completedIds))

      return updated
    })
    setSelectedVideo(null)
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <Navigation />

        <main className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back, {user?.name}!</h1>
                <p className="text-muted-foreground">
                  Complete these foundational lectures before starting your personalized learning journey.
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">
                  {completedCount}/{lectures.length}
                </div>
                <div className="text-sm text-muted-foreground">Lectures Completed</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Overall Progress</span>
                <span className="font-medium">{Math.round(progressPercentage)}%</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
          </div>

          {/* Video Player Modal */}
          {selectedVideo && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
              <div className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold">{selectedVideo.title}</h3>
                    <Button variant="outline" onClick={() => setSelectedVideo(null)}>
                      Close
                    </Button>
                  </div>

                  <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center">
                    <img
                      src={selectedVideo.videoUrl || "/placeholder.svg"}
                      alt={selectedVideo.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>

                  <p className="text-muted-foreground mb-4">{selectedVideo.description}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{selectedVideo.duration}</span>
                    </div>

                    {!selectedVideo.completed && (
                      <Button onClick={() => markAsCompleted(selectedVideo.id)}>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Mark as Completed
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Lectures Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {lectures.map((lecture) => (
              <Card
                key={lecture.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${lecture.completed ? "ring-2 ring-green-500/20 bg-green-50/50 dark:bg-green-950/20" : ""}`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2 flex items-center gap-2">
                        {lecture.completed ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <BookOpen className="h-5 w-5 text-muted-foreground" />
                        )}
                        {lecture.title}
                      </CardTitle>
                      <CardDescription className="text-sm">{lecture.description}</CardDescription>
                    </div>
                    {lecture.completed && (
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      >
                        Completed
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="aspect-video bg-muted rounded-lg mb-4 overflow-hidden">
                    <img
                      src={lecture.thumbnail || "/placeholder.svg"}
                      alt={lecture.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{lecture.duration}</span>
                    </div>

                    <Button
                      variant={lecture.completed ? "outline" : "default"}
                      size="sm"
                      onClick={() => setSelectedVideo(lecture)}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      {lecture.completed ? "Rewatch" : "Watch"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Continue to Assessment */}
          <div className="text-center">
            {allCompleted ? (
              <div className="space-y-4">
                <div className="p-6 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                  <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-green-800 dark:text-green-200 mb-2">Congratulations!</h3>
                  <p className="text-green-700 dark:text-green-300 mb-4">
                    You've completed all foundational lectures. You're now ready to begin your personalized learning
                    assessment.
                  </p>
                  <Link href="/diagnostic">
                    <Button size="lg" className="bg-green-600 hover:bg-green-700">
                      Start Assessment
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="p-6 bg-muted/50 rounded-lg border border-border">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Complete All Lectures</h3>
                <p className="text-muted-foreground mb-4">
                  Finish watching all {lectures.length} foundational lectures to unlock your personalized assessment.
                </p>
                <p className="text-sm text-muted-foreground">
                  Progress: {completedCount} of {lectures.length} completed
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </AuthGuard>
  )
}
