const express = require('express');
const router = express.Router();
const { User } = require('../db'); // Assuming a User model is available in db.js
const { getBettingPredictions } = require('../services/bettingService'); // A service function to fetch predictions
const { processPayment } = require('../services/paymentService'); // Function to handle payment processing

// Route to view betting predictions (after payment of 20 Ksh)
router.get('/betting-predictions', async (req, res) => {
  const userId = req.user.id; // Assuming user ID is available after authentication

  // Check if user has already paid 20 Ksh for access
  try {
    const user = await User.findById(userId);

    if (!user || !user.hasPaid) {
      return res.status(400).json({ error: 'You need to pay 20 Ksh to access betting predictions' });
    }

    // If payment is confirmed, fetch the betting predictions
    const predictions = await getBettingPredictions();

    // Return predictions in a 3-column, 21-row table format
    const tableData = formatPredictionsIntoTable(predictions);

    res.status(200).json({ message: 'Here are your betting predictions', predictions: tableData });

  } catch (error) {
    console.error('Error fetching betting predictions:', error);
    res.status(500).json({ error: 'Error fetching betting predictions' });
  }
});

// Route to handle payment for betting predictions (user needs to pay 20 Ksh)
router.post('/pay-for-predictions', async (req, res) => {
  const userId = req.user.id; // Assuming user ID is available after authentication

  try {
    // Process payment (assume paymentService returns a result object)
    const paymentResult = await processPayment(userId, 20); // Pay 20 Ksh

    if (paymentResult.success) {
      // If payment is successful, update the user's record to mark as paid
      await User.updatePaymentStatus(userId, true); // Assuming a method exists to update the user's payment status
      res.status(200).json({ message: 'Payment successful. You can now view the betting predictions.' });
    } else {
      res.status(400).json({ error: 'Payment failed. Please try again.' });
    }
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({ error: 'Error processing payment' });
  }
});

// Helper function to format the predictions into a table (3 columns, 21 rows)
function formatPredictionsIntoTable(predictions) {
  const table = [];
  const rows = 21; // We want 21 rows of predictions
  const columns = 3; // 3 columns per row

  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < columns; j++) {
      const prediction = predictions[i * columns + j];
      row.push(prediction ? prediction : 'No data'); // Handle cases where there aren't enough predictions
    }
    table.push(row);
  }

  return table;
}

module.exports = router;
