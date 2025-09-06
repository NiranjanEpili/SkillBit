"use client"

import { useParams } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ExternalLink } from "lucide-react"
import Link from "next/link"

// Define the structure for topic links
type TopicYTLinks = {
  phy: Record<string, { title: string; url: string }>
  chem: Record<string, { title: string; url: string }>
  math: Record<string, { title: string; url: string }>
  bio: Record<string, { title: string; url: string }>
}

// Sample YouTube links data (replace with your actual data)
const topicYTLinks: TopicYTLinks = {
  phy: {
    "Units and Measurements": {
      title: "Units and Measurements - Physics Class 11",
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    },
    "Kinematics": {
      title: "Kinematics - Motion in One Dimension",
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    },
    "Laws of Motion": {
      title: "Newton's Laws of Motion",
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    },
    "Work, Energy and Power": {
      title: "Work, Energy and Power",
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    }
  },
  chem: {
    "Atomic Structure": {
      title: "Atomic Structure - Chemistry",
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    },
    "Chemical Bonding": {
      title: "Chemical Bonding and Molecular Structure",
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    }
  },
  math: {
    "Sets": {
      title: "Sets - Mathematics Class 11",
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    },
    "Functions": {
      title: "Relations and Functions",
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    }
  },
  bio: {
    "Cell Biology": {
      title: "Cell - The Unit of Life",
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    },
    "Genetics": {
      title: "Principles of Inheritance and Variation",
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    }
  }
}

export default function TopicPage() {
  const params = useParams()
  const courseId = params.course as string
  const topic = decodeURIComponent(params.topic as string)
  
  // Safe lookup with proper typing
  const courseLinks = (topicYTLinks as Record<string, Record<string, { title: string; url: string }>>)[courseId]
  const yt = courseLinks?.[topic] || null

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Back button */}
          <div className="mb-8">
            <Link href={`/lectures/${courseId}`}>
              <Button variant="outline" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Course
              </Button>
            </Link>
          </div>

          {/* Topic content */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                {topic}
              </CardTitle>
              <p className="text-muted-foreground">
                Course: {courseId.toUpperCase()}
              </p>
            </CardHeader>
            <CardContent>
              {yt ? (
                <div className="space-y-4">
                  <div className="aspect-video">
                    <iframe
                      src={`https://www.youtube.com/embed/${yt.url.split('v=')[1]}`}
                      className="w-full h-full rounded-lg"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{yt.title}</h3>
                    <Button variant="outline" asChild>
                      <a href={yt.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Watch on YouTube
                      </a>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    Video content for this topic is not available yet.
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Please check back later or contact support.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}