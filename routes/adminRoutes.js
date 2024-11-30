const express = require('express');
const router = express.Router();
const { Quiz } = require('../db'); // Import the Quiz model from db.js
const isAdmin = require('../middleware/authMiddleware'); // Middleware to allow only admins

// Route to get quiz data for a section (A to J)
router.get('/admin/quiz', isAdmin, (req, res) => {
  const section = req.query.section; // Get the section from query params (A to J)
  Quiz.findOne(section, (err, quiz) => {
    if (err) {
      res.status(500).json({ error: 'Error fetching quiz data' });
    } else {
      res.json(quiz ? { section: quiz.section, questions: JSON.parse(quiz.questions) } : { questions: [] });
    }
  });
});

// Route to update quiz data for a section (A to J)
router.post('/admin/quiz', isAdmin, (req, res) => {
  const { section, questions } = req.body; // Get section and questions from request body
  Quiz.save(section, questions, (err) => {
    if (err) {
      res.status(500).send('Error updating quiz');
    } else {
      res.status(200).send('Quiz updated successfully');
    }
  });
});

module.exports = router;
