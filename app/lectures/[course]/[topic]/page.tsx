"use client"

import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"

// Import topicYTLinks from the main page or a shared file
const topicYTLinks = {
  phy: {
    "Units and Measurements": {
      title: "Units and Measurements | Physics",
      url: "https://www.youtube.com/watch?v=ZtqF8f5l2fA",
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

function getEmbedUrl(url: string) {
  // Extract video ID from various YouTube URL formats
  let videoId = null

  // Handle youtube.com/watch?v= format
  if (url.includes("youtube.com/watch")) {
    const urlParams = new URLSearchParams(url.split("?")[1] || "")
    videoId = urlParams.get("v")
  }
  // Handle youtu.be/ format
  else if (url.includes("youtu.be/")) {
    videoId = url.split("youtu.be/")[1]?.split("?")[0]
  }
  // Handle youtube.com/embed/ format
  else if (url.includes("youtube.com/embed/")) {
    videoId = url.split("youtube.com/embed/")[1]?.split("?")[0]
  }

  return videoId ? `https://www.youtube.com/embed/${videoId}` : null
}

export default function TopicDetailPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.course as string
  const topic = decodeURIComponent(params.topic as string)
  const yt = topicYTLinks[courseId]?.[topic]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-10">
        <Button variant="outline" className="mb-6" onClick={() => router.back()}>
          ← Back
        </Button>
        <h2 className="text-2xl font-bold mb-4">{topic}</h2>
        {yt ? (
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <Card>
                <CardHeader>
                  <CardTitle>{yt.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  {getEmbedUrl(yt.url) ? (
                    <div className="aspect-video bg-muted rounded-lg mb-2 overflow-hidden">
                      <iframe
                        width="1087"
                        height="611"
                        src={getEmbedUrl(yt.url)}
                        title={yt.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                        className="w-full h-full border-0"
                      />
                    </div>
                  ) : (
                    <div className="mb-2 text-red-500 font-semibold">
                      Video unavailable for direct playback.{" "}
                      <Button variant="outline" asChild>
                        <a href={yt.url} target="_blank" rel="noopener noreferrer">
                          Watch on YouTube
                        </a>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            <div className="w-full md:w-80 flex flex-col gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-2">
                    <Button variant="default">Mark as Completed</Button>
                    <Button variant="outline">Ask Doubt</Button>
                    <Button variant="outline">Download PDF</Button>
                    <Button variant="outline" asChild>
                      <a href={yt.url} target="_blank" rel="noopener noreferrer">
                        Watch on YouTube
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Fun Zone</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-muted-foreground text-sm">
                    <ul className="list-disc pl-5">
                      <li>Share this topic</li>
                      <li>Bookmark for revision</li>
                      <li>Challenge a friend</li>
                      <li>Random quiz</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="text-red-500 font-semibold">No video available for this topic.</div>
        )}
      </div>
    </div>
  )
}