import { initializeApp, getApps } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAzposQv1rGLiEfcAG2NpxIaNlc84C8uQc",
  authDomain: "skillbit-5b410.firebaseapp.com",
  projectId: "skillbit-5b410",
  storageBucket: "skillbit-5b410.firebasestorage.app",
  messagingSenderId: "1053486010503",
  appId: "1:1053486010503:web:1d3d85b1253b5a557d6822",
  measurementId: "G-MCW1F9MJXD"
};

// Initialize Firebase
let app;
let analytics;

if (typeof window !== 'undefined' && !getApps().length) {
  app = initializeApp(firebaseConfig);
  // Analytics only works in browser environment
  try {
    analytics = getAnalytics(app);
  } catch (error) {
    console.error("Analytics error:", error);
  }
} else {
  app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
}

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Configure Google provider (optional)
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Configure phone auth settings for specific countries if needed
// Example: auth.settings.appVerificationDisabledForTesting = true; // Only in development

export { auth, googleProvider };
