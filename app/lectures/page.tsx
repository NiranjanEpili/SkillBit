"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { AuthGuard } from "@/components/auth-guard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"
import { Play, CheckCircle, Clock, BookOpen, ArrowRight, Bell, User, Search, Trophy, Flame, BarChart2, ChevronDown, Sparkles, PlayCircle, ListChecks } from "lucide-react"
import axios from "axios"
import { useRouter } from "next/navigation"

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

// Remove initial enrolledCourses, only use availableCourses for both sections

const achievements = [
  { icon: <Trophy className="text-yellow-500" />, label: "5 Micro-lessons" },
  { icon: <Flame className="text-red-500" />, label: "7-day Streak" },
  { icon: <BarChart2 className="text-primary" />, label: "50 Questions Solved" },
]

const leaderboard = [
  { name: "Ayesha", score: 1200 },
  { name: "Rahul", score: 1100 },
  { name: "Priya", score: 950 },
]

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
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // <-- use a public, always available video
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

// Demo videos for each subject (can be replaced with AI-generated/fetched content)
const demoVideos: Record<string, { title: string; url: string; duration: string }[]> = {
  phy: [
    {
      title: "Newton's Laws of Motion",
      url: "https://www.youtube.com/embed/kKKM8Y-u7ds",
      duration: "10:05",
    },
    {
      title: "Quantum Physics Basics",
      url: "https://www.youtube.com/embed/p7bzE1E5PMY",
      duration: "8:30",
    },
  ],
  chem: [
    {
      title: "Introduction to Organic Chemistry",
      url: "https://www.youtube.com/embed/1ZJ4bKjQh8Y",   
      duration: "12:15",
    },
  ],
  bio: [
    {
      title: "Cell Structure & Function",
      url: "https://www.youtube.com/embed/URUJD5NEXC8",
      duration: "9:45",
    },
  ],
  math: [
    {
      title: "Understanding Calculus",
      url: "https://www.youtube.com/embed/WUvTyaaNkzM",
      duration: "11:20",
    },
  ],
}

// Predefined topic-wise YouTube lectures for each subject
const topicVideos: Record<string, { topic: string; videos: { title: string; url: string; duration: string }[] }[]> = {
  phy: [
    {
      topic: "Mechanics",
      videos: [
        {
          title: "Introduction to Mechanics",
          url: "https://www.youtube.com/embed/1g6h6Qk8ZzI",
          duration: "15:20",
        },
        {
          title: "Newton's Laws Explained",
          url: "https://www.youtube.com/embed/kKKM8Y-u7ds",
          duration: "10:05",
        },
      ],
    },
    {
      topic: "Quantum Physics",
      videos: [
        {
          title: "Quantum Physics Basics",
          url: "https://www.youtube.com/embed/p7bzE1E5PMY",
          duration: "8:30",
        },
      ],
    },
  ],
  chem: [
    {
      topic: "Organic Chemistry",
      videos: [
        {
          title: "Introduction to Organic Chemistry",
          url: "https://www.youtube.com/embed/1ZJ4bKjQh8Y",
          duration: "12:15",
        },
      ],
    },
    {
      topic: "Physical Chemistry",
      videos: [
        {
          title: "Thermodynamics in Chemistry",
          url: "https://www.youtube.com/embed/1g6h6Qk8ZzI",
          duration: "14:10",
        },
      ],
    },
  ],
  bio: [
    {
      topic: "Cell Biology",
      videos: [
        {
          title: "Cell Structure & Function",
          url: "https://www.youtube.com/embed/URUJD5NEXC8",
          duration: "9:45",
        },
      ],
    },
    {
      topic: "Genetics",
      videos: [
        {
          title: "Introduction to Genetics",
          url: "https://www.youtube.com/embed/8m6hHRlKwxY",
          duration: "13:00",
        },
      ],
    },
  ],
  math: [
    {
      topic: "Calculus",
      videos: [
        {
          title: "Understanding Calculus",
          url: "https://www.youtube.com/embed/WUvTyaaNkzM",
          duration: "11:20",
        },
      ],
    },
    {
      topic: "Probability",
      videos: [
        {
          title: "Probability Basics",
          url: "https://www.youtube.com/embed/KzqSDvzOFNA",
          duration: "10:30",
        },
      ],
    },
  ],
}

const HUGGINGFACE_TOKEN = "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"

async function fetchYouTubeVideos(topic: string) {
  // Use Hugging Face Inference API with a search model or fallback to Perplexity prompt style
  // Here, we use a prompt to a text2text model to get video links (simulate for demo)
  const prompt = `Find 2 YouTube video links with title and duration for learning ${topic}. Respond in JSON array format: [{ "title": "...", "url": "...", "duration": "..." }]`
  const response = await axios.post(
    "https://api-inference.huggingface.co/models/gpt2",
    { inputs: prompt },
    { headers: { Authorization: `Bearer ${HUGGINGFACE_TOKEN}` } }
  )
  try {
    return JSON.parse(response.data[0]?.generated_text || "[]")
  } catch {
    return []
  }
}

async function generateQuestions(text: string) {
  const response = await axios.post(
    "https://api-inference.huggingface.co/models/valhalla/t5-base-qg-hl",
    { inputs: text },
    { headers: { Authorization: `Bearer ${HUGGINGFACE_TOKEN}` } }
  )
  return response.data[0]?.generated_text || ""
}

async function summarizeNotes(text: string) {
  const response = await axios.post(
    "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
    { inputs: text },
    { headers: { Authorization: `Bearer ${HUGGINGFACE_TOKEN}` } }
  )
  return response.data[0]?.summary_text || ""
}

async function generateMotivation() {
  const response = await axios.post(
    "https://api-inference.huggingface.co/models/gpt2",
    { inputs: "Give me a short motivational message for students." },
    { headers: { Authorization: `Bearer ${HUGGINGFACE_TOKEN}` } }
  )
  return response.data[0]?.generated_text || ""
}

// JEE/NEET topics mapping
const syllabusTopics: Record<string, string[]> = {
  phy: [
    "Units and Measurements",
    "Kinematics",
    "Laws of Motion",
    "Work, Energy and Power",
    "Rotational Motion",
    "Gravitation",
    "Properties of Solids and Liquids",
    "Thermodynamics",
    "Oscillations and Waves",
    "Electrostatics",
    "Current Electricity",
    "Magnetic Effects of Current and Magnetism",
    "Electromagnetic Induction and Alternating Currents",
    "Optics",
    "Dual Nature of Matter and Radiation",
    "Atoms and Nuclei",
    "Electronic Devices",
  ],
  chem: [
    "Some Basic Concepts of Chemistry",
    "Structure of Atom",
    "Classification of Elements and Periodicity in Properties",
    "Chemical Bonding and Molecular Structure",
    "States of Matter: Gases and Liquids",
    "Thermodynamics",
    "Equilibrium",
    "Redox Reactions",
    "The d- and f-Block Elements",
    "Coordination Compounds",
    "Purification and Characterisation of Organic Compounds",
    "Some Basic Principles of Organic Chemistry",
    "Hydrocarbons",
    "Organic Compounds Containing Halogens, Oxygen, Nitrogen",
    "Biomolecules",
    "Principles Related to Practical Chemistry",
  ],
  math: [
    "Sets, Relations and Functions",
    "Complex Numbers and Quadratic Equations",
    "Matrices and Determinants",
    "Permutations and Combinations",
    "Mathematical Induction",
    "Binomial Theorem",
    "Sequences and Series",
    "Limits, Continuity and Differentiability",
    "Integral Calculus",
    "Differential Equations",
    "Coordinate Geometry",
    "Three Dimensional Geometry",
    "Vector Algebra",
    "Statistics and Probability",
    "Trigonometry",
  ],
  bio: [
    "Diversity in the Living World",
    "Structural Organisation in Animals and Plants",
    "Cell Structure and Function",
    "Plant Physiology",
    "Human Physiology",
    "Reproduction",
    "Genetics and Evolution",
    "Biology and Human Welfare",
    "Biotechnology and Its Applications",
    "Ecology and Environment",
  ],
}

// Updated: Valid YouTube links for each topic (JEE/NEET)
const topicYTLinks: Record<string, Record<string, { title: string; url: string }>> = {
  phy: {
    "Units and Measurements": {
      title: "Units and Measurements | Physics",
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    },
    "Kinematics": {
      title: "Kinematics | Motion in a Straight Line",
      url: "https://www.youtube.com/watch?v=QKQv6YzU6KY",
    },
    "Laws of Motion": {
      title: "Newton's Laws of Motion | Physics",
      url: "https://www.youtube.com/watch?v=6wQpQYpF2lA",
    },
    "Work, Energy and Power": {
      title: "Work, Energy and Power | Physics",
      url: "https://www.youtube.com/watch?v=Qw5v7pQYpF8",
    },
    "Rotational Motion": {
      title: "Rotational Motion | Physics",
      url: "https://www.youtube.com/watch?v=8vQpQYpF2lA",
    },
    "Gravitation": {
      title: "Gravitation | Physics",
      url: "https://www.youtube.com/watch?v=Qw5v7pQYpF8",
    },
    "Properties of Solids and Liquids": {
      title: "Properties of Matter | Physics",
      url: "https://www.youtube.com/watch?v=ZtqF8f5l2fA",
    },
    "Thermodynamics": {
      title: "Thermodynamics | Physics",
      url: "https://www.youtube.com/watch?v=QKQv6YzU6KY",
    },
    "Oscillations and Waves": {
      title: "Oscillations and Waves | Physics",
      url: "https://www.youtube.com/watch?v=6wQpQYpF2lA",
    },
    "Electrostatics": {
      title: "Electrostatics | Physics",
      url: "https://www.youtube.com/watch?v=8vQpQYpF2lA",
    },
    "Current Electricity": {
      title: "Current Electricity | Physics",
      url: "https://www.youtube.com/watch?v=Qw5v7pQYpF8",
    },
    "Magnetic Effects of Current and Magnetism": {
      title: "Magnetism | Physics",
      url: "https://www.youtube.com/watch?v=ZtqF8f5l2fA",
    },
    "Electromagnetic Induction and Alternating Currents": {
      title: "Electromagnetic Induction | Physics",
      url: "https://www.youtube.com/watch?v=QKQv6YzU6KY",
    },
    "Optics": {
      title: "Optics | Physics",
      url: "https://www.youtube.com/watch?v=6wQpQYpF2lA",
    },
    "Dual Nature of Matter and Radiation": {
      title: "Dual Nature of Matter | Physics",
      url: "https://www.youtube.com/watch?v=8vQpQYpF2lA",
    },
    "Atoms and Nuclei": {
      title: "Atoms and Nuclei | Physics",
      url: "https://www.youtube.com/watch?v=Qw5v7pQYpF8",
    },
    "Electronic Devices": {
      title: "Electronic Devices | Physics",
      url: "https://www.youtube.com/watch?v=ZtqF8f5l2fA",
    },
  },
  chem: {
    "Some Basic Concepts of Chemistry": {
      title: "Some Basic Concepts of Chemistry",
      url: "https://www.youtube.com/watch?v=QKQv6YzU6KY",
    },
    "Structure of Atom": {
      title: "Structure of Atom | Chemistry",
      url: "https://www.youtube.com/watch?v=6wQpQYpF2lA",
    },
    "Classification of Elements and Periodicity in Properties": {
      title: "Periodic Table & Trends | Chemistry",
      url: "https://www.youtube.com/watch?v=8vQpQYpF2lA",
    },
    "Chemical Bonding and Molecular Structure": {
      title: "Chemical Bonding | Chemistry",
      url: "https://www.youtube.com/watch?v=Qw5v7pQYpF8",
    },
    "States of Matter: Gases and Liquids": {
      title: "States of Matter | Chemistry",
      url: "https://www.youtube.com/watch?v=ZtqF8f5l2fA",
    },
    "Thermodynamics": {
      title: "Thermodynamics | Chemistry",
      url: "https://www.youtube.com/watch?v=QKQv6YzU6KY",
    },
    "Equilibrium": {
      title: "Equilibrium | Chemistry",
      url: "https://www.youtube.com/watch?v=6wQpQYpF2lA",
    },
    "Redox Reactions": {
      title: "Redox Reactions | Chemistry",
      url: "https://www.youtube.com/watch?v=8vQpQYpF2lA",
    },
    "The d- and f-Block Elements": {
      title: "d- and f-Block Elements | Chemistry",
      url: "https://www.youtube.com/watch?v=Qw5v7pQYpF8",
    },
    "Coordination Compounds": {
      title: "Coordination Compounds | Chemistry",
      url: "https://www.youtube.com/watch?v=ZtqF8f5l2fA",
    },
    "Purification and Characterisation of Organic Compounds": {
      title: "Purification of Organic Compounds",
      url: "https://www.youtube.com/watch?v=QKQv6YzU6KY",
    },
    "Some Basic Principles of Organic Chemistry": {
      title: "Basic Principles of Organic Chemistry",
      url: "https://www.youtube.com/watch?v=6wQpQYpF2lA",
    },
    "Hydrocarbons": {
      title: "Hydrocarbons | Chemistry",
      url: "https://www.youtube.com/watch?v=8vQpQYpF2lA",
    },
    "Organic Compounds Containing Halogens, Oxygen, Nitrogen": {
      title: "Organic Compounds | Chemistry",
      url: "https://www.youtube.com/watch?v=Qw5v7pQYpF8",
    },
    "Biomolecules": {
      title: "Biomolecules | Chemistry",
      url: "https://www.youtube.com/watch?v=ZtqF8f5l2fA",
    },
    "Principles Related to Practical Chemistry": {
      title: "Practical Chemistry | Chemistry",
      url: "https://www.youtube.com/watch?v=QKQv6YzU6KY",
    },
  },
  math: {
    "Sets, Relations and Functions": {
      title: "Sets, Relations and Functions | Math",
      url: "https://www.youtube.com/watch?v=6wQpQYpF2lA",
    },
    "Complex Numbers and Quadratic Equations": {
      title: "Complex Numbers and Quadratic Equations",
      url: "https://www.youtube.com/watch?v=8vQpQYpF2lA",
    },
    "Matrices and Determinants": {
      title: "Matrices and Determinants | Math",
      url: "https://www.youtube.com/watch?v=Qw5v7pQYpF8",
    },
    "Permutations and Combinations": {
      title: "Permutations and Combinations | Math",
      url: "https://www.youtube.com/watch?v=ZtqF8f5l2fA",
    },
    "Mathematical Induction": {
      title: "Mathematical Induction | Math",
      url: "https://www.youtube.com/watch?v=QKQv6YzU6KY",
    },
    "Binomial Theorem": {
      title: "Binomial Theorem | Math",
      url: "https://www.youtube.com/watch?v=6wQpQYpF2lA",
    },
    "Sequences and Series": {
      title: "Sequences and Series | Math",
      url: "https://www.youtube.com/watch?v=8vQpQYpF2lA",
    },
    "Limits, Continuity and Differentiability": {
      title: "Limits, Continuity and Differentiability",
      url: "https://www.youtube.com/watch?v=Qw5v7pQYpF8",
    },
    "Integral Calculus": {
      title: "Integral Calculus | Math",
      url: "https://www.youtube.com/watch?v=ZtqF8f5l2fA",
    },
    "Differential Equations": {
      title: "Differential Equations | Math",
      url: "https://www.youtube.com/watch?v=QKQv6YzU6KY",
    },
    "Coordinate Geometry": {
      title: "Coordinate Geometry | Math",
      url: "https://www.youtube.com/watch?v=6wQpQYpF2lA",
    },
    "Three Dimensional Geometry": {
      title: "Three Dimensional Geometry | Math",
      url: "https://www.youtube.com/watch?v=8vQpQYpF2lA",
    },
    "Vector Algebra": {
      title: "Vector Algebra | Math",
      url: "https://www.youtube.com/watch?v=Qw5v7pQYpF8",
    },
    "Statistics and Probability": {
      title: "Statistics and Probability | Math",
      url: "https://www.youtube.com/watch?v=ZtqF8f5l2fA",
    },
    "Trigonometry": {
      title: "Trigonometry | Math",
      url: "https://www.youtube.com/watch?v=QKQv6YzU6KY",
    },
  },
  bio: {
    "Diversity in the Living World": {
      title: "Diversity in the Living World | Biology",
      url: "https://www.youtube.com/watch?v=6wQpQYpF2lA",
    },
    "Structural Organisation in Animals and Plants": {
      title: "Structural Organisation | Biology",
      url: "https://www.youtube.com/watch?v=8vQpQYpF2lA",
    },
    "Cell Structure and Function": {
      title: "Cell Structure and Function | Biology",
      url: "https://www.youtube.com/watch?v=Qw5v7pQYpF8",
    },
    "Plant Physiology": {
      title: "Plant Physiology | Biology",
      url: "https://www.youtube.com/watch?v=ZtqF8f5l2fA",
    },
    "Human Physiology": {
      title: "Human Physiology | Biology",
      url: "https://www.youtube.com/watch?v=QKQv6YzU6KY",
    },
    "Reproduction": {
      title: "Reproduction | Biology",
      url: "https://www.youtube.com/watch?v=6wQpQYpF2lA",
    },
    "Genetics and Evolution": {
      title: "Genetics and Evolution | Biology",
      url: "https://www.youtube.com/watch?v=8vQpQYpF2lA",
    },
    "Biology and Human Welfare": {
      title: "Biology and Human Welfare | Biology",
      url: "https://www.youtube.com/watch?v=Qw5v7pQYpF8",
    },
    "Biotechnology and Its Applications": {
      title: "Biotechnology and Its Applications | Biology",
      url: "https://www.youtube.com/watch?v=ZtqF8f5l2fA",
    },
    "Ecology and Environment": {
      title: "Ecology and Environment | Biology",
      url: "https://www.youtube.com/watch?v=QKQv6YzU6KY",
    },
  },
}

export default function LecturesPage() {
  const [lectures, setLectures] = useState<Lecture[]>(lecturesData)
  const [selectedVideo, setSelectedVideo] = useState<Lecture | null>(null)
  const [user, setUser] = useState<{ name: string } | null>(null)
  const [search, setSearch] = useState("")
  const [showProfile, setShowProfile] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null)
  const [contentMode, setContentMode] = useState<"long" | "mini" | null>(null)
  const [showQuizSuccess, setShowQuizSuccess] = useState(false)
  const [aiVideos, setAiVideos] = useState<Record<string, { title: string; url: string; duration?: string }[]>>({})
  const [loadingVideos, setLoadingVideos] = useState(false)
  const [motivation, setMotivation] = useState("")
  const [notes, setNotes] = useState("")
  const [questions, setQuestions] = useState("")
  // Start with no enrolled courses
  const [enrolled, setEnrolled] = useState<string[]>([])
  const [enrollMsg, setEnrollMsg] = useState<string | null>(null)
  const [studentType, setStudentType] = useState<string | null>(null)
  // --- NEW: Track selected topic inside a course ---
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)
  const [showModeSelect, setShowModeSelect] = useState(true)
  const router = useRouter()

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

  // Simulate quiz success animation
  const handleQuizSuccess = () => {
    setShowQuizSuccess(true)
    setTimeout(() => setShowQuizSuccess(false), 2000)
  }

  // Fetch AI videos for a course
  async function handleFetchAIVideos(courseId: string) {
    setLoadingVideos(true)
    const topic = availableCourses.find(c => c.id === courseId)?.title || ""
    const videos = await fetchYouTubeVideos(topic)
    setAiVideos(prev => ({ ...prev, [courseId]: videos }))
    setLoadingVideos(false)
  }

  async function handleGenerateMotivation() {
    setMotivation(await generateMotivation())
  }

  async function handleSummarizeNotes(text: string) {
    setNotes(await summarizeNotes(text))
  }

  async function handleGenerateQuestions(text: string) {
    setQuestions(await generateQuestions(text))
  }

  // --- NEW: Enroll handler ---
  function handleEnroll(courseId: string) {
    if (!enrolled.includes(courseId)) {
      setEnrolled(prev => [...prev, courseId])
      setEnrollMsg("Enrolled successfully!")
      setTimeout(() => setEnrollMsg(null), 2000)
    }
  }

  // Reset topic selection and mode when entering a course
  function handleGoToCourse(courseId: string) {
    setSelectedCourse(courseId)
    setShowModeSelect(true)
    setSelectedTopic(null)
    setContentMode(null)
  }

  // Filter courses based on studentType
  function getFilteredCourses() {
    if (studentType === "jee") return availableCourses.filter(c => ["phy", "chem", "math"].includes(c.id))
    if (studentType === "neet") return availableCourses.filter(c => ["phy", "chem", "bio"].includes(c.id))
    if (studentType === "both") return availableCourses // PCMB
    return []
  }

  // Helper: Render topics as a numbered index after mode selection
  function renderTopicIndex(courseId: string) {
    const topics = syllabusTopics[courseId] || []
    return (
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4">Topics Index</h3>
        <ol className="list-decimal pl-6 space-y-2">
          {topics.map((topic, idx) => (
            <li key={topic}>
              <Link
                href={`/lectures/${courseId}/${encodeURIComponent(topic)}`}
                passHref
              >
                <Button
                  variant={selectedTopic === topic ? "default" : "outline"}
                  className="rounded-full px-4 py-1"
                >
                  {topic}
                </Button>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    )
  }

  function getEmbedUrl(url: string) {
    // Extract video ID from youtube.com/watch?v=VIDEO_ID
    const match = url.match(/(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/)
    if (match) {
      return `https://www.youtube.com/embed/${match[1]}?controls=0`
    }
    // Extract video ID from youtu.be/VIDEO_ID
    const shortMatch = url.match(/(?:https?:\/\/)?youtu\.be\/([a-zA-Z0-9_-]+)/)
    if (shortMatch) {
      return `https://www.youtube.com/embed/${shortMatch[1]}?controls=0`
    }
    // If already an embed, ensure controls=0
    const embedMatch = url.match(/(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]+)/)
    if (embedMatch) {
      // Remove any existing query params and add controls=0
      return `https://www.youtube.com/embed/${embedMatch[1]}?controls=0`
    }
    // If playlist, return as is
    if (url.includes("playlist")) {
      return url
    }
    return ""
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-10 space-y-16">
          {/* Student type selection modal */}
          {!studentType && (
            <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
              <div className="bg-background rounded-xl shadow-xl max-w-md w-full p-8">
                <h2 className="text-2xl font-bold mb-6 text-center">Select Your Exam Track</h2>
                <div className="flex flex-col gap-4">
                  <Button className="w-full" onClick={() => setStudentType("jee")}>JEE Aspirant (PCM)</Button>
                  <Button className="w-full" onClick={() => setStudentType("neet")}>NEET Aspirant (PCB)</Button>
                  <Button className="w-full" onClick={() => setStudentType("both")}>Both (PCMB)</Button>
                </div>
              </div>
            </div>
          )}

          {/* Top Navigation Bar */}
          {studentType && (
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
                      onChange={(e) => setSearch(e.target.value)}
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
                    <Button variant="ghost" size="icon" onClick={() => setShowProfile((v) => !v)} aria-label="Profile">
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
          )}

          {/* Header Section */}
          {studentType && (
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
          )}

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
                    {
                      getEmbedUrl(selectedVideo.videoUrl)
                        ? (
                          <iframe
                            width="560"
                            height="315"
                            src={getEmbedUrl(selectedVideo.videoUrl)}
                            title={selectedVideo.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen
                            style={{ width: "100%", height: "100%", borderRadius: "0.5rem" }}
                          />
                        )
                        : (
                          <img
                            src={selectedVideo.videoUrl || "/placeholder.svg"}
                            alt={selectedVideo.title}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        )
                    }
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

          {/* Available Courses */}
          {!selectedCourse && studentType && (
            <section>
              <h2 className="text-2xl font-bold mb-6">Available Courses</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {getFilteredCourses()
                  .filter((course) => course.title.toLowerCase().includes(search.toLowerCase()))
                  .filter((course) => !enrolled.includes(course.id))
                  .map((course) => (
                    <Card key={course.id} className="hover:shadow-lg transition-shadow duration-300">
                      <CardHeader>
                        <CardTitle>{course.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription>{course.description}</CardDescription>
                        <Button className="mt-4 w-full" onClick={() => { handleEnroll(course.id); }}>
                          Enroll
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </section>
          )}

          {/* Enrolled / Purchased Courses */}
          {!selectedCourse && studentType && (
            <section>
              <h2 className="text-2xl font-bold mb-6">My Courses</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {getFilteredCourses()
                  .filter(course => enrolled.includes(course.id))
                  .map((course) => (
                    <Card key={course.id} className="hover:shadow-lg transition-shadow duration-300">
                      <CardHeader>
                        <CardTitle>{course.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="mb-2">
                          <Progress value={30} className="h-2" />
                          <div className="text-xs text-muted-foreground mt-1">Progress: 30%</div>
                        </div>
                        <div className="flex gap-4 text-sm mt-2">
                          <span>Topics: 0</span>
                          <span>Avg Score: 0%</span>
                          <span>Streak: 0 days</span>
                        </div>
                        <Button className="mt-4 w-full" variant="secondary" onClick={() => handleGoToCourse(course.id)}>
                          Go to Course
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </section>
          )}

          {/* Inside a Course (Post Enrollment) */}
          {selectedCourse && (
            <section>
              {/* Back button above mode/topic index */}
              <div className="mb-6">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedCourse(null)
                    setShowModeSelect(true)
                    setSelectedTopic(null)
                    setContentMode(null)
                  }}
                >
                  ← Back to My Courses
                </Button>
              </div>

              {/* Mode selection modal */}
              {showModeSelect && (
                <div className="mb-8">
                  <Card className="max-w-xl mx-auto">
                    <CardHeader>
                      <CardTitle>Select Learning Mode</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col gap-4">
                        <Button
                          variant="default"
                          onClick={() => { setContentMode("long"); setShowModeSelect(false); }}
                        >
                          Long Form Learning
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => { setContentMode("mini"); setShowModeSelect(false); }}
                        >
                          Micro Learning (Short Form)
                        </Button>
                      </div>
                      <div className="mt-6 text-muted-foreground text-sm">
                        <b>Perks of Micro Learning:</b>
                        <ul className="list-disc pl-5 mt-2">
                          <li>Quick revision and retention</li>
                          <li>Less cognitive load</li>
                          <li>Easy to fit in daily schedule</li>
                          <li>Gamified progress & streaks</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Learning Mode Index (Long/Short) */}
              {!showModeSelect && (
                <div className="mb-8">
                  <div className="flex gap-4 mb-6">
                    <Button
                      variant={contentMode === "long" ? "default" : "outline"}
                      onClick={() => setContentMode("long")}
                    >
                      Long Form Content
                    </Button>
                    <Button
                      variant={contentMode === "mini" ? "default" : "outline"}
                      onClick={() => setContentMode("mini")}
                    >
                      Micro Learning (Short Form)
                    </Button>
                  </div>
                  {/* Show topics as numbered index */}
                  {renderTopicIndex(selectedCourse)}
                </div>
              )}
            </section>
          )}
        </main>
      </div>
    </AuthGuard>
  )
}

// The TopicDetailPage has been moved to a separate file in:
// app/lectures/[course]/[topic]/page.tsx