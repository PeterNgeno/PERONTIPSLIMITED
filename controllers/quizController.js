// Logic for handling quiz start, submission, and answer checking
exports.startQuiz = (req, res) => {
  const section = req.body.section;
  const payment = req.body.payment;
  const timer = getTimerDuration(payment);

  res.json({ message: `Starting section ${section} with ${timer} seconds` });
};

exports.submitQuiz = (req, res) => {
  const answers = req.body.answers;
  const section = req.body.section;
  
  const score = checkAnswers(answers);
  
  if (score === 10) {
    res.json({ success: true, message: 'You passed! Proceed to next section.' });
  } else {
    res.json({ success: false, message: 'You failed. Please pay to retry.' });
  }
};

function checkAnswers(answers) {
  const correctAnswers = ["Nairobi", "Blue Whale", "Python", "Mount Kenya", "5", "Eiffel Tower", "Ottoman Empire", "12", "Mars", "Julius Caesar"];
  let score = 0;
  
  answers.forEach((answer, index) => {
    if (answer.toLowerCase() === correctAnswers[index].toLowerCase()) {
      score++;
    }
  });

  return score;
}

function getTimerDuration(payment) {
  switch (payment) {
    case '50': return 30;
    case '100': return 45;
    case '200': return 50;
    case '400': return 65;
    default: return 30;
  }
}
