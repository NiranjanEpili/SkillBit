"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { Brain, Zap, Award, LineChart, User } from "lucide-react"
import { CssSlide } from "@/components/animations/css-slide"
import { CssStaggered } from "@/components/animations/css-staggered"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useState } from "react"

export default function HomePage() {
  const router = useRouter()
  const [showDashboard, setShowDashboard] = useState(false)

  // Demo dashboard preview (fade-in animation)
  const DashboardPreview = (
    <CssSlide direction="up" duration={1} delay={0.3}>
      <div className="rounded-xl shadow-lg bg-white/90 border border-border p-6 w-full max-w-lg mx-auto mt-8 animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="font-bold text-lg text-primary">Physics</span>
            <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Micro-Lesson</span>
          </div>
          <span className="text-xs text-muted-foreground">Progress: 70%</span>
        </div>
        <div className="mb-4">
          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
            <div className="h-2 bg-primary rounded-full" style={{ width: "70%" }}></div>
          </div>
        </div>
        <div className="mb-2 text-sm text-muted-foreground">Next: Newton’s Second Law</div>
        <div className="flex gap-2 mt-4">
          <Button size="sm" className="bg-primary text-white">Watch Mini Lecture</Button>
          <Button size="sm" variant="outline">Take AI Quiz</Button>
        </div>
        <div className="mt-4 text-xs text-green-600 font-semibold">Motivation: "Every micro-step brings you closer to mastery!"</div>
      </div>
    </CssSlide>
  )

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background to-primary/5">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left side content */}
            <CssSlide direction="up" distance="medium" duration={0.7}>
              <div className="space-y-6">
                <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
                  Learn smarter, not harder.
                </h1>
                <p className="text-xl text-muted-foreground max-w-lg">
                  Personalized micro-learning engine powered by AI. Boost your progress, minimize fatigue, and stay motivated.
                </p>
                <div className="flex flex-wrap gap-4 pt-4">
                  <Button
                    size="lg"
                    className="px-8 py-6 text-lg bg-primary hover:bg-primary/90"
                    onClick={() => router.push("/signin")}
                  >
                    Get Started Free
                  </Button>
                  <Button size="lg" variant="outline" className="px-8 py-6 text-lg" onClick={() => setShowDashboard(true)}>
                    Demo Dashboard
                  </Button>
                </div>
              </div>
            </CssSlide>
            
            {/* Right side illustration + dashboard preview */}
            <CssSlide direction="left" distance="medium" duration={0.8} delay={0.2}>
              <div className="relative h-[400px] md:h-[500px] flex items-center justify-center">
                <div className="relative w-4/5 h-4/5 flex items-center justify-center">
                  <img
                    src="https://i.postimg.cc/mrR1sCcL/22fe28d3-6a68-4b12-8d92-5c9dd434767d-removebg-preview.png"
                    alt="Student learning illustration"
                    style={{ objectFit: "contain", width: "100%", height: "100%" }}
                    loading="eager"
                  />
                  {showDashboard && DashboardPreview}
                </div>
              </div>
            </CssSlide>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <CssSlide direction="up">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold">Why SkillBit?</h2>
              <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
                The future of learning is personalized, adaptive, and motivating.
              </p>
            </div>
          </CssSlide>
          <CssStaggered staggerAmount={0.12}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              <Card className="h-full transition-all duration-300 hover:shadow-lg border-border/40 hover:border-primary/20">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <Brain className="h-10 w-10 text-primary" />
                  </div>
                  <CardTitle className="text-center text-xl">Personalized Micro-learning</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-muted-foreground">
                    Bite-sized lessons tailored to your strengths and weaknesses, delivered just-in-time.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="h-full transition-all duration-300 hover:shadow-lg border-border/40 hover:border-primary/20">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <Zap className="h-10 w-10 text-secondary" />
                  </div>
                  <CardTitle className="text-center text-xl">AI-Generated Smart Quizzes</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-muted-foreground">
                    Instantly test your understanding with quizzes generated by AI, adapting to your progress.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="h-full transition-all duration-300 hover:shadow-lg border-border/40 hover:border-primary/20">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <Award className="h-10 w-10 text-accent" />
                  </div>
                  <CardTitle className="text-center text-xl">Motivation Boosts</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-muted-foreground">
                    Stay motivated with AI-powered nudges and progress tracking to keep you on track.
                  </CardDescription>
                </CardContent>
              </Card>
              {/* Add more feature cards below */}
              <Card className="h-full transition-all duration-300 hover:shadow-lg border-border/40 hover:border-primary/20">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <LineChart className="h-10 w-10 text-primary" />
                  </div>
                  <CardTitle className="text-center text-xl">Progress Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-muted-foreground">
                    Visualize your mastery, accuracy, and fatigue levels for every topic and sub-topic.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="h-full transition-all duration-300 hover:shadow-lg border-border/40 hover:border-primary/20">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <Award className="h-10 w-10 text-accent" />
                  </div>
                  <CardTitle className="text-center text-xl">Gamified Streaks</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-muted-foreground">
                    Earn badges, maintain streaks, and compete on leaderboards for motivation.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="h-full transition-all duration-300 hover:shadow-lg border-border/40 hover:border-primary/20">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <Brain className="h-10 w-10 text-secondary" />
                  </div>
                  <CardTitle className="text-center text-xl">Flashcards & Interactive Learning</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-muted-foreground">
                    Use flashcards and interactive modules to master weak areas until you achieve mastery.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="h-full transition-all duration-300 hover:shadow-lg border-border/40 hover:border-primary/20">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <Zap className="h-10 w-10 text-primary" />
                  </div>
                  <CardTitle className="text-center text-xl">Fatigue Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-muted-foreground">
                    Detect fatigue and recommend breaks or lighter content to keep you fresh.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="h-full transition-all duration-300 hover:shadow-lg border-border/40 hover:border-primary/20">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <User className="h-10 w-10 text-accent" />
                  </div>
                  <CardTitle className="text-center text-xl">Profile Editing</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-muted-foreground">
                    Edit your name, photo, and exam track anytime for a personalized experience.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="h-full transition-all duration-300 hover:shadow-lg border-border/40 hover:border-primary/20">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <LineChart className="h-10 w-10 text-secondary" />
                  </div>
                  <CardTitle className="text-center text-xl">Adaptive Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-muted-foreground">
                    AI suggests next activities, revision, or assessments based on your engagement and accuracy.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </CssStaggered>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 py-12 mt-8">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white font-bold">SB</span>
            <span className="font-bold text-lg">SkillBit</span>
          </div>
          <nav className="flex gap-6 flex-wrap">
            <FooterLink href="/about">About</FooterLink>
            <FooterLink href="/contact">Contact</FooterLink>
            <FooterLink href="https://github.com/your-repo" target="_blank">GitHub Repo</FooterLink>
            <FooterLink href="/terms">Terms</FooterLink>
            <FooterLink href="/privacy">Privacy</FooterLink>
          </nav>
          <span className="text-sm text-muted-foreground">© {new Date().getFullYear()} SkillBit. All rights reserved.</span>
        </div>
        <style jsx>{`
          .footer-link {
            position: relative;
            color: inherit;
            text-decoration: none;
            transition: color 0.2s;
          }
          .footer-link:hover {
            color: #2563eb;
          }
          .footer-link::after {
            content: "";
            position: absolute;
            left: 0;
            bottom: -2px;
            width: 100%;
            height: 2px;
            background: #2563eb;
            transform: scaleX(0);
            transition: transform 0.3s;
          }
          .footer-link:hover::after {
            transform: scaleX(1);
          }
        `}</style>
      </footer>
    </div>
  )
}

// Animated footer link component
function FooterLink({ href, children, ...props }: { href: string; children: React.ReactNode; [key: string]: any }) {
  return (
    <Link href={href} {...props} className="footer-link text-muted-foreground hover:text-primary transition-colors px-2 py-1">
      {children}
    </Link>
  )
}
