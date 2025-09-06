"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Navigation } from "@/components/navigation"
import Link from "next/link"
import { CheckCircle, Clock, Book, Play, AlertCircle } from "lucide-react"
import { AuthGuard } from "@/components/auth-guard"

// Course topics mapping
const courseTopics: Record<string, { title: string; description: string; topics: string[] }> = {
  phy: {
    title: "Physics",
    description: "Master concepts from mechanics to quantum physics",
    topics: [
      "Units and Measurements",
      "Kinematics",
      "Laws of Motion",
      "Work, Energy and Power",
      "Rotational Motion",
      "Gravitation",
      "Properties of Solids and Liquids",
      "Thermodynamics",
    ],
  },
  chem: {
    title: "Chemistry",
    description: "Explore organic, inorganic, and physical chemistry",
    topics: [
      "Some Basic Concepts of Chemistry",
      "Structure of Atom",
      "Classification of Elements and Periodicity",
      "Chemical Bonding and Molecular Structure",
      "States of Matter",
      "Thermodynamics",
    ],
  },
  math: {
    title: "Mathematics",
    description: "Sharpen your skills from algebra to calculus",
    topics: [
      "Sets, Relations and Functions",
      "Complex Numbers",
      "Matrices and Determinants",
      "Permutations and Combinations",
      "Mathematical Induction",
      "Binomial Theorem",
    ],
  },
}

export default function CourseOverviewPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.course as string
  const course = courseTopics[courseId]

  if (!course) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-background">
          <Navigation />
          <div className="container mx-auto px-4 py-10">
            <div className="text-center py-16">
              <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h2 className="text-2xl font-bold mb-2">Course Not Found</h2>
              <p className="text-muted-foreground mb-6">The course you're looking for doesn't exist.</p>
              <Button onClick={() => router.push("/lectures")}>Back to Courses</Button>
            </div>
          </div>
        </div>
      </AuthGuard>
    )
  }

  // Load topic statuses from localStorage
  const [topicStatus, setTopicStatus] = useState<Record<string, "Not started" | "In Progress" | "Completed">>({})
  const [activeTab, setActiveTab] = useState<"all" | "micro" | "full">("all")

  useEffect(() => {
    const saved = localStorage.getItem(`topicStatus_${courseId}`)
    if (saved) setTopicStatus(JSON.parse(saved))
  }, [courseId])

  // Calculate analytics
  const completedCount = Object.values(topicStatus).filter((status) => status === "Completed").length
  const inProgressCount = Object.values(topicStatus).filter((status) => status === "In Progress").length
  const notStartedCount = course.topics.length - completedCount - inProgressCount
  const progressPercentage = Math.round((completedCount / course.topics.length) * 100)

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-10 flex flex-col md:flex-row gap-8">
          {/* Left: Topic Index */}
          <div className="md:w-1/3 lg:w-1/4">
            <Card>
              <CardHeader>
                <CardTitle>Topics Index</CardTitle>
                <CardDescription>{course.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {course.topics.map((topic, idx) => {
                    const status = topicStatus[topic] || "Not started"
                    const statusColor =
                      status === "Completed"
                        ? "text-green-600"
                        : status === "In Progress"
                        ? "text-yellow-600"
                        : "text-muted-foreground"

                    return (
                      <li key={topic}>
                        <Link href={`/lectures/${courseId}/${encodeURIComponent(topic)}`}>
                          <Button variant="outline" className="w-full justify-between text-left">
                            <span>
                              {idx + 1}. {topic}
                            </span>
                            <span className={statusColor}>{status}</span>
                          </Button>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Right: Course Overview & Analytics */}
          <div className="flex-1">
            <div className="mb-8">
              <h1 className="text-3xl font-bold">{course.title}</h1>
              <p className="text-muted-foreground mt-2">{course.description}</p>
            </div>

            <Tabs defaultValue="all" value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
              <TabsList className="mb-6">
                <TabsTrigger value="all">All Topics</TabsTrigger>
                <TabsTrigger value="micro">Micro Learning</TabsTrigger>
                <TabsTrigger value="full">Full Lectures</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Course Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Overall Progress</span>
                        <span>{progressPercentage}%</span>
                      </div>
                      <Progress value={progressPercentage} className="h-2" />
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="bg-muted/50 rounded-lg p-3">
                        <div className="text-xl font-bold text-green-600">{completedCount}</div>
                        <div className="text-xs text-muted-foreground">Completed</div>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-3">
                        <div className="text-xl font-bold text-yellow-600">{inProgressCount}</div>
                        <div className="text-xs text-muted-foreground">In Progress</div>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-3">
                        <div className="text-xl font-bold text-muted-foreground">{notStartedCount}</div>
                        <div className="text-xs text-muted-foreground">Not Started</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {course.topics.map((topic, idx) => {
                    const status = topicStatus[topic] || "Not started"
                    return (
                      <Card key={topic} className="transition-shadow hover:shadow-md">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">{topic}</CardTitle>
                          <CardDescription
                            className={
                              status === "Completed"
                                ? "text-green-600"
                                : status === "In Progress"
                                ? "text-yellow-600"
                                : "text-muted-foreground"
                            }
                          >
                            {status}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex gap-2 mb-4">
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => router.push(`/lectures/${courseId}/${encodeURIComponent(topic)}?mode=mini`)}
                              className="flex-1"
                            >
                              <Play className="h-4 w-4 mr-2" />
                              Mini Lecture
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => router.push(`/lectures/${courseId}/${encodeURIComponent(topic)}?mode=full`)}
                              className="flex-1"
                            >
                              <Book className="h-4 w-4 mr-2" />
                              Full Lecture
                            </Button>
                          </div>

                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              10-15 mins
                            </span>
                            <span>Sub-topics: 5-8</span>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </TabsContent>

              <TabsContent value="micro" className="space-y-6">
                <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg mb-6">
                  <h3 className="text-lg font-bold text-primary mb-2">Micro Learning Mode</h3>
                  <p className="text-sm">
                    Focused, bite-sized lessons (10-15 mins each) optimized for retention and minimal fatigue.
                    Perfect for quick study sessions.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {course.topics.map((topic) => (
                    <Card key={`micro-${topic}`} className="transition-shadow hover:shadow-md">
                      <CardHeader>
                        <CardTitle className="text-lg">{topic}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Button
                          onClick={() => router.push(`/lectures/${courseId}/${encodeURIComponent(topic)}?mode=mini`)}
                          className="w-full"
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Start Micro Lecture
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="full" className="space-y-6">
                <div className="bg-accent/5 border border-accent/20 p-4 rounded-lg mb-6">
                  <h3 className="text-lg font-bold text-accent mb-2">Full Lecture Mode</h3>
                  <p className="text-sm">
                    Complete, in-depth lectures (25-30 mins each) covering all aspects of each topic.
                    Ideal for thorough understanding.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {course.topics.map((topic) => (
                    <Card key={`full-${topic}`} className="transition-shadow hover:shadow-md">
                      <CardHeader>
                        <CardTitle className="text-lg">{topic}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Button
                          variant="outline"
                          onClick={() => router.push(`/lectures/${courseId}/${encodeURIComponent(topic)}?mode=full`)}
                          className="w-full"
                        >
                          <Book className="h-4 w-4 mr-2" />
                          Start Full Lecture
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
