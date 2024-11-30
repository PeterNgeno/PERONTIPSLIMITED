const express = require('express');
const paymentController = require('../controllers/paymentController');
const authMiddleware = require('../middleware/authMiddleware');
const { db, User } = require('../db'); // Assuming User model is in db.js

const router = express.Router();

/**
 * POST /pay
 * This route processes payment and grants access to the quiz or shop section.
 */
router.post('/pay', authMiddleware, async (req, res) => {
  const userId = req.user.id; // Assuming user ID is available after authentication
  const { accessType, productId } = req.body; // accessType could be 'quiz' or 'shop'

  try {
    // Check if the user exists in SQLite
    const user = await getUserById(userId);

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
      await updatePaymentStatus(userId, true); // Update payment status

      // After payment, grant access based on the accessType ('quiz' or 'shop')
      if (accessType === 'quiz') {
        return res.status(200).json({ message: 'Payment processed successfully, you now have access to the quiz.' });
      } else if (accessType === 'shop' && productId) {
        // If 'shop' is chosen, handle product purchase
        const product = await getProductById(productId);
        if (product) {
          return res.status(200).json({ message: 'Payment successful, product purchased!', product });
        } else {
          return res.status(404).json({ error: 'Product not found' });
        }
      } else {
        return res.status(400).json({ error: 'Invalid access type' });
      }

    } else {
      res.status(400).json({ error: 'Payment failed, please try again' });
    }
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({ error: 'Error processing payment' });
  }
});

/**
 * Helper function to get user by ID from SQLite
 */
const getUserById = (id) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM users WHERE id = ?`;
    db.get(query, [id], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

/**
 * Helper function to update user's payment status in SQLite
 */
const updatePaymentStatus = (id, hasPaid) => {
  return new Promise((resolve, reject) => {
    const query = `UPDATE users SET hasPaid = ? WHERE id = ?`;
    db.run(query, [hasPaid, id], (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

/**
 * Helper function to get product details by ID from SQLite
 */
const getProductById = (productId) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM products WHERE id = ?`;
    db.get(query, [productId], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

module.exports = router;
