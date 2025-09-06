"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Bell, User, Search, Trophy, Flame, BarChart2, ChevronDown, Settings, LogOut } from "lucide-react"
import { db } from "@/lib/firebase"
import { doc, setDoc } from "firebase/firestore"

// Dummy data for enrolled courses
const enrolledCourses = [
	{
		id: "phy",
		title: "Physics",
		progress: 70,
		stats: { topics: 12, completed: 9, pending: 3, score: 88, streak: 3 },
	},
	{
		id: "chem",
		title: "Chemistry",
		progress: 40,
		stats: { topics: 10, completed: 4, pending: 6, score: 75, streak: 2 },
	},
	{
		id: "math",
		title: "Math",
		progress: 55,
		stats: { topics: 8, completed: 5, pending: 3, score: 80, streak: 1 },
	},
]

const achievements = [
	{ icon: <Trophy className="text-yellow-500" />, label: "5 Micro-lessons" },
	{ icon: <Flame className="text-red-500" />, label: "3-day Streak" },
	{ icon: <BarChart2 className="text-primary" />, label: "50 Questions Solved" },
]

export default function DashboardPage() {
	const [search, setSearch] = useState("")
	const [showProfile, setShowProfile] = useState(false)
	const [user, setUser] = useState<{ name: string } | null>(null)
	const [selectedCourse, setSelectedCourse] = useState<string | null>(null)
	const [examTrack, setExamTrack] = useState<string | null>(null)
	const [showTrackSwitcher, setShowTrackSwitcher] = useState(false)

	useEffect(() => {
		const userData = localStorage.getItem("user")
		if (userData) {
			setUser(JSON.parse(userData))
		}
		const track = localStorage.getItem("examTrack")
		if (track) setExamTrack(track)
	}, [])

	const handleGoToCourse = (courseId: string) => {
		setSelectedCourse(courseId)
		window.location.href = `/lectures/${courseId}`
	}

	const handleTrackChange = async (track: string) => {
		setExamTrack(track)
		localStorage.setItem("examTrack", track)
		setShowTrackSwitcher(false)
		
		// Update Firestore user doc with proper null check
		const userData = localStorage.getItem("user")
		if (userData && db) {
			try {
				const user = JSON.parse(userData)
				if (user.uid) {
					const userRef = doc(db, "users", user.uid)
					await setDoc(userRef, { examTrack: track }, { merge: true })
				}
			} catch (error) {
				console.error("Error updating exam track in Firestore:", error)
				// Continue silently if Firestore update fails
			}
		}
	}

	// Exam track selection modal (only if not set)
	if (!examTrack) {
		return (
			<div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
				<div className="bg-background rounded-xl shadow-xl max-w-md w-full p-8">
					<h2 className="text-2xl font-bold mb-6 text-center">Select Your Exam Track</h2>
					<div className="flex flex-col gap-4">
						<Button className="w-full" onClick={() => handleTrackChange("jee")}>JEE Aspirant (PCM)</Button>
						<Button className="w-full" onClick={() => handleTrackChange("neet")}>NEET Aspirant (PCB)</Button>
						<Button className="w-full" onClick={() => handleTrackChange("both")}>Both (PCMB)</Button>
					</div>
				</div>
			</div>
		)
	}

	// Simple bar chart for progress snapshot
	function ProgressChart({ completed, pending }: { completed: number; pending: number }) {
		const total = completed + pending
		const completedPercent = (completed / total) * 100
		const pendingPercent = (pending / total) * 100
		return (
			<div className="w-full h-6 flex rounded overflow-hidden border border-border">
				<div
					className="bg-primary h-full"
					style={{ width: `${completedPercent}%` }}
					title={`Completed: ${completed}`}
				/>
				<div
					className="bg-muted h-full"
					style={{ width: `${pendingPercent}%` }}
					title={`Pending: ${pending}`}
				/>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-background">
			{/* Top Navigation Bar */}
			<header className="border-b border-border bg-background/95 sticky top-0 z-50">
				<div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
					<Link href="/" className="flex items-center gap-2 font-bold text-xl">
						<span className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white font-bold">
							SB
						</span>
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
							<Button
								variant="ghost"
								size="icon"
								onClick={() => setShowProfile(v => !v)}
								aria-label="Profile"
							>
								<User className="h-5 w-5" />
								<ChevronDown className="h-4 w-4 ml-1" />
							</Button>
							{showProfile && (
								<div className="absolute right-0 mt-2 w-48 bg-background border rounded-lg shadow-lg z-10">
									<Link href="/profile" className="block px-4 py-2 hover:bg-muted flex items-center gap-2">
										<User className="h-4 w-4" />
										<span>Edit Profile</span>
									</Link>
									<Link href="/settings" className="block px-4 py-2 hover:bg-muted flex items-center gap-2">
										<Settings className="h-4 w-4" />
										<span>Settings</span>
									</Link>
									<hr className="my-1 border-border" />
									<button 
										onClick={() => setShowTrackSwitcher(true)} 
										className="w-full text-left px-4 py-2 hover:bg-muted flex items-center gap-2"
									>
										<svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
											<path d="M12 4v16m-8-8h16" strokeLinecap="round" strokeLinejoin="round" />
										</svg>
										<span>Switch Exam Track</span>
									</button>
									<hr className="my-1 border-border" />
									<button 
										onClick={() => {
											localStorage.removeItem("user");
											localStorage.removeItem("examTrack");
											window.location.href = "/signin";
										}} 
										className="w-full text-left px-4 py-2 hover:bg-muted text-red-500 flex items-center gap-2"
									>
										<LogOut className="h-4 w-4" />
										<span>Sign Out</span>
									</button>
								</div>
							)}
						</div>
					</div>
				</div>
			</header>

			<main className="container mx-auto px-4 py-10 space-y-16">
				{/* Exam Track Switcher */}
				<div className="flex items-center justify-end mb-4">
					<span className="text-sm text-muted-foreground mr-2">Exam Track:</span>
					<Button variant="outline" size="sm" onClick={() => setShowTrackSwitcher(true)}>
						{examTrack === "jee" ? "JEE" : examTrack === "neet" ? "NEET" : "Both"}
					</Button>
				</div>
				{showTrackSwitcher && (
					<div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
						<div className="bg-background rounded-xl shadow-xl max-w-md w-full p-8">
							<h2 className="text-2xl font-bold mb-6 text-center">Switch Exam Track</h2>
							<div className="flex flex-col gap-4">
								<Button className="w-full" onClick={() => handleTrackChange("jee")}>JEE Aspirant (PCM)</Button>
								<Button className="w-full" onClick={() => handleTrackChange("neet")}>NEET Aspirant (PCB)</Button>
								<Button className="w-full" onClick={() => handleTrackChange("both")}>Both (PCMB)</Button>
								<Button variant="ghost" className="w-full mt-2" onClick={() => setShowTrackSwitcher(false)}>Cancel</Button>
							</div>
						</div>
					</div>
				)}
				{/* Welcome Message */}
				<section>
					<div className="mb-8">
						<h1 className="text-2xl font-bold text-foreground">
							Hi {user?.name || "Student"}, ready to learn today?
						</h1>
						<div className="text-muted-foreground mt-2">
							Your personalized dashboard for micro-learning, progress, and motivation.
						</div>
					</div>
				</section>

				{/* My Courses Section */}
				<section>
					<h2 className="text-2xl font-bold mb-6">My Courses</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{enrolledCourses.map(course => (
							<Card key={course.id} className="hover:shadow-lg transition-shadow duration-300">
								<CardHeader>
									<CardTitle>{course.title}</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="mb-2">
										<Progress value={course.progress} className="h-2" />
										<div className="text-xs text-muted-foreground mt-1">
											Progress: {course.progress}%
										</div>
									</div>
									<div className="flex gap-4 text-sm mt-2">
										<span>Topics: {course.stats.topics}</span>
										<span>Avg Score: {course.stats.score}%</span>
										<span>Streak: {course.stats.streak} days</span>
									</div>
									<Button className="mt-4 w-full" variant="secondary" onClick={() => handleGoToCourse(course.id)}>
										Go to Course
									</Button>
								</CardContent>
							</Card>
						))}
					</div>
				</section>

				{/* Progress Snapshot */}
				<section>
					<h2 className="text-2xl font-bold mb-6">Progress Snapshot</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						{enrolledCourses.map(course => (
							<Card key={course.id + "-progress"} className="text-center">
								<CardHeader>
									<CardTitle>{course.title}</CardTitle>
									<CardDescription>Topics Completed vs Pending</CardDescription>
								</CardHeader>
								<CardContent>
									<ProgressChart
										completed={course.stats.completed}
										pending={course.stats.pending}
									/>
									<div className="flex justify-between mt-2 text-xs text-muted-foreground">
										<span>Completed: {course.stats.completed}</span>
										<span>Pending: {course.stats.pending}</span>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</section>

				{/* Daily Streak & Motivation */}
				<section>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						{/* Daily Streak / Goals */}
						<Card className="text-center">
							<CardHeader>
								<CardTitle>Daily Streak</CardTitle>
							</CardHeader>
							<CardContent>
								<Flame className="mx-auto h-8 w-8 text-red-500 mb-2 animate-pulse" />
								<div className="text-lg font-bold">
									You studied {enrolledCourses[0].stats.streak} days in a row!
								</div>
								<div className="text-green-600 text-sm mt-2">
									Keep going! Consistency is key to mastery.
								</div>
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
						{/* Motivation */}
						<Card>
							<CardHeader>
								<CardTitle>Motivation</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-center text-primary font-semibold text-lg">
									"Every micro-step brings you closer to mastery!"
								</div>
								<div className="text-muted-foreground text-sm mt-2">
									Celebrate small wins and keep your streak alive.
								</div>
							</CardContent>
						</Card>
					</div>
				</section>
			</main>
		</div>
	)
}
