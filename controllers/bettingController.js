const Payment = require('../models/Payment');

exports.getBettingPage = (req, res) => {
  res.render('betting'); // Render the betting page
};

exports.getBettingPredictions = async (req, res) => {
  const { userId } = req.query;

  try {
    // Check if payment was made for predictions (look for a record where the userId matches and the section is 'betting')
    const payment = await Payment.findOne({ userId, section: 'betting' });

    if (!payment) {
      return res.status(403).json({ error: 'Please pay to view predictions.' });
    } else {
      // If payment found, render predictions
      res.render('betting-predictions', {
        predictions: [
          // Mock predictions data (replace with actual data as needed)
          { match: 'Team A vs Team B', prediction: 'Team A Wins' },
          { match: 'Team C vs Team D', prediction: 'Over 2.5 Goals' },
          // Add more predictions as needed
        ],
      });
    }
  } catch (err) {
    console.error('Error fetching payment status or predictions:', err);
    res.status(500).json({ error: 'Error processing request' });
  }
};
