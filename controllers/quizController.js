const sqlite3 = require('sqlite3').verbose();

// Initialize the SQLite database
const db = new sqlite3.Database('./database.db');

// Start Quiz: Fetch the section's quiz and timer duration based on payment
exports.startQuiz = async (req, res) => {
  const { section, payment } = req.body;

  try {
    const timer = getTimerDuration(payment);

    // Fetch quiz from the SQLite database
    db.get('SELECT * FROM quizzes WHERE section = ?', [section], (err, quiz) => {
      if (err) {
        console.error('Error fetching quiz:', err);
        return res.status(500).json({ error: 'Failed to fetch quiz' });
      }

      if (!quiz) {
        return res.status(404).json({ error: `No quiz found for section ${section}` });
      }

      const questions = JSON.parse(quiz.questions); // Assuming questions are stored as a JSON string
      res.json({
        message: `Starting section ${section} with ${timer} seconds`,
        quiz: questions,
        timer,
      });
    });
  } catch (error) {
    console.error('Error starting quiz:', error);
    res.status(500).json({ error: 'Failed to start quiz' });
  }
};

// Submit Quiz: Validate answers and return the result
exports.submitQuiz = async (req, res) => {
  const { answers, section } = req.body;
  const userId = req.user.id;

  try {
    // Fetch quiz from the SQLite database
    db.get('SELECT * FROM quizzes WHERE section = ?', [section], (err, quiz) => {
      if (err) {
        console.error('Error fetching quiz:', err);
        return res.status(500).json({ error: 'Failed to fetch quiz' });
      }

      if (!quiz) {
        return res.status(404).json({ error: `No quiz found for section ${section}` });
      }

      const score = checkAnswers(answers, JSON.parse(quiz.questions)); // Assuming questions are stored as JSON string

      // Fetch user data
      db.get('SELECT * FROM users WHERE id = ?', [userId], (err, user) => {
        if (err) {
          console.error('Error fetching user:', err);
          return res.status(500).json({ error: 'Failed to fetch user' });
        }

        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }

        // Update user score and section progress
        const updatedScore = user.score + score;
        const updatedSectionProgress = JSON.parse(user.sectionProgress);
        updatedSectionProgress[section] = score;

        // Update the user data in SQLite
        db.run('UPDATE users SET score = ?, sectionProgress = ? WHERE id = ?', [
          updatedScore,
          JSON.stringify(updatedSectionProgress), // Store section progress as a JSON string
          userId
        ], (err) => {
          if (err) {
            console.error('Error updating user:', err);
            return res.status(500).json({ error: 'Failed to update user' });
          }

          if (score === JSON.parse(quiz.questions).length) {
            res.json({
              success: true,
              message: 'You passed! Proceed to the next section.',
              score,
            });
          } else {
            res.json({
              success: false,
              message: 'You failed. Please pay to retry.',
              score,
            });
          }
        });
      });
    });
  } catch (error) {
    console.error('Error submitting quiz:', error);
    res.status(500).json({ error: 'Failed to submit quiz' });
  }
};

// Helper function to check answers against correct ones
function checkAnswers(submittedAnswers, correctQuestions) {
  let score = 0;

  submittedAnswers.forEach((answer, index) => {
    if (answer.toLowerCase() === correctQuestions[index].correctAnswer.toLowerCase()) {
      score++;
    }
  });

  return score;
}

// Helper function to determine timer duration based on payment
function getTimerDuration(payment) {
  switch (payment) {
    case '50':
      return 30;
    case '100':
      return 45;
    case '200':
      return 50;
    case '400':
      return 65;
    default:
      return 30;
  }
        }
