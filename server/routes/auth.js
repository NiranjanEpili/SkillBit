const express = require('express');
const { OAuth2Client } = require('google-auth-library');
const router = express.Router();
const User = require('../models/User'); // Adjust path to your user model

// Create a Google OAuth client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Handle Google Sign-in
router.post('/google', async (req, res) => {
    const { idToken } = req.body;
    
    try {
        // Verify the token
        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID
        });
        
        // Get user payload
        const payload = ticket.getPayload();
        const { email, name, picture, sub: googleId } = payload;
        
        // Check if user exists
        let user = await User.findOne({ email });
        
        if (!user) {
            // Create new user if doesn't exist
            user = new User({
                email,
                name,
                profilePicture: picture,
                googleId,
                isEmailVerified: true // Google accounts have verified emails
            });
            await user.save();
        } else if (!user.googleId) {
            // If user exists but hasn't used Google sign-in before
            user.googleId = googleId;
            user.profilePicture = user.profilePicture || picture;
            await user.save();
        }
        
        // Create a session or JWT token
        const token = generateAuthToken(user); // Implement this function based on your auth strategy
        
        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                profilePicture: user.profilePicture
            }
        });
    } catch (error) {
        console.error('Google authentication error:', error);
        res.status(401).json({
            success: false,
            message: 'Invalid Google token'
        });
    }
});

module.exports = router;
