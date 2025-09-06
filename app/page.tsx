import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { Brain, Target, TrendingUp, Zap } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center space-y-8 mb-16">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground text-balance">Learn Smart. Avoid Fatigue.</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              Personalized micro-learning that adapts to your pace and prevents burnout through intelligent fatigue
              management.
            </p>
          </div>

          <Link href="/signin">
            <Button size="lg" className="text-lg px-8 py-6 bg-primary hover:bg-primary/90">
              Get Started
            </Button>
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="text-center">
            <CardHeader>
              <Brain className="h-12 w-12 mx-auto text-primary mb-4" />
              <CardTitle className="text-lg">Adaptive Learning</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Questions adjust to your competence level in real-time</CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Target className="h-12 w-12 mx-auto text-accent mb-4" />
              <CardTitle className="text-lg">Competence Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Visual progress meters show your growing expertise</CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Zap className="h-12 w-12 mx-auto text-secondary mb-4" />
              <CardTitle className="text-lg">Fatigue Management</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Smart break suggestions prevent learning burnout</CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <TrendingUp className="h-12 w-12 mx-auto text-primary mb-4" />
              <CardTitle className="text-lg">Progress Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Detailed insights into your learning journey</CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* How It Works */}
        <div className="text-center space-y-8">
          <h2 className="text-3xl font-bold text-foreground">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg mx-auto">
                1
              </div>
              <h3 className="text-xl font-semibold">Diagnostic Assessment</h3>
              <p className="text-muted-foreground">
                Take a quick 5-question baseline test to determine your starting competence level
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-12 h-12 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold text-lg mx-auto">
                2
              </div>
              <h3 className="text-xl font-semibold">Adaptive Learning</h3>
              <p className="text-muted-foreground">
                Experience personalized questions that adapt based on your performance and fatigue levels
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-12 h-12 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold text-lg mx-auto">
                3
              </div>
              <h3 className="text-xl font-semibold">Track Progress</h3>
              <p className="text-muted-foreground">
                View detailed analytics showing your improvement and learning patterns
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">Built with ❤️ for adaptive learning • Team CodeNova</p>
        </div>
      </footer>
    </div>
  )
}
