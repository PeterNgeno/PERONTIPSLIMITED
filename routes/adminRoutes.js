// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');
const isAdmin = require('../middleware/authMiddleware'); // Only allow admins to access

// Route to get quiz data for a section (A to J)
router.get('/admin/quiz', isAdmin, async (req, res) => {
  const section = req.query.section; // Get the section from query params (A to J)
  const quiz = await Quiz.findOne({ where: { section } });
  res.json(quiz || { questions: [] }); // If no quiz, return empty questions array
});

// Route to update quiz data for a section (A to J)
router.post('/admin/quiz', isAdmin, async (req, res) => {
  const { section, questions } = req.body; // Get section and questions from request body
  try {
    const quiz = await Quiz.findOne({ where: { section } });
    if (quiz) {
      quiz.questions = questions;
      await quiz.save();
    } else {
      await Quiz.create({ section, questions });
    }
    res.status(200).send('Quiz updated successfully');
  } catch (error) {
    res.status(500).send('Error updating quiz');
  }
});

module.exports = router;
