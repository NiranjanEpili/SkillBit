import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-16">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">About SkillBit</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-lg text-muted-foreground">
              <strong>SkillBit</strong> is a modern micro-learning platform designed to help you learn faster and smarter.
              Our adaptive engine analyzes your skill level, delivers personalized micro-lessons and quizzes, and tracks your progress in real time.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Sign in with Google for instant access</li>
              <li>System analyzes your skill level with a quick diagnostic</li>
              <li>Get bite-sized lessons and quizzes tailored to you</li>
              <li>Track your progress and improvement instantly</li>
              <li>Enjoy gamification, AI recommendations, and cross-device sync</li>
            </ul>
            <p className="text-lg text-muted-foreground">
              Whether you're preparing for exams, upskilling for your career, or just want to learn something new, SkillBit makes learning efficient and enjoyable.
            </p>
            <div className="flex flex-col md:flex-row gap-4 pt-8 justify-center">
              <Link href="/signup">
                <Button size="lg" className="w-full md:w-auto bg-primary hover:bg-primary/90">
                  Sign Up
                </Button>
              </Link>
              <Link href="/signin">
                <Button size="lg" variant="outline" className="w-full md:w-auto">
                  Sign In
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
