const db = require('../db');  // Assuming db.js contains SQLite connection

// Function to create a payment record
function createPayment(userId, amount, paymentMethod, status) {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO payments (userId, amount, paymentMethod, status)
      VALUES (?, ?, ?, ?)
    `;
    db.run(query, [userId, amount, paymentMethod, status], function(err) {
      if (err) {
        reject(err);  // Reject if there's an error during the insertion
      } else {
        resolve({
          id: this.lastID, // Return the ID of the newly inserted payment
          userId,
          amount,
          paymentMethod,
          status,
          paymentDate: new Date(), // Return the payment date as the current timestamp
        });
      }
    });
  });
}

// Function to get a payment record by ID
function getPaymentById(paymentId) {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM payments WHERE id = ?`;
    db.get(query, [paymentId], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

// Create the payment table if it doesn't exist
function createPaymentTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      amount REAL NOT NULL,
      paymentMethod TEXT NOT NULL CHECK(paymentMethod IN ('M-Pesa', 'Visa', 'MasterCard', 'Bank Transfer')),
      status TEXT NOT NULL CHECK(status IN ('Pending', 'Completed', 'Failed')),
      paymentDate DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `;
  db.run(query, (err) => {
    if (err) {
      console.error("Error creating payments table:", err);
    }
  });
}

module.exports = {
  createPayment,
  getPaymentById,
  createPaymentTable,
};
