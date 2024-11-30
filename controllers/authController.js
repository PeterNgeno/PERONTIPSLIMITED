const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../db'); // SQLite database connection
const router = express.Router();

// Handle POST request to sign up a new user
router.post('/signup', async (req, res) => {
  const { firstName, secondName, phone, email, password } = req.body;

  // Validate input data
  if (!firstName || !secondName || !phone || !email || !password) {
    return res.status(400).send('Please fill in all fields');
  }

  try {
    // Check if user already exists by email
    const query = 'SELECT * FROM users WHERE email = ?';
    db.get(query, [email], async (err, user) => {
      if (err) {
        console.error('Error checking user existence:', err);
        return res.status(500).send('Database error. Please try again later.');
      }

      if (user) {
        return res.status(400).send('Email is already registered');
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert new user into the database
      const insertQuery = `INSERT INTO users (firstName, secondName, phone, email, password) VALUES (?, ?, ?, ?, ?)`;
      db.run(insertQuery, [firstName, secondName, phone, email, hashedPassword], function (err) {
        if (err) {
          console.error('Error saving user:', err);
          return res.status(500).send('Error signing up. Please try again later.');
        }

        // Send success response
        res.status(201).send('User registered successfully');
      });
    });
  } catch (err) {
    console.error('Error during user signup:', err);
    res.status(500).send('Error signing up. Please try again later.');
  }
});

module.exports = router;
