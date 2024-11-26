const express = require('express');
const quizController = require('../controllers/quizController');
const paymentController = require('../controllers/paymentController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Route to get the quiz page
router.get('/', authMiddleware, async (req, res) => {
    try {
        const quiz = await quizController.getQuizPage(req.user.id); // Assuming user ID is stored in `req.user`
        res.status(200).json(quiz);
    } catch (error) {
        console.error('Error fetching quiz page:', error);
        res.status(500).json({ error: 'Failed to load quiz page' });
    }
});

// Route to submit the quiz
router.post('/submit', authMiddleware, async (req, res) => {
    try {
        const { answers } = req.body;
        const result = await quizController.submitQuiz(req.user.id, answers);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error submitting quiz:', error);
        res.status(500).json({ error: 'Failed to submit quiz' });
    }
});

// Route to process payment for quiz access
router.post('/pay', authMiddleware, async (req, res) => {
    try {
        const paymentResult = await paymentController.processPayment(req.user.id);
        res.status(200).json(paymentResult);
    } catch (error) {
        console.error('Error processing payment:', error);
        res.status(500).json({ error: 'Payment failed' });
    }
});

module.exports = router;
