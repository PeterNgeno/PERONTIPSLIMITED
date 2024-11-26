// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');
const isAdmin = require('../middleware/authMiddleware'); // Only allow admins to access

// Route to get quiz data for a section (A to J)
router.get('/admin/quiz', isAdmin, async (req, res) => {
  const section = req.query.section; // Get the section from query params (A to J)
  try {
    const quiz = await Quiz.findOne({ section });
    res.json(quiz || { questions: [] }); // If no quiz, return empty questions array
  } catch (error) {
    res.status(500).json({ error: 'Error fetching quiz data' });
  }
});

// Route to update quiz data for a section (A to J)
router.post('/admin/quiz', isAdmin, async (req, res) => {
  const { section, questions } = req.body; // Get section and questions from request body
  try {
    let quiz = await Quiz.findOne({ section });
    if (quiz) {
      quiz.questions = questions; // Update questions if quiz exists
      await quiz.save();
    } else {
      quiz = new Quiz({ section, questions }); // Create new quiz if it doesn't exist
      await quiz.save();
    }
    res.status(200).send('Quiz updated successfully');
  } catch (error) {
    res.status(500).send('Error updating quiz');
  }
});

module.exports = router;
