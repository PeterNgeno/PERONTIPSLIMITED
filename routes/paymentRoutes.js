const express = require('express');
const paymentController = require('../controllers/paymentController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * POST /pay
 * This route processes payment after checking the user's authentication.
 */
router.post('/pay', authMiddleware, async (req, res) => {
  try {
    // Call the payment processing function in the controller
    const result = await paymentController.processPayment(req.user, req.body);

    // Return success response
    res.status(200).json({ message: 'Payment processed successfully', result });
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({ error: 'Error processing payment' });
  }
});

module.exports = router;
