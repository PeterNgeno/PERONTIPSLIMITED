// authController.js (signup route)
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Handle POST request to sign up a new user
router.post('/signup', async (req, res) => {
    const { firstName, secondName, phone, email, password } = req.body;

    // Validate data (you can add more validation here)
    if (!firstName || !secondName || !phone || !email || !password) {
        return res.status(400).send('Please fill in all fields');
    }

    // Create new user
    try {
        const newUser = new User({
            firstName,
            secondName,
            phone,
            email,
            password, // Make sure to hash password before saving in production
        });
        await newUser.save();
        res.redirect('/login'); // Redirect to login page after successful signup
    } catch (err) {
        res.status(500).send('Error signing up. Please try again.');
    }
});

module.exports = router;