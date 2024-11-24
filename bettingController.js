const Payment = require('../models/Payment');

exports.getBettingPage = (req, res) => {
  res.render('betting');
};

exports.getBettingPredictions = (req, res) => {
  const { userId } = req.query;

  // Check if payment was made for predictions
  Payment.findByUserIdAndSection(userId, 'betting', (err, payment) => {
    if (err || !payment) {
      res.status(403).json({ error: 'Please pay to view predictions.' });
    } else {
      // Render predictions table
      res.render('betting-predictions', {
        predictions: [
          // Mock predictions data
          { match: 'Team A vs Team B', prediction: 'Team A Wins' },
          { match: 'Team C vs Team D', prediction: 'Over 2.5 Goals' },
          // Add more rows as needed
        ],
      });
    }
  });
};
