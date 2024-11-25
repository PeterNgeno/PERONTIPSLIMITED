const Payment = require('../models/Payment');
const mpesa = require('../paymentService'); // Assume you have a helper for Mpesa STK push

exports.processPayment = (req, res) => {
  const { userId, amount, section } = req.body;

  // Process payment via Mpesa
  mpesa.stkPush(userId, amount, (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Payment failed' });
    } else {
      // Log payment
      Payment.logPayment({ userId, amount, section }, (err) => {
        if (err) res.status(500).json({ error: 'Error logging payment' });
        else res.json({ success: true, message: 'Payment successful!' });
      });
    }
  });
};
