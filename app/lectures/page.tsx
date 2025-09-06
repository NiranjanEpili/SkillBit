"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const lectures = [
	{
		id: 1,
		title: "Introduction to Physics",
		description: "Basic principles and foundations of physics",
		duration: "10 mins",
		progress: 0,
	},
	{
		id: 2,
		title: "Newton's Laws",
		description: "Understanding motion and forces",
		duration: "15 mins",
		progress: 0,
	},
	{
		id: 3,
		title: "Energy and Work",
		description: "Conservation of energy and work principles",
		duration: "12 mins",
		progress: 0,
	},
	{
		id: 4,
		title: "Thermodynamics",
		description: "Heat transfer and laws of thermodynamics",
		duration: "18 mins",
		progress: 0,
	},
];

export default function LecturesPage() {
	const router = useRouter();
	const [user, setUser] = useState<any>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [completedLectures, setCompletedLectures] = useState<number[]>([]);

	useEffect(() => {
		// Check if user is logged in
		const userData = localStorage.getItem("user");
		if (!userData) {
			router.push("/signin");
			return;
		}

		try {
			setUser(JSON.parse(userData));

			// Load any previously completed lectures from localStorage
			const lectureProgress = localStorage.getItem("lectureProgress");
			if (lectureProgress) {
				setCompletedLectures(JSON.parse(lectureProgress));
			}
		} catch (e) {
			console.error("Error parsing user data:", e);
			localStorage.removeItem("user");
			router.push("/signin");
		} finally {
			setIsLoading(false);
		}
	}, [router]);

	const markAsCompleted = (lectureId: number) => {
		if (!completedLectures.includes(lectureId)) {
			const updated = [...completedLectures, lectureId];
			setCompletedLectures(updated);
			localStorage.setItem("lectureProgress", JSON.stringify(updated));
		}
	};

	if (isLoading) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background">
			<Navigation />
			<main className="container mx-auto px-4 py-16">
				<div className="max-w-4xl mx-auto">
					<div className="mb-12">
						<h1 className="text-3xl font-bold mb-2">Micro-Lectures</h1>
						<p className="text-muted-foreground">
							Your personalized bite-sized lectures for effective learning without fatigue.
						</p>
					</div>

					<div className="grid gap-6">
						{lectures.map((lecture) => (
							<Card key={lecture.id} className="overflow-hidden">
								<CardHeader className="pb-2">
									<div className="flex justify-between items-start">
										<div>
											<CardTitle>{lecture.title}</CardTitle>
											<CardDescription>{lecture.description}</CardDescription>
										</div>
										<div className="text-sm font-medium flex items-center">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="16"
												height="16"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
												className="mr-1"
											>
												<circle cx="12" cy="12" r="10" />
												<polyline points="12 6 12 12 16 14" />
											</svg>
											{lecture.duration}
										</div>
									</div>
								</CardHeader>
								<CardContent>
									<div className="mb-4">
										<Progress
											value={completedLectures.includes(lecture.id) ? 100 : 0}
											className="h-2"
										/>
									</div>
									<div className="flex justify-between">
										<Button
											variant="outline"
											onClick={() => router.push(`/lectures/${lecture.id}`)}
										>
											Watch Lecture
										</Button>
										<Button
											onClick={() => markAsCompleted(lecture.id)}
											disabled={completedLectures.includes(lecture.id)}
										>
											{completedLectures.includes(lecture.id)
												? "Completed"
												: "Mark as Completed"}
										</Button>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</main>
		</div>
	);
}