const express = require('express');
const paymentController = require('../controllers/paymentController');
const authMiddleware = require('../middleware/authMiddleware');
const { User } = require('../db'); // Assuming User model is in db.js

const router = express.Router();

/**
 * POST /pay
 * This route processes payment after checking the user's authentication.
 */
router.post('/pay', authMiddleware, async (req, res) => {
  const userId = req.user.id; // Assuming user ID is available after authentication

  try {
    // Check if the user exists in SQLite
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the user has already paid
    if (user.hasPaid) {
      return res.status(400).json({ error: 'Payment already processed' });
    }

    // Call the payment processing function from the controller
    const result = await paymentController.processPayment(user, req.body);

    // If payment is successful, update the user's payment status in SQLite
    if (result.success) {
      await User.updatePaymentStatus(userId, true); // Update payment status
      res.status(200).json({ message: 'Payment processed successfully', result });
    } else {
      res.status(400).json({ error: 'Payment failed, please try again' });
    }
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({ error: 'Error processing payment' });
  }
});

module.exports = router;
