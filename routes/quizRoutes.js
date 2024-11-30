const express = require('express');
const quizController = require('../controllers/quizController');
const paymentController = require('../controllers/paymentController');
const authMiddleware = require('../middleware/authMiddleware');
const db = require('../db');  // Assuming db.js contains SQLite connection

const router = express.Router();

// Route to get the quiz page
router.get('/', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id; // Get user ID from authentication middleware

        // Fetch quiz details from the database
        const quiz = await quizController.getQuizPage(userId);
        if (!quiz) {
            return res.status(404).json({ error: 'Quiz not found' });
        }
        res.status(200).json(quiz);
    } catch (error) {
        console.error('Error fetching quiz page:', error);
        res.status(500).json({ error: 'Failed to load quiz page' });
    }
});

// Route to submit the quiz
router.post('/submit', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id; // Get user ID from authentication middleware
        const { answers } = req.body; // Get the submitted answers

        // Process the quiz submission
        const result = await quizController.submitQuiz(userId, answers);
        if (!result) {
            return res.status(400).json({ error: 'Error submitting quiz' });
        }

        res.status(200).json(result);
    } catch (error) {
        console.error('Error submitting quiz:', error);
        res.status(500).json({ error: 'Failed to submit quiz' });
    }
});

// Route to process payment for quiz access
router.post('/pay', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id; // Get user ID from authentication middleware

        // Check if the user has already paid using SQLite
        const paymentStatus = await paymentController.checkPaymentStatus(userId);
        if (paymentStatus.hasPaid) {
            return res.status(400).json({ error: 'You have already paid for the quiz' });
        }

        // Process the payment
        const paymentResult = await paymentController.processPayment(userId);
        if (paymentResult.success) {
            // Update the user's payment status in SQLite
            await paymentController.updatePaymentStatus(userId, true);
            res.status(200).json({ message: 'Payment processed successfully', paymentResult });
        } else {
            res.status(400).json({ error: 'Payment failed, please try again' });
        }
    } catch (error) {
        console.error('Error processing payment:', error);
        res.status(500).json({ error: 'Payment failed' });
    }
});

module.exports = router;
