const express = require('express');
const paymentController = require('../controllers/paymentController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/pay', authMiddleware, paymentController.processPayment);

module.exports = router;
