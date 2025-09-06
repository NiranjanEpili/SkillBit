// Google Sign-in configuration
const googleClientId = "YOUR_GOOGLE_CLIENT_ID"; // Replace with your actual client ID

// Initialize Google Sign-In
function initGoogleSignIn() {
  google.accounts.id.initialize({
    client_id: googleClientId,
    callback: handleGoogleSignIn
  });
}

// Render Google Sign-In buttons
function renderGoogleButton(elementId) {
  google.accounts.id.renderButton(
    document.getElementById(elementId),
    { 
      theme: 'outline', 
      size: 'large',
      text: 'continue_with',
      width: 240
    }
  );
}

// Handle Google Sign-In response
function handleGoogleSignIn(response) {
  // Get ID token from the response
  const idToken = response.credential;
  
  // Send the token to your backend for verification
  fetch('/api/auth/google', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ idToken })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      // Redirect to dashboard or home page
      window.location.href = '/dashboard';
    } else {
      // Show error message
      alert(data.message || 'Authentication failed');
    }
  })
  .catch(error => {
    console.error('Error during Google authentication:', error);
    alert('Authentication failed. Please try again.');
  });
}

// When the page loads, initialize Google Sign-In
document.addEventListener('DOMContentLoaded', initGoogleSignIn);
