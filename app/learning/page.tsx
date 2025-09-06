"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AuthGuard } from "@/components/auth-guard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Navigation } from "@/components/navigation"
import { BreakModal } from "@/components/break-modal"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, Brain, Zap, AlertCircle } from "lucide-react"

interface Question {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  difficulty: "easy" | "medium" | "hard"
  explanation: string
}

interface LearningSession {
  competence: number
  fatigue: number
  questionsAnswered: number
  correctAnswers: number
  currentDifficulty: "easy" | "medium" | "hard"
}

const learningQuestions: Question[] = [
  // Easy Questions
  {
    id: 1,
    question: "What is a variable in programming?",
    options: [
      "A fixed value that never changes",
      "A container that stores data values",
      "A type of loop structure",
      "A programming language",
    ],
    correctAnswer: 1,
    difficulty: "easy",
    explanation: "A variable is a container that stores data values that can be changed during program execution.",
  },
  {
    id: 2,
    question: "Which symbol is commonly used for comments in many programming languages?",
    options: ["#", "//", "/*", "All of the above"],
    correctAnswer: 3,
    difficulty: "easy",
    explanation:
      "Different languages use different comment symbols: # (Python), // (JavaScript, C++), /* */ (CSS, C++).",
  },
  {
    id: 3,
    question: "What does HTML stand for?",
    options: [
      "High Tech Modern Language",
      "HyperText Markup Language",
      "Home Tool Markup Language",
      "Hyperlink and Text Markup Language",
    ],
    correctAnswer: 1,
    difficulty: "easy",
    explanation: "HTML stands for HyperText Markup Language, used to create web page structure.",
  },

  // Medium Questions
  {
    id: 4,
    question: "What is the difference between '==' and '===' in JavaScript?",
    options: [
      "No difference, they're identical",
      "'==' checks type and value, '===' checks only value",
      "'==' checks only value, '===' checks type and value",
      "Both are deprecated operators",
    ],
    correctAnswer: 2,
    difficulty: "medium",
    explanation:
      "'==' performs type coercion and compares values, while '===' compares both type and value without coercion.",
  },
  {
    id: 5,
    question: "What is recursion in programming?",
    options: [
      "A loop that runs infinitely",
      "A function that calls itself",
      "A way to import modules",
      "A type of data structure",
    ],
    correctAnswer: 1,
    difficulty: "medium",
    explanation:
      "Recursion is when a function calls itself to solve a problem by breaking it into smaller subproblems.",
  },
  {
    id: 6,
    question: "What is the purpose of version control systems like Git?",
    options: [
      "To compile code faster",
      "To track changes and collaborate on code",
      "To debug programs automatically",
      "To optimize code performance",
    ],
    correctAnswer: 1,
    difficulty: "medium",
    explanation:
      "Version control systems track changes in code over time and enable multiple developers to collaborate safely.",
  },

  // Hard Questions
  {
    id: 7,
    question: "What is the space complexity of a recursive Fibonacci implementation?",
    options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
    correctAnswer: 1,
    difficulty: "hard",
    explanation: "Recursive Fibonacci has O(n) space complexity due to the call stack depth in the worst case.",
  },
  {
    id: 8,
    question: "In database design, what is denormalization?",
    options: [
      "Removing all relationships between tables",
      "Adding redundancy to improve performance",
      "Encrypting sensitive data",
      "Creating backup copies of data",
    ],
    correctAnswer: 1,
    difficulty: "hard",
    explanation: "Denormalization intentionally adds redundancy to normalized databases to improve query performance.",
  },
  {
    id: 9,
    question: "What is a closure in functional programming?",
    options: [
      "A way to end a program",
      "A function with access to outer scope variables",
      "A type of loop structure",
      "A method to close database connections",
    ],
    correctAnswer: 1,
    difficulty: "hard",
    explanation:
      "A closure is a function that retains access to variables from its outer (enclosing) scope even after the outer function returns.",
  },
]

export default function LearningPage() {
  const router = useRouter()
  const [session, setSession] = useState<LearningSession>({
    competence: 50,
    fatigue: 0,
    questionsAnswered: 0,
    correctAnswers: 0,
    currentDifficulty: "medium",
  })

  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now())
  const [showBreakModal, setShowBreakModal] = useState(false)
  const [sessionAnswers, setSessionAnswers] = useState<any[]>([])
  const [prerequisitesCompleted, setPrerequisitesCompleted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkPrerequisites = () => {
      const lectureProgress = localStorage.getItem("lectureProgress")
      const lecturesCompleted = lectureProgress ? JSON.parse(lectureProgress).length === 4 : false

      const diagnosticResults = localStorage.getItem("diagnosticResults")
      const diagnosticCompleted = !!diagnosticResults

      const allPrerequisitesCompleted = lecturesCompleted && diagnosticCompleted

      setPrerequisitesCompleted(allPrerequisitesCompleted)
      setIsLoading(false)

      if (allPrerequisitesCompleted && diagnosticResults) {
        const results = JSON.parse(diagnosticResults)
        const lectureBonus = 10

        setSession((prev) => ({
          ...prev,
          competence: Math.min(100, results.score + lectureBonus),
          currentDifficulty: results.score >= 70 ? "medium" : results.score >= 40 ? "easy" : "easy",
        }))

        selectNextQuestion(results.score >= 70 ? "medium" : results.score >= 40 ? "easy" : "easy")
      }
    }

    checkPrerequisites()
  }, [])

  useEffect(() => {
    if (session.fatigue >= 70 && !showBreakModal && session.questionsAnswered > 0) {
      setShowBreakModal(true)
    }
  }, [session.fatigue, showBreakModal, session.questionsAnswered])

  const selectNextQuestion = (difficulty?: "easy" | "medium" | "hard") => {
    const targetDifficulty = difficulty || session.currentDifficulty
    const availableQuestions = learningQuestions.filter(
      (q) => q.difficulty === targetDifficulty && !sessionAnswers.find((a) => a.questionId === q.id),
    )

    if (availableQuestions.length === 0) {
      const allAvailable = learningQuestions.filter((q) => !sessionAnswers.find((a) => a.questionId === q.id))
      if (allAvailable.length === 0) {
        handleSessionComplete()
        return
      }
      const randomQuestion = allAvailable[Math.floor(Math.random() * allAvailable.length)]
      setCurrentQuestion(randomQuestion)
    } else {
      const randomQuestion = availableQuestions[Math.floor(Math.random() * availableQuestions.length)]
      setCurrentQuestion(randomQuestion)
    }

    setQuestionStartTime(Date.now())
    setSelectedOption(null)
    setShowFeedback(false)
  }

  const handleOptionSelect = (optionIndex: number) => {
    if (showFeedback) return
    setSelectedOption(optionIndex)
  }

  const handleSubmitAnswer = () => {
    if (selectedOption === null || !currentQuestion) return

    const timeSpent = Date.now() - questionStartTime
    const correct = selectedOption === currentQuestion.correctAnswer
    const wasQuick = timeSpent < 10000

    setIsCorrect(correct)
    setShowFeedback(true)

    setSession((prev) => {
      let newCompetence = prev.competence
      let newFatigue = prev.fatigue
      let newDifficulty = prev.currentDifficulty

      if (correct && wasQuick) {
        newCompetence = Math.min(100, prev.competence + 8)
        newFatigue = Math.max(0, prev.fatigue - 2)
        if (newCompetence > 70 && prev.currentDifficulty === "easy") newDifficulty = "medium"
        if (newCompetence > 85 && prev.currentDifficulty === "medium") newDifficulty = "hard"
      } else if (correct && !wasQuick) {
        newCompetence = Math.min(100, prev.competence + 4)
        newFatigue = Math.min(100, prev.fatigue + 3)
      } else {
        newCompetence = Math.max(0, prev.competence - 3)
        newFatigue = Math.min(100, prev.fatigue + 8)
        if (newCompetence < 60 && prev.currentDifficulty === "hard") newDifficulty = "medium"
        if (newCompetence < 40 && prev.currentDifficulty === "medium") newDifficulty = "easy"
      }

      return {
        ...prev,
        competence: newCompetence,
        fatigue: newFatigue,
        questionsAnswered: prev.questionsAnswered + 1,
        correctAnswers: correct ? prev.correctAnswers + 1 : prev.correctAnswers,
        currentDifficulty: newDifficulty,
      }
    })

    const newAnswer = {
      questionId: currentQuestion.id,
      selectedAnswer: selectedOption,
      isCorrect: correct,
      timeSpent,
      difficulty: currentQuestion.difficulty,
    }
    setSessionAnswers((prev) => [...prev, newAnswer])
  }

  const handleNextQuestion = () => {
    selectNextQuestion(session.currentDifficulty)
  }

  const handleSessionComplete = () => {
    const lectureProgress = localStorage.getItem("lectureProgress")
    const diagnosticResults = localStorage.getItem("diagnosticResults")

    const sessionResults = {
      ...session,
      answers: sessionAnswers,
      timestamp: Date.now(),
      lecturesCompleted: lectureProgress ? JSON.parse(lectureProgress).length : 0,
      diagnosticScore: diagnosticResults ? JSON.parse(diagnosticResults).score : 0,
    }
    localStorage.setItem("sessionResults", JSON.stringify(sessionResults))
    router.push("/results")
  }

  const handleBreakComplete = () => {
    setShowBreakModal(false)
    setSession((prev) => ({
      ...prev,
      fatigue: Math.max(0, prev.fatigue - 30),
    }))
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

  if (!prerequisitesCompleted) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-background">
          <Navigation />
          <main className="container mx-auto px-4 py-16">
            <div className="max-w-2xl mx-auto">
              <Card>
                <CardHeader className="text-center">
                  <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
                  <CardTitle className="text-2xl">Complete Prerequisites First</CardTitle>
                  <CardDescription>
                    You need to complete both lectures and diagnostic assessment before starting adaptive learning.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      The adaptive learning system requires baseline data from your diagnostic assessment and
                      foundational knowledge from the lectures.
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm">Complete Lectures</span>
                      {localStorage.getItem("lectureProgress") &&
                      JSON.parse(localStorage.getItem("lectureProgress") || "[]").length === 4 ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-destructive" />
                      )}
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm">Complete Diagnostic Assessment</span>
                      {localStorage.getItem("diagnosticResults") ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-destructive" />
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={() => router.push("/lectures")} variant="outline" className="flex-1">
                      Go to Lectures
                    </Button>
                    <Button onClick={() => router.push("/diagnostic")} className="flex-1">
                      Take Assessment
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

  if (!currentQuestion) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading your personalized questions...</p>
          </div>
        </div>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <Navigation />

        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="grid grid-cols-2 gap-4 mb-8">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-2">
                    <Brain className="h-5 w-5 text-primary" />
                    <CardTitle className="text-sm">Competence</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Progress value={session.competence} className="h-3" />
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Level</span>
                      <span className="font-medium text-primary">{Math.round(session.competence)}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-2">
                    <Zap className="h-5 w-5 text-destructive" />
                    <CardTitle className="text-sm">Fatigue</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Progress
                      value={session.fatigue}
                      className="h-3"
                      style={
                        {
                          "--progress-background":
                            session.fatigue > 70 ? "hsl(var(--destructive))" : "hsl(var(--accent))",
                        } as any
                      }
                    />
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Energy</span>
                      <span className={`font-medium ${session.fatigue > 70 ? "text-destructive" : "text-accent"}`}>
                        {Math.round(100 - session.fatigue)}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-between items-center mb-6 text-sm text-muted-foreground">
              <span>Questions: {session.questionsAnswered}</span>
              <span>
                Accuracy:{" "}
                {session.questionsAnswered > 0
                  ? Math.round((session.correctAnswers / session.questionsAnswered) * 100)
                  : 0}
                %
              </span>
              <span>
                Difficulty: <span className="capitalize font-medium">{session.currentDifficulty}</span>
              </span>
            </div>

            {!showFeedback ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-balance">{currentQuestion.question}</CardTitle>
                  <CardDescription>Choose the best answer</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {currentQuestion.options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleOptionSelect(index)}
                        className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                          selectedOption === index
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border hover:border-primary/50 hover:bg-muted/50"
                        } cursor-pointer`}
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

                  <Button onClick={handleSubmitAnswer} disabled={selectedOption === null} className="w-full" size="lg">
                    Submit Answer
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    {isCorrect ? (
                      <CheckCircle className="h-8 w-8 text-green-500" />
                    ) : (
                      <XCircle className="h-8 w-8 text-destructive" />
                    )}
                    <div>
                      <CardTitle className={isCorrect ? "text-green-600" : "text-destructive"}>
                        {isCorrect ? "Correct!" : "Incorrect"}
                      </CardTitle>
                      <CardDescription>
                        {isCorrect ? "Well done! You're making progress." : "Don't worry, let's learn from this."}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-sm font-medium mb-2">Explanation:</p>
                    <p className="text-sm text-muted-foreground">{currentQuestion.explanation}</p>
                  </div>

                  {!isCorrect && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-sm text-green-800">
                        <span className="font-medium">Correct answer:</span>{" "}
                        {currentQuestion.options[currentQuestion.correctAnswer]}
                      </p>
                    </div>
                  )}

                  <Button onClick={handleNextQuestion} className="w-full" size="lg">
                    Next Question
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </main>

        <BreakModal isOpen={showBreakModal} onComplete={handleBreakComplete} />
      </div>
    </AuthGuard>
  )
}
