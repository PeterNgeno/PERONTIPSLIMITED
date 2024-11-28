const Payment = require('../models/Payment');

// Service to create a payment record
function createPaymentService(userId, amount, paymentMethod, status) {
  const newPayment = new Payment({
    userId,
    amount,
    paymentMethod,
    status,
  });

  return newPayment.save();
}

module.exports = {
  createPaymentService,
};
