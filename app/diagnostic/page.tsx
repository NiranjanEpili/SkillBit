"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AuthGuard } from "@/components/auth-guard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Navigation } from "@/components/navigation"
import { Clock, CheckCircle, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Question {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  difficulty: "easy" | "medium" | "hard"
}

interface Answer {
  questionId: number
  selectedAnswer: number
  isCorrect: boolean
  timeSpent: number
}

const diagnosticQuestions: Question[] = [
  {
    id: 1,
    question: "What is the primary purpose of a function in programming?",
    options: [
      "To store data permanently",
      "To reuse code and organize logic",
      "To create visual interfaces",
      "To connect to databases",
    ],
    correctAnswer: 1,
    difficulty: "easy",
  },
  {
    id: 2,
    question: "Which data structure follows the Last-In-First-Out (LIFO) principle?",
    options: ["Queue", "Array", "Stack", "Linked List"],
    correctAnswer: 2,
    difficulty: "medium",
  },
  {
    id: 3,
    question: "What does 'Big O notation' describe in computer science?",
    options: [
      "The size of data structures",
      "The complexity of algorithms",
      "The number of programming languages",
      "The version of software",
    ],
    correctAnswer: 1,
    difficulty: "medium",
  },
  {
    id: 4,
    question: "In object-oriented programming, what is inheritance?",
    options: [
      "Creating multiple copies of an object",
      "A class acquiring properties from another class",
      "Deleting unused variables",
      "Converting data types",
    ],
    correctAnswer: 1,
    difficulty: "hard",
  },
  {
    id: 5,
    question: "What is the time complexity of binary search?",
    options: ["O(n)", "O(n²)", "O(log n)", "O(1)"],
    correctAnswer: 2,
    difficulty: "hard",
  },
]

export default function DiagnosticPage() {
  const router = useRouter()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now())
  const [showResult, setShowResult] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [lecturesCompleted, setLecturesCompleted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const currentQuestion = diagnosticQuestions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / diagnosticQuestions.length) * 100

  useEffect(() => {
    const checkLectureCompletion = () => {
      const lectureProgress = localStorage.getItem("lectureProgress")
      if (lectureProgress) {
        const completedIds = JSON.parse(lectureProgress)
        const allCompleted = completedIds.length === 4
        setLecturesCompleted(allCompleted)
      }
      setIsLoading(false)
    }

    checkLectureCompletion()
  }, [])

  useEffect(() => {
    setQuestionStartTime(Date.now())
    setSelectedOption(null)
  }, [currentQuestionIndex])

  const handleOptionSelect = (optionIndex: number) => {
    setSelectedOption(optionIndex)
  }

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return

    setIsSubmitting(true)
    const timeSpent = Date.now() - questionStartTime
    const isCorrect = selectedOption === currentQuestion.correctAnswer

    const newAnswer: Answer = {
      questionId: currentQuestion.id,
      selectedAnswer: selectedOption,
      isCorrect,
      timeSpent,
    }

    const updatedAnswers = [...answers, newAnswer]
    setAnswers(updatedAnswers)

    setTimeout(() => {
      if (currentQuestionIndex < diagnosticQuestions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
      } else {
        setShowResult(true)
      }
      setIsSubmitting(false)
    }, 1000)
  }

  const calculateScore = () => {
    const correctAnswers = answers.filter((answer) => answer.isCorrect).length
    return Math.round((correctAnswers / diagnosticQuestions.length) * 100)
  }

  const getScoreMessage = (score: number) => {
    if (score >= 80) return "Excellent! You have a strong foundation."
    if (score >= 60) return "Good! You have solid basic knowledge."
    if (score >= 40) return "Fair. There's room for improvement."
    return "Let's build your foundation step by step."
  }

  const handleStartLearning = () => {
    const diagnosticResults = {
      score: calculateScore(),
      answers,
      timestamp: Date.now(),
    }
    localStorage.setItem("diagnosticResults", JSON.stringify(diagnosticResults))
    router.push("/learning")
  }

  if (isLoading) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </AuthGuard>
    )
  }

  if (!lecturesCompleted) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-background">
          <Navigation />
          <main className="container mx-auto px-4 py-16">
            <div className="max-w-2xl mx-auto">
              <Card>
                <CardHeader className="text-center">
                  <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
                  <CardTitle className="text-2xl">Complete Lectures First</CardTitle>
                  <CardDescription>
                    You need to complete all foundational lectures before taking the diagnostic assessment.
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Alert className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      The diagnostic assessment builds on concepts covered in the lecture videos. Please complete all
                      lectures first.
                    </AlertDescription>
                  </Alert>
                  <Button onClick={() => router.push("/lectures")} size="lg">
                    Go to Lectures
                  </Button>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </AuthGuard>
    )
  }

  if (showResult) {
    const score = calculateScore()
    return (
      <AuthGuard>
        <div className="min-h-screen bg-background">
          <Navigation />
          <main className="container mx-auto px-4 py-16">
            <div className="max-w-2xl mx-auto">
              <Card className="text-center">
                <CardHeader>
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-10 w-10 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Diagnostic Complete!</CardTitle>
                  <CardDescription>Here's your baseline assessment</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="text-4xl font-bold text-primary">{score}%</div>
                    <p className="text-muted-foreground">Your starting level</p>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-foreground font-medium">{getScoreMessage(score)}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-card rounded-lg p-3">
                      <div className="text-2xl font-bold text-accent">
                        {answers.filter((a) => a.isCorrect).length}/{diagnosticQuestions.length}
                      </div>
                      <p className="text-muted-foreground">Correct Answers</p>
                    </div>
                    <div className="bg-card rounded-lg p-3">
                      <div className="text-2xl font-bold text-secondary">
                        {Math.round(answers.reduce((sum, a) => sum + a.timeSpent, 0) / answers.length / 1000)}s
                      </div>
                      <p className="text-muted-foreground">Avg. Time</p>
                    </div>
                  </div>

                  <Button onClick={handleStartLearning} size="lg" className="w-full">
                    Start Learning Session
                  </Button>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-foreground">Diagnostic Assessment</h1>
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">
                    Question {currentQuestionIndex + 1} of {diagnosticQuestions.length}
                  </span>
                </div>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-balance">{currentQuestion.question}</CardTitle>
                <CardDescription>Select the best answer from the options below</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleOptionSelect(index)}
                      disabled={isSubmitting}
                      className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                        selectedOption === index
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border hover:border-primary/50 hover:bg-muted/50"
                      } ${isSubmitting ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            selectedOption === index
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-muted-foreground"
                          }`}
                        >
                          {selectedOption === index && <div className="w-2 h-2 rounded-full bg-primary-foreground" />}
                        </div>
                        <span className="text-sm font-medium">{option}</span>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="pt-4">
                  <Button
                    onClick={handleSubmitAnswer}
                    disabled={selectedOption === null || isSubmitting}
                    className="w-full"
                    size="lg"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        <span>Submitting...</span>
                      </div>
                    ) : (
                      "Submit Answer"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </AuthGuard>
  )
}
