// Google Sign-In function
function signInWithGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();
  
  // Add scopes if needed
  provider.addScope('https://www.googleapis.com/auth/userinfo.profile');
  provider.addScope('https://www.googleapis.com/auth/userinfo.email');
  
  // Sign in with popup
  firebase.auth().signInWithPopup(provider)
    .then((result) => {
      // This gives you a Google Access Token
      const credential = result.credential;
      const token = credential.accessToken;
      
      // The signed-in user info
      const user = result.user;
      
      // Redirect to dashboard or home page after successful login
      window.location.href = '/dashboard.html';
    })
    .catch((error) => {
      // Handle errors
      const errorCode = error.code;
      const errorMessage = error.message;
      
      // Display error to user
      document.getElementById('error-message').textContent = errorMessage;
      console.error('Error signing in with Google:', error);
    });
}

// Sign out function
function signOut() {
  firebase.auth().signOut()
    .then(() => {
      // Sign-out successful
      window.location.href = '/index.html';
    })
    .catch((error) => {
      // An error happened
      console.error('Error signing out:', error);
    });
}

// Email/Password sign up
function signUpWithEmail(email, password, displayName) {
  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      
      // Update display name
      user.updateProfile({
        displayName: displayName
      }).then(() => {
        // Redirect to dashboard or home page
        window.location.href = '/dashboard.html';
      });
    })
    .catch((error) => {
      const errorMessage = error.message;
      document.getElementById('error-message').textContent = errorMessage;
      console.error('Error signing up:', error);
    });
}

// Email/Password sign in
function signInWithEmail(email, password) {
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      window.location.href = '/dashboard.html';
    })
    .catch((error) => {
      const errorMessage = error.message;
      document.getElementById('error-message').textContent = errorMessage;
      console.error('Error signing in:', error);
    });
}

// Listen for auth state changes
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    // User is signed in
    console.log('User is signed in:', user);
    // Update UI accordingly
    if (document.getElementById('user-display')) {
      document.getElementById('user-display').textContent = user.displayName || user.email;
    }
  } else {
    // User is signed out
    console.log('User is signed out');
    // Update UI accordingly
  }
});
