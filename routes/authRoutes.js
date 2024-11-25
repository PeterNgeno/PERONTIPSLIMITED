// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST route for signing up
router.post('/signup', authController.signup); 

module.exports = router;
