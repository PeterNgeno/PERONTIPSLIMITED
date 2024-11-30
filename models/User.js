const express = require('express');
const router = express.Router();
const db = require('../db');  // Assuming you have the SQLite connection set up

// Route to get all quiz questions
router.get('/', (req, res) => {
  // Fetch all quizzes from the database
  const sql = `SELECT * FROM Quizzes`;
  
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Error fetching quizzes:', err);
      return res.status(500).json({ error: 'Failed to fetch quizzes' });
    }
    res.json({ message: 'Quiz page is working!', quizzes: rows });
  });
});

// Route to submit quiz answers and calculate score
router.post('/submit', (req, res) => {
  const userAnswers = req.body.answers; // Assuming the answers are sent in the body
  let score = 0;

  // Fetch all quizzes from the database
  const sql = `SELECT * FROM Quizzes`;

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Error fetching quizzes for score calculation:', err);
      return res.status(500).json({ error: 'Failed to calculate score' });
    }

    rows.forEach((question, index) => {
      if (userAnswers[index] === question.answer) {
        score++;
      }
    });

    res.json({ message: 'Quiz submitted successfully', score });
  });
});

module.exports = router;
