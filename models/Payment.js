const mongoose = require('mongoose');

// Define the Payment schema
const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming you have a 'User' model
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ['M-Pesa', 'Visa', 'MasterCard', 'Bank Transfer'], // List of supported payment methods
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Completed', 'Failed'], // Payment status
    required: true,
  },
  paymentDate: {
    type: Date,
    default: Date.now, // Timestamp for payment
  },
});

// Create the Payment model
const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
