const db = require('../db');  // Assuming db.js contains SQLite connection

// Service to create a payment record
function createPaymentService(userId, amount, paymentMethod, status) {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO payments (userId, amount, paymentMethod, status)
      VALUES (?, ?, ?, ?)
    `;
    db.run(query, [userId, amount, paymentMethod, status], function(err) {
      if (err) {
        reject(err);  // Reject with the error if something goes wrong
      } else {
        resolve({
          id: this.lastID,  // The ID of the newly created payment record
          userId,
          amount,
          paymentMethod,
          status
        });
      }
    });
  });
}

module.exports = {
  createPaymentService,
};
