const express = require('express');
const router = express.Router();

// Example in-memory quiz data (You can replace this with MongoDB or a database)
const quizData = [
  {
    question: "What is the capital of Kenya?",
    options: ["Nairobi", "Mombasa", "Kisumu", "Nakuru"],
    correctAnswer: "Nairobi"
  },
  {
    question: "What is the largest ocean?",
    options: ["Atlantic", "Pacific", "Indian", "Arctic"],
    correctAnswer: "Pacific"
  },
  // Add more questions as needed
];

// Route to get all quiz questions
router.get('/', (req, res) => {
  res.json({ message: 'Quiz page is working!', quizData });
});

// Route to submit quiz answers and calculate score
router.post('/submit', (req, res) => {
  const userAnswers = req.body.answers; // Assuming the answers are sent in the body
  let score = 0;

  quizData.forEach((question, index) => {
    if (userAnswers[index] === question.correctAnswer) {
      score++;
    }
  });

  res.json({ message: 'Quiz submitted successfully', score });
});

module.exports = router;
