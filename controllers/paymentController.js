const db = require('../db'); // SQLite database connection
const mpesa = require('../models/Payment'); // Assuming you have a helper for Mpesa STK push

// Process payment
exports.processPayment = async (req, res) => {
  const { userId, amount, section } = req.body;

  try {
    // Process payment via Mpesa
    const result = await mpesa.stkPush(userId, amount); // Assuming stkPush returns a promise

    // Insert payment record into the SQLite database
    const query = `INSERT INTO payments (userId, amount, section, status, paymentDate) VALUES (?, ?, ?, ?, ?)`;
    const params = [userId, amount, section, result.status, new Date()];

    db.run(query, params, function (err) {
      if (err) {
        console.error('Error saving payment to database:', err);
        return res.status(500).json({ error: 'Payment failed to be saved' });
      }

      // Return success response
      res.json({ success: true, message: 'Payment successful!' });
    });
  } catch (err) {
    console.error('Payment processing failed:', err);
    res.status(500).json({ error: 'Payment failed' });
  }
};
