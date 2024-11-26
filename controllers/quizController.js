const Quiz = require('../models/Quiz');
const User = require('../models/User');

// Start Quiz: Fetch the section's quiz and timer duration based on payment
exports.startQuiz = async (req, res) => {
  const { section, payment } = req.body;

  try {
    const timer = getTimerDuration(payment);

    const quiz = await Quiz.findOne({ section });
    if (!quiz) {
      return res.status(404).json({ error: `No quiz found for section ${section}` });
    }

    res.json({
      message: `Starting section ${section} with ${timer} seconds`,
      quiz: quiz.questions,
      timer,
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
    const quiz = await Quiz.findOne({ section });
    if (!quiz) {
      return res.status(404).json({ error: `No quiz found for section ${section}` });
    }

    const score = checkAnswers(answers, quiz.questions);

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update user's section progress and score
    user.sectionProgress[section] = score;
    user.score += score;
    await user.save();

    if (score === quiz.questions.length) {
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
