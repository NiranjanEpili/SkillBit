import React from 'react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CreditCard, ExternalLink } from "lucide-react";

export function FirebaseBillingGuide() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-center">
        Setting Up Firebase Billing for Phone Authentication
      </h2>
      
      <Alert>
        <AlertTitle className="flex items-center gap-2">
          <CreditCard className="h-4 w-4" /> 
          Why Billing is Required
        </AlertTitle>
        <AlertDescription>
          Firebase requires a billing account for phone authentication because sending SMS verification 
          codes costs money. However, Firebase offers a generous free tier and you'll only be charged 
          if you exceed the free limits.
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Follow these steps to set up billing:</h3>
        
        <div className="space-y-3 border rounded-lg p-4">
          <h4 className="font-medium">Step 1: Access Firebase Console</h4>
          <p className="text-sm text-muted-foreground">
            Log into the Firebase Console using your Google account
          </p>
          <div className="flex justify-center">
            <a 
              href="https://console.firebase.google.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary hover:underline"
            >
              Go to Firebase Console <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
        
        <div className="space-y-3 border rounded-lg p-4">
          <h4 className="font-medium">Step 2: Select Your Project</h4>
          <p className="text-sm text-muted-foreground">
            From the project list, select the project you're working with (skillbit-5b410)
          </p>
        </div>
        
        <div className="space-y-3 border rounded-lg p-4">
          <h4 className="font-medium">Step 3: Navigate to Billing</h4>
          <p className="text-sm text-muted-foreground">
            In the left sidebar, click on "Settings" (gear icon) and select "Usage and Billing" → "Details & Settings"
          </p>
        </div>
        
        <div className="space-y-3 border rounded-lg p-4">
          <h4 className="font-medium">Step 4: Set Up a Payment Method</h4>
          <p className="text-sm text-muted-foreground">
            Click "Add payment method" and follow the instructions to add your card details
          </p>
        </div>
        
        <div className="space-y-3 border rounded-lg p-4">
          <h4 className="font-medium">Step 5: Enable Phone Authentication</h4>
          <p className="text-sm text-muted-foreground">
            Return to your project, go to "Authentication" → "Sign-in method", and enable the Phone provider
          </p>
        </div>
      </div>

      <div className="bg-muted p-3 rounded-md text-sm">
        <p className="mb-2 font-medium">📝 Note:</p>
        <p>
          The Firebase Spark plan (free tier) includes a generous number of phone authentication 
          operations before you incur any charges. You can also set up budget alerts to avoid unexpected costs.
        </p>
      </div>

      <div className="flex justify-center">
        <Button variant="outline" className="flex items-center gap-2">
          <ExternalLink className="h-4 w-4" />
          <a 
            href="https://firebase.google.com/docs/auth/web/phone-auth" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            Learn More About Phone Authentication
          </a>
        </Button>
      </div>
    </div>
  );
}
