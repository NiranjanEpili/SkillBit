"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Phone, CreditCard, ExternalLink } from "lucide-react"

import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth"
import { auth } from "@/lib/firebase"

interface PhoneAuthProps {
  onSuccess: (phoneNumber: string, userId: string) => void
  buttonText?: string
}

export function PhoneAuth({ onSuccess, buttonText = "Continue with Phone" }: PhoneAuthProps) {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [verificationId, setVerificationId] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState<"phone" | "code">("phone")
  const [billingError, setBillingError] = useState(false)

  // Set up recaptcha verifier
  const setupRecaptcha = () => {
    if (!(window as any).recaptchaVerifier) {
      (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': () => {
          // reCAPTCHA solved, allow sending verification code
        },
        'expired-callback': () => {
          // Response expired. Ask user to solve reCAPTCHA again
          setError("reCAPTCHA expired. Please try again.")
        }
      });
    }
  }

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setBillingError(false)
    setIsLoading(true)

    // Basic phone number validation
    if (!phoneNumber || phoneNumber.replace(/\D/g, '').length < 10) {
      setError("Please enter a valid phone number")
      setIsLoading(false)
      return
    }

    // Format phone number to E.164 standard (e.g., +14155552671)
    const formattedPhoneNumber = phoneNumber.startsWith('+') 
      ? phoneNumber 
      : `+${phoneNumber.replace(/\D/g, '')}`

    try {
      setupRecaptcha()
      const appVerifier = (window as any).recaptchaVerifier
      
      const confirmationResult = await signInWithPhoneNumber(
        auth, 
        formattedPhoneNumber, 
        appVerifier
      )
      
      // Save the verification ID
      setVerificationId(confirmationResult.verificationId)
      setStep("code")
      setIsLoading(false)
    } catch (error: any) {
      console.error("Error sending code:", error)
      
      // Check specifically for billing error
      if (error.code === 'auth/billing-not-enabled') {
        setBillingError(true)
      } else {
        setError(error.message || "Failed to send verification code. Please try again.")
      }
      
      setIsLoading(false)
      
      // Reset reCAPTCHA
      if ((window as any).recaptchaVerifier) {
        (window as any).recaptchaVerifier.clear()
        delete (window as any).recaptchaVerifier
      }
    }
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    if (!verificationCode || verificationCode.length !== 6) {
      setError("Please enter a valid 6-digit verification code")
      setIsLoading(false)
      return
    }

    try {
      // Import PhoneAuthProvider dynamically to avoid SSR issues
      const { PhoneAuthProvider } = await import("firebase/auth")
      
      // Create credential
      const credential = PhoneAuthProvider.credential(
        verificationId,
        verificationCode
      )
      
      // Sign in with credential
      const result = await auth.signInWithCredential(credential)
      
      // Call the onSuccess callback with the user's info
      onSuccess(phoneNumber, result.user.uid)
      setIsLoading(false)
    } catch (error: any) {
      console.error("Error verifying code:", error)
      setError(error.message || "Invalid verification code. Please try again.")
      setIsLoading(false)
    }
  }

  // Render billing error message and instructions
  if (billingError) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive" className="mb-4">
          <AlertTitle className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Billing Required for Phone Authentication
          </AlertTitle>
          <AlertDescription className="mt-2">
            <p className="mb-2">
              Firebase requires a billing account to use phone authentication because SMS messages cost money.
            </p>
            <p className="mb-4">
              To enable phone authentication, please follow these steps:
            </p>
            <ol className="list-decimal pl-5 space-y-1 mb-4">
              <li>Go to the <strong>Firebase Console</strong></li>
              <li>Select your project</li>
              <li>Click on <strong>Authentication</strong> in the left sidebar</li>
              <li>Select <strong>Sign-in methods</strong></li>
              <li>Find <strong>Phone</strong> and click on it</li>
              <li>Follow the instructions to set up billing</li>
            </ol>
            <div className="flex justify-center">
              <a
                href="https://console.firebase.google.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-600 hover:underline"
              >
                Open Firebase Console <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </AlertDescription>
        </Alert>
        
        <div className="text-center">
          <Button
            variant="outline"
            onClick={() => setBillingError(false)}
            className="mb-2"
          >
            Try Again
          </Button>
          <p className="text-sm text-muted-foreground">
            You can also use email or Google authentication instead.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Recaptcha container (hidden) */}
      <div id="recaptcha-container"></div>
      
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {step === "phone" ? (
        <form onSubmit={handleSendCode} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="Enter your phone number (with country code)"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">Format: +1234567890 (include country code)</p>
          </div>
          
          <Button 
            type="submit" 
            className="w-full flex items-center justify-center gap-2" 
            disabled={isLoading}
          >
            <Phone className="h-4 w-4" />
            {isLoading ? "Sending Code..." : buttonText}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleVerifyCode} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="code">Verification Code</Label>
            <Input
              id="code"
              type="text"
              placeholder="Enter 6-digit verification code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              required
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? "Verifying..." : "Verify Code"}
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={() => setStep("phone")}
            disabled={isLoading}
          >
            Change Phone Number
          </Button>
        </form>
      )}
    </div>
  )
}
