"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Coffee, RefreshCw } from "lucide-react"

interface BreakModalProps {
  isOpen: boolean
  onComplete: () => void
}

export function BreakModal({ isOpen, onComplete }: BreakModalProps) {
  const [timeLeft, setTimeLeft] = useState(60) // 1 minute break
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setTimeLeft(60)
      setIsActive(true)
    }
  }, [isOpen])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      setIsActive(false)
      onComplete()
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, timeLeft, onComplete])

  const handleResumeNow = () => {
    setIsActive(false)
    onComplete()
  }

  const progress = ((60 - timeLeft) / 60) * 100

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-center gap-2">
            <Coffee className="h-5 w-5" />
            Time for a Break
          </DialogTitle>
          <DialogDescription>
            Take a minute to rest your mind and refresh. This helps prevent cognitive fatigue.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Timer Display */}
          <div className="text-center space-y-2">
            <div className="text-3xl font-bold">{timeLeft}s</div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Break Tips */}
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-medium mb-2">Quick Break Tips:</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Look away from the screen</li>
              <li>• Stand up and stretch</li>
              <li>• Take a few deep breaths</li>
              <li>• Drink some water</li>
            </ul>
          </div>

          {/* Skip Button */}
          <Button onClick={handleResumeNow} variant="outline" className="w-full">
            <RefreshCw className="h-4 w-4 mr-2" />
            Skip Break & Resume
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
