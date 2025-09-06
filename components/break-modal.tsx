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
  const [timeLeft, setTimeLeft] = useState(30)
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setTimeLeft(30)
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
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, timeLeft])

  const handleResumeNow = () => {
    setIsActive(false)
    onComplete()
  }

  const handleBreakComplete = () => {
    onComplete()
  }

  const progress = ((30 - timeLeft) / 30) * 100

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" hideCloseButton>
        <DialogHeader className="text-center">
          <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
            <Coffee className="h-8 w-8 text-accent" />
          </div>
          <DialogTitle className="text-xl">Time for a Break!</DialogTitle>
          <DialogDescription>You look tired. Take a short break to recharge your mind.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Timer Display */}
          <div className="text-center space-y-4">
            <div className="text-4xl font-bold text-primary">{timeLeft}s</div>
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-muted-foreground">Recommended break time remaining</p>
          </div>

          {/* Break Tips */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <h4 className="font-medium text-sm">Quick break tips:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Take deep breaths</li>
              <li>• Look away from the screen</li>
              <li>• Stretch your arms and neck</li>
              <li>• Drink some water</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {timeLeft > 0 ? (
              <Button onClick={handleResumeNow} variant="outline" className="w-full bg-transparent">
                <RefreshCw className="h-4 w-4 mr-2" />
                Resume Now
              </Button>
            ) : (
              <Button onClick={handleBreakComplete} className="w-full" size="lg">
                I'm Ready to Continue!
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
