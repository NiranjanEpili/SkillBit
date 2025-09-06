"use client"

import { ReactNode, useEffect, useRef, useState } from "react"

type Direction = "up" | "down" | "left" | "right"
type AnimationDistance = "small" | "medium" | "large"

interface SlideProps {
  children: ReactNode
  direction?: Direction
  distance?: AnimationDistance
  duration?: number
  delay?: number
  className?: string
  once?: boolean
}

export function CssSlide({
  children,
  direction = "up",
  distance = "medium",
  duration = 0.5,
  delay = 0,
  className = "",
  once = true,
}: SlideProps) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  
  // Map distance values to actual pixels
  const distanceToPixels = {
    small: 20,
    medium: 50,
    large: 100,
  }
  
  const pixels = distanceToPixels[distance]
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (once) {
            observer.unobserve(entry.target)
          }
        } else if (!once) {
          setIsVisible(false)
        }
      },
      { threshold: 0.1 }
    )
    
    const currentRef = ref.current
    if (currentRef) {
      observer.observe(currentRef)
    }
    
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [once])
  
  // Set initial transform based on direction
  const getInitialTransform = () => {
    switch (direction) {
      case "up": return `translateY(${pixels}px)`
      case "down": return `translateY(-${pixels}px)`
      case "left": return `translateX(${pixels}px)`
      case "right": return `translateX(-${pixels}px)`
      default: return `translateY(${pixels}px)`
    }
  }

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translate(0, 0)' : getInitialTransform(),
        transition: `opacity ${duration}s ease, transform ${duration}s ease`,
        transitionDelay: `${delay}s`
      }}
    >
      {children}
    </div>
  )
}
