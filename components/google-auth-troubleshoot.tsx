import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { HelpCircle, ExternalLink, CheckCircle } from "lucide-react";

export function GoogleAuthTroubleshooter() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<number>(1);
  const [popupsEnabled, setPopupsEnabled] = useState<boolean | null>(null);
  const [cookiesEnabled, setCookiesEnabled] = useState<boolean | null>(null);
  const [thirdPartyCookiesEnabled, setThirdPartyCookiesEnabled] = useState<boolean | null>(null);

  const checkPopups = () => {
    // placeholder: in real code you'd perform an actual check
    setPopupsEnabled(true);
    setStep(2);
  };

  const checkCookies = () => {
    // placeholder: in real code you'd perform an actual check
    setCookiesEnabled(true);
    setStep(3);
  };

  const checkThirdPartyCookies = (blocked: boolean) => {
    // blocked === true means third-party cookies are blocked
    setThirdPartyCookiesEnabled(blocked);
    setStep(4);
  };

  const resetChecks = () => {
    setStep(1);
    setPopupsEnabled(null);
    setCookiesEnabled(null);
    setThirdPartyCookiesEnabled(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="link" size="sm" className="flex items-center text-sm">
          <HelpCircle className="h-4 w-4 mr-1" />
          Trouble signing in with Google?
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Google Sign-In Troubleshooter</DialogTitle>
          <DialogDescription>
            Let's diagnose why Google Sign-In might not be working for you.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {step === 1 && (
            <div className="space-y-4">
              <p className="text-sm">
                First, let's check if your browser allows pop-ups from this site.
              </p>
              <Button onClick={checkPopups}>Check Pop-ups</Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              {popupsEnabled === true ? (
                <Alert variant="default" className="bg-green-50 border-green-200">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-600">
                    Pop-ups are enabled. That's good!
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert variant="destructive">
                  <AlertDescription>
                    Pop-ups appear to be blocked. Google Sign-In requires pop-ups to be allowed for this site.
                    <div className="mt-2">
                      <strong>How to enable pop-ups:</strong>
                      <ul className="list-disc pl-5 mt-1 space-y-1 text-sm">
                        <li>Look for a pop-up blocked icon in your browser's address bar</li>
                        <li>Click it and select "Always allow pop-ups from this site"</li>
                        <li>Then try signing in with Google again</li>
                      </ul>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
              <Button onClick={checkCookies}>Next: Check Cookies</Button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              {cookiesEnabled ? (
                <Alert variant="default" className="bg-green-50 border-green-200">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-600">
                    Cookies are enabled. That's good!
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert variant="destructive">
                  <AlertDescription>
                    Cookies appear to be disabled. Google Sign-In requires cookies to be enabled.
                    <div className="mt-2">
                      <strong>How to enable cookies:</strong>
                      <ul className="list-disc pl-5 mt-1 space-y-1 text-sm">
                        <li>Open your browser settings</li>
                        <li>Find Privacy or Cookie settings</li>
                        <li>Enable cookies or remove restrictions</li>
                      </ul>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
              <p className="text-sm mt-4">
                Does your browser block third-party cookies? (These are needed for Google Sign-In)
              </p>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => checkThirdPartyCookies(false)}>
                  No, they're allowed
                </Button>
                <Button variant="outline" onClick={() => checkThirdPartyCookies(true)}>
                  Yes, they're blocked
                </Button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              {thirdPartyCookiesEnabled === true ? (
                <Alert variant="destructive">
                  <AlertDescription>
                    Third-party cookies are blocked. Google Sign-In requires these to be enabled temporarily.
                    <div className="mt-2">
                      <strong>Solutions:</strong>
                      <ul className="list-disc pl-5 mt-1 space-y-1 text-sm">
                        <li>Temporarily disable third-party cookie blocking</li>
                        <li>Add this site to your exceptions list in browser settings</li>
                        <li>Try signing in with email and password instead</li>
                      </ul>
                    </div>
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert variant="default" className="bg-green-50 border-green-200">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-600">
                    Third-party cookies are allowed. That's good!
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="mt-4 space-y-4">
                <p className="text-sm font-medium">Other things to try:</p>
                <ul className="list-disc pl-5 space-y-2 text-sm">
                  <li>Use Chrome, Firefox, or Edge for best compatibility</li>
                  <li>Disable any privacy browser extensions temporarily</li>
                  <li>Try signing in with an Incognito/Private window</li>
                  <li>Clear your browser cache and cookies</li>
                </ul>
                
                <div className="flex justify-center">
                  <a 
                    href="https://support.google.com/accounts/answer/7675428" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-primary hover:underline"
                  >
                    Google Sign-In Help <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-between">
          {step > 1 && (
            <Button variant="outline" onClick={resetChecks}>
              Start Over
            </Button>
          )}
          <Button variant="default" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
