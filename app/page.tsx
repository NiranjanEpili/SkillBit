import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { Brain, Target, TrendingUp, Zap, BookOpen, LineChart, Award, Smartphone } from "lucide-react"
import { CssSlide } from "@/components/animations/css-slide"
import { CssStaggered } from "@/components/animations/css-staggered"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section (First Fold) */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background to-primary/5">
        {/* Abstract background animation */}
        <div className="absolute inset-0 -z-10 opacity-30">
          <div className="wave-animation w-full h-full"></div>
        </div>
        
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left side content */}
            <CssSlide direction="up" distance="medium" duration={0.7}>
              <div className="space-y-6">
                <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
                  SkillBit – Learn Faster, Smarter
                </h1>
                <p className="text-xl text-muted-foreground max-w-lg">
                  Personalized micro-learning that adapts to your pace and prevents burnout through intelligent pacing.
                </p>
                <div className="flex flex-wrap gap-4 pt-4">
                  <Button size="lg" className="px-8 py-6 text-lg bg-primary hover:bg-primary/90">
                    Get Started Free
                  </Button>
                  <Button size="lg" variant="outline" className="px-8 py-6 text-lg">
                    Sign In
                  </Button>
                </div>
              </div>
            </CssSlide>
            
            {/* Right side illustration */}
            <CssSlide direction="left" distance="medium" duration={0.8} delay={0.2}>
              <div className="relative h-[400px] md:h-[500px]">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-2xl overflow-hidden flex items-center justify-center">
                  <div className="relative w-4/5 h-4/5">
                    <Image
                      src="/images/hero-illustration.png"
                      alt="Learning illustration"
                      fill
                      style={{ objectFit: "contain" }}
                      priority
                    />
                  </div>
                </div>
              </div>
            </CssSlide>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-muted/30 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="grid grid-cols-10 h-full w-full">
            {Array(100).fill(0).map((_, i) => (
              <div key={i} className="border-r border-b border-primary/10"></div>
            ))}
          </div>
        </div>
        
        <div className="container mx-auto px-4 relative">
          <CssSlide direction="up">
            <div className="text-center mb-16">
              <div className="mx-auto w-20 h-1 bg-primary mb-4"></div>
              <h2 className="text-3xl md:text-4xl font-bold">How It Works</h2>
              <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
                Four simple steps to transform your learning experience
              </p>
            </div>
          </CssSlide>
          
          {/* Enhanced visual pathway between steps */}
          <div className="hidden lg:flex absolute top-1/2 left-0 right-0 w-full h-0.5 -translate-y-32 z-0 justify-center items-center px-16">
            <div className="w-full h-0.5 bg-gradient-to-r from-primary/10 via-secondary/30 to-accent/10"></div>
            <div className="absolute left-1/4 w-3 h-3 rounded-full bg-primary/40 transform -translate-x-1/2"></div>
            <div className="absolute left-1/2 w-3 h-3 rounded-full bg-secondary/40 transform -translate-x-1/2"></div>
            <div className="absolute left-3/4 w-3 h-3 rounded-full bg-accent/40 transform -translate-x-1/2"></div>
          </div>
          
          <CssStaggered staggerAmount={0.15}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: <div className="p-4 rounded-full bg-primary/10 text-primary"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg></div>,
                  title: "Sign in with Google",
                  description: "Quick setup with your existing Google account, no complicated registration.",
                  number: "01"
                },
                { 
                  icon: <div className="p-4 rounded-full bg-secondary/10 text-secondary"><Brain className="h-6 w-6" /></div>,
                  title: "System analyzes your level",
                  description: "Our AI assesses your current skills through a brief diagnostic test.",
                  number: "02"
                },
                { 
                  icon: <div className="p-4 rounded-full bg-accent/10 text-accent"><BookOpen className="h-6 w-6" /></div>, 
                  title: "Get micro-lessons & quizzes",
                  description: "Bite-sized lessons delivered in 5-minute chunks optimized for retention.",
                  number: "03"
                },
                { 
                  icon: <div className="p-4 rounded-full bg-primary/10 text-primary"><LineChart className="h-6 w-6" /></div>,
                  title: "Track progress instantly",
                  description: "Real-time progress tracking and skill development visualization.",
                  number: "04" 
                }
              ].map((step, index) => (
                <div key={index}>
                  <Card className="h-full transition-all duration-300 hover:shadow-lg border-border/40 hover:border-primary/20 relative z-10">
                    <div className="absolute -top-3 -right-3 bg-background text-sm font-semibold text-muted-foreground px-2 py-1 rounded-md border border-border">
                      {step.number}
                    </div>
                    <CardHeader>
                      <div className="flex justify-center mb-4">{step.icon}</div>
                      <CardTitle className="text-center text-xl">
                        {step.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-center text-muted-foreground text-sm">
                        {step.description}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </CssStaggered>
          
          {/* Try now button */}
          <CssSlide direction="up" delay={0.6}>
            <div className="mt-16 text-center">
              <Button variant="outline" className="rounded-full px-8">
                Learn More <span className="ml-2">→</span>
              </Button>
            </div>
          </CssSlide>
        </div>
        
        {/* Accent shapes */}
        <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -top-16 -right-16 w-32 h-32 bg-accent/5 rounded-full blur-3xl"></div>
      </section>

      {/* Key Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <CssSlide direction="up">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold">Key Features</h2>
              <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
                Discover what makes SkillBit the smarter way to learn
              </p>
            </div>
          </CssSlide>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Brain className="h-12 w-12 text-primary" />,
                title: "Adaptive Learning Engine",
                description: "Content adapts to your performance, focusing on areas where you need more practice." 
              },
              { 
                icon: <Zap className="h-12 w-12 text-secondary" />,
                title: "Micro-bite Lessons",
                description: "5-minute max lessons designed for optimal focus and retention with no burnout." 
              },
              { 
                icon: <Award className="h-12 w-12 text-accent" />,
                title: "Gamification",
                description: "Earn points, maintain streaks, and unlock achievements as you progress." 
              },
              { 
                icon: <TrendingUp className="h-12 w-12 text-primary" />,
                title: "Progress Dashboard",
                description: "Visual analytics that show your improvement over time with detailed metrics." 
              },
              { 
                icon: <Target className="h-12 w-12 text-secondary" />,
                title: "AI Recommendations",
                description: "Smart suggestions for topics and content based on your learning patterns." 
              },
              { 
                icon: <Smartphone className="h-12 w-12 text-accent" />,
                title: "Cross-device Sync",
                description: "Seamlessly continue learning across all your devices with cloud synchronization." 
              }
            ].map((feature, index) => (
              <CssSlide key={index} direction="up" delay={index * 0.1} distance="small">
                <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-border/40 hover:border-primary/20">
                  <CardHeader>
                    <div className="mb-4 flex justify-center">{feature.icon}</div>
                    <CardTitle className="text-center">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              </CssSlide>
            ))}
          </div>
        </div>
      </section>

      {/* Rest of the code... */}
    </div>
  )
}
