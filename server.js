const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect('mongodb+srv://peterkipsangngeno:Kipzz1945@atmymongodb.0qqao.mongodb.net/?retryWrites=true&w=majority&appName=AtmymongoDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Import Routes
const productRoutes = require('./routes/productRoutes'); // Shop
const quizRoutes = require('./routes/quizRoutes');       // Quiz
const bettingRoutes = require('./routes/bettingRoutes'); // Betting Predictions
const paymentRoutes = require('./routes/paymentRoutes'); // Payments

// Use Routes
app.use('/api/products', productRoutes);  // Products API
app.use('/api/quiz', quizRoutes);         // Quiz API
app.use('/api/betting', bettingRoutes);   // Betting Predictions API
app.use('/api/payments', paymentRoutes);  // Payment API

// Default Route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to PeronTipsLimited API' });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
