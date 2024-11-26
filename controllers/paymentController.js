const Payment = require('../models/Payment');
const mpesa = require('../paymentService'); // Assuming you have a helper for Mpesa STK push

exports.processPayment = async (req, res) => {
  const { userId, amount, section } = req.body;

  try {
    // Process payment via Mpesa
    const result = await mpesa.stkPush(userId, amount); // Assuming stkPush returns a promise

    // Log payment to MongoDB
    const newPayment = new Payment({
      userId,
      amount,
      section,
      status: result.status, // Assuming result has a 'status' field indicating success or failure
      paymentDate: new Date(),
    });

    await newPayment.save(); // Save payment record to MongoDB

    res.json({ success: true, message: 'Payment successful!' });
  } catch (err) {
    console.error('Payment processing failed:', err);
    res.status(500).json({ error: 'Payment failed' });
  }
};
