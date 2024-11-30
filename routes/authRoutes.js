const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt'); // For password hashing
const { User } = require('../db'); // Import User model from db.js

// POST route for signing up
router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if the user already exists
    User.findOne(email, (err, existingUser) => {
      if (err) {
        console.error('Error checking existing user:', err);
        return res.status(500).json({ error: 'Error checking user existence' });
      }

      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }

      // Hash the password before saving
      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
          console.error('Error hashing password:', err);
          return res.status(500).json({ error: 'Error hashing password' });
        }

        // Create and save the new user
        User.save(username, email, hashedPassword, (err) => {
          if (err) {
            console.error('Error saving user:', err);
            return res.status(500).json({ error: 'Error signing up user' });
          }

          res.status(201).json({ message: 'User signed up successfully' });
        });
      });
    });
  } catch (error) {
    console.error('Error signing up user:', error);
    res.status(500).json({ error: 'Error signing up user' });
  }
});

module.exports = router;
