"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import { Trophy, TrendingUp, Target, RotateCcw, Brain, Zap } from "lucide-react"

interface DiagnosticResults {
  score: number
  answers: any[]
  timestamp: number
}

interface SessionResults {
  competence: number
  fatigue: number
  questionsAnswered: number
  correctAnswers: number
  answers: any[]
  timestamp: number
}

export default function ResultsPage() {
  const [diagnosticResults, setDiagnosticResults] = useState<DiagnosticResults | null>(null)
  const [sessionResults, setSessionResults] = useState<SessionResults | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load results from localStorage
    const diagnostic = localStorage.getItem("diagnosticResults")
    const session = localStorage.getItem("sessionResults")

    if (diagnostic) {
      setDiagnosticResults(JSON.parse(diagnostic))
    }
    if (session) {
      setSessionResults(JSON.parse(session))
    }
    setLoading(false)
  }, [])

  const handleStartAgain = () => {
    // Clear previous results
    localStorage.removeItem("diagnosticResults")
    localStorage.removeItem("sessionResults")
    window.location.href = "/"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your results...</p>
        </div>
      </div>
    )
  }

  if (!diagnosticResults || !sessionResults) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <Card>
              <CardHeader>
                <CardTitle>No Results Found</CardTitle>
                <CardDescription>Complete a learning session to see your results here.</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/">
                  <Button>Start Learning</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    )
  }

  const improvement = sessionResults.competence - diagnosticResults.score
  const accuracyRate =
    sessionResults.questionsAnswered > 0 ? (sessionResults.correctAnswers / sessionResults.questionsAnswered) * 100 : 0

  // Prepare chart data
  const comparisonData = [
    {
      name: "Pre-test",
      score: diagnosticResults.score,
      fill: "hsl(var(--muted))",
    },
    {
      name: "Post-test",
      score: sessionResults.competence,
      fill: "hsl(var(--primary))",
    },
  ]

  // Calculate difficulty distribution
  const difficultyStats = sessionResults.answers.reduce(
    (acc, answer) => {
      acc[answer.difficulty] = (acc[answer.difficulty] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const difficultyData = [
    { name: "Easy", count: difficultyStats.easy || 0, fill: "hsl(var(--chart-1))" },
    { name: "Medium", count: difficultyStats.medium || 0, fill: "hsl(var(--chart-2))" },
    { name: "Hard", count: difficultyStats.hard || 0, fill: "hsl(var(--chart-3))" },
  ]

  // Performance over time (simplified)
  const performanceData = sessionResults.answers.map((answer, index) => ({
    question: index + 1,
    accuracy: answer.isCorrect ? 100 : 0,
    time: Math.round(answer.timeSpent / 1000),
  }))

  const getImprovementMessage = (improvement: number) => {
    if (improvement >= 20) return "Outstanding improvement! You've made excellent progress."
    if (improvement >= 10) return "Great job! You've shown solid improvement."
    if (improvement >= 5) return "Good progress! You're moving in the right direction."
    if (improvement >= 0) return "You maintained your level. Keep practicing!"
    return "Don't worry! Learning takes time. Keep going!"
  }

  const getImprovementColor = (improvement: number) => {
    if (improvement >= 10) return "text-green-600"
    if (improvement >= 0) return "text-primary"
    return "text-orange-600"
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Trophy className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Learning Session Complete!</h1>
            <p className="text-muted-foreground">Here's your detailed performance analysis</p>
          </div>

          {/* Key Metrics */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <Card className="text-center">
              <CardHeader className="pb-3">
                <TrendingUp className="h-8 w-8 mx-auto text-primary mb-2" />
                <CardTitle className="text-sm">Improvement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${getImprovementColor(improvement)}`}>
                  {improvement > 0 ? "+" : ""}
                  {Math.round(improvement)}%
                </div>
                <p className="text-xs text-muted-foreground mt-1">From baseline</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader className="pb-3">
                <Target className="h-8 w-8 mx-auto text-accent mb-2" />
                <CardTitle className="text-sm">Final Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{Math.round(sessionResults.competence)}%</div>
                <p className="text-xs text-muted-foreground mt-1">Competence level</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader className="pb-3">
                <Brain className="h-8 w-8 mx-auto text-secondary mb-2" />
                <CardTitle className="text-sm">Accuracy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-secondary">{Math.round(accuracyRate)}%</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {sessionResults.correctAnswers}/{sessionResults.questionsAnswered} correct
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader className="pb-3">
                <Zap className="h-8 w-8 mx-auto text-orange-500 mb-2" />
                <CardTitle className="text-sm">Peak Fatigue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{Math.round(sessionResults.fatigue)}%</div>
                <p className="text-xs text-muted-foreground mt-1">Maximum reached</p>
              </CardContent>
            </Card>
          </div>

          {/* Improvement Message */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-lg font-medium text-foreground mb-2">{getImprovementMessage(improvement)}</p>
                <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
                  <span>
                    Session Duration: {Math.round((sessionResults.timestamp - diagnosticResults.timestamp) / 60000)}{" "}
                    minutes
                  </span>
                  <span>•</span>
                  <span>Questions Completed: {sessionResults.questionsAnswered}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Charts Section */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {/* Score Comparison */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Score Comparison</CardTitle>
                <CardDescription>Your learning progress from start to finish</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={comparisonData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip formatter={(value) => [`${value}%`, "Score"]} />
                    <Bar dataKey="score" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Difficulty Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Question Difficulty</CardTitle>
                <CardDescription>Distribution of questions you tackled</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={difficultyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}`, "Questions"]} />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Performance Timeline */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg">Performance Timeline</CardTitle>
              <CardDescription>Your accuracy and response time throughout the session</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="question" />
                  <YAxis yAxisId="left" domain={[0, 100]} />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip
                    formatter={(value, name) => [
                      name === "accuracy" ? `${value}%` : `${value}s`,
                      name === "accuracy" ? "Accuracy" : "Response Time",
                    ]}
                  />
                  <Bar yAxisId="left" dataKey="accuracy" fill="hsl(var(--primary))" opacity={0.6} />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="time"
                    stroke="hsl(var(--accent))"
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--accent))" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="text-center space-y-4">
            <Button onClick={handleStartAgain} size="lg" className="mr-4">
              <RotateCcw className="h-4 w-4 mr-2" />
              Start Again
            </Button>
            <Link href="/">
              <Button variant="outline" size="lg">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
