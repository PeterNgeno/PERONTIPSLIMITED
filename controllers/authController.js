const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require('../models/User'); // MongoDB User model

// Handle POST request to sign up a new user
router.post('/signup', async (req, res) => {
  const { firstName, secondName, phone, email, password } = req.body;

  // Validate input data
  if (!firstName || !secondName || !phone || !email || !password) {
    return res.status(400).send('Please fill in all fields');
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send('Email is already registered');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user document
    const newUser = new User({
      firstName,
      secondName,
      phone,
      email,
      password: hashedPassword, // Store the hashed password
    });

    // Save the user in the database
    await newUser.save();

    // Redirect to login page or send success response
    res.redirect('/login'); // Change to a JSON response if not redirecting: res.status(201).send('User registered successfully');
  } catch (err) {
    console.error('Error during user signup:', err);
    res.status(500).send('Error signing up. Please try again later.');
  }
});

module.exports = router;
