const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// SQLite Connection
const db = new sqlite3.Database('./peron_tips.db', (err) => {
  if (err) {
    console.error('Failed to connect to SQLite database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
  }
});

// Create tables if they don't exist
db.run(`CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price REAL NOT NULL
)`);

db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone_number TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL
)`);

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

// Quiz Route
app.get('/quiz', (req, res) => {
  res.json({ message: 'Quiz Section' });
});

// Betting Route
app.get('/betting', (req, res) => {
  res.json({ message: 'Welcome to the Betting Section' });
});

// Products Route
app.get('/products', (req, res) => {
  const query = `SELECT * FROM products`;
  db.all(query, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ message: 'Here are your products', products: rows });
    }
  });
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
