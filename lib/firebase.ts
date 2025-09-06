import { initializeApp, getApps } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAzposQv1rGLiEfcAG2NpxIaNlc84C8uQc",
  authDomain: "skillbit-5b410.firebaseapp.com",
  projectId: "skillbit-5b410",
  storageBucket: "skillbit-5b410.appspot.com",
  messagingSenderId: "1053486010503",
  appId: "1:1053486010503:web:1d3d85b1253b5a557d6822",
  measurementId: "G-MCW1F9MJXD"
};

// Initialize Firebase - handle both client and server environments
let app;
let analytics;
let auth;
let db;
let googleProvider;

// Only initialize in browser environment
if (typeof window !== 'undefined') {
  try {
    // Check if Firebase is already initialized to avoid multiple instances
    if (!getApps().length) {
      console.log("Initializing Firebase app...");
      app = initializeApp(firebaseConfig);
      
      try {
        analytics = getAnalytics(app);
      } catch (error) {
        console.warn("Analytics initialization error:", error);
      }
    } else {
      console.log("Firebase app already initialized, retrieving instance...");
      app = getApps()[0];
    }

    // Initialize Firebase services
    auth = getAuth(app);
    db = getFirestore(app);
    
    // Enhanced Google provider setup
    googleProvider = new GoogleAuthProvider();
    
    // Add scopes if needed (optional)
    googleProvider.addScope('https://www.googleapis.com/auth/userinfo.email');
    googleProvider.addScope('https://www.googleapis.com/auth/userinfo.profile');
    
    // Configure Google provider with improved parameters
    googleProvider.setCustomParameters({
      prompt: 'select_account',
      access_type: 'offline',
      // Ensure compatibility with different browsers
      ux_mode: 'popup'
    });

    // Set persistence correctly with better error handling
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        console.log("Firebase auth persistence set successfully");
      })
      .catch(error => {
        console.error("Error setting auth persistence:", error);
      });
  } catch (error) {
    console.error("Firebase initialization error:", error);
  }
} 

export { auth, googleProvider, db };
