const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

// Database setup
const db = new sqlite3.Database('./database.sqlite');

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Home Route
app.get('/', (req, res) => {
  res.send('Welcome to Peron Tips Limited');
});

// Route for Betting Predictions Page
app.get('/betting/predictions', (req, res) => {
  // In a real application, you would check if the user has paid before serving predictions.
  // For this example, we assume the user has already paid.

  // Fetch 21 betting predictions from the database
  db.all('SELECT * FROM betting_predictions LIMIT 21', (err, rows) => {
    if (err) {
      console.error("Error fetching betting predictions:", err);
      return res.status(500).send('Error fetching betting predictions');
    }

    // Return predictions in JSON format
    res.json({ predictions: rows });
  });
});

// Route for making payment before viewing predictions
app.post('/betting/predictions/payment', (req, res) => {
  const { userId, amount } = req.body;

  // Simulating payment processing
  if (amount === 20) { // Assuming successful payment of Ksh 20
    console.log(`User ${userId} has successfully paid Ksh ${amount}`);
    return res.json({ success: true });
  } else {
    return res.status(400).json({ success: false, message: 'Invalid payment amount' });
  }
});

// Route for quiz page with timers
app.get('/quiz', (req, res) => {
  // Here, we send the quiz and the timer configurations for each section
  res.json({
    sections: [
      { section: 'A', timer: 30, price: 50 },  // 50 Ksh = 30 seconds
      { section: 'B', timer: 45, price: 100 }, // 100 Ksh = 45 seconds
      { section: 'C', timer: 50, price: 200 }, // 200 Ksh = 50 seconds
      { section: 'D', timer: 65, price: 400 }  // 400 Ksh = 65 seconds
    ]
  });
});

// Handle form submission for quiz (saving quiz answers, etc.)
app.post('/quiz/submit', (req, res) => {
  const { answers, section, userId } = req.body;

  // Logic to check answers, calculate scores, etc.
  // For now, simulate a success response
  const score = 100; // Simulated score (this should be calculated based on answers)

  if (score === 100) {
    console.log(`User ${userId} passed section ${section} with 100%`);
    return res.json({ success: true, message: 'You passed with 100%. Please proceed to the next section.' });
  } else {
    console.log(`User ${userId} failed section ${section}`);
    return res.json({ success: false, message: 'Please pay and try again for this section.' });
  }
});

// Route for the shop page
app.get('/shop', (req, res) => {
  // Fetch all products from the database
  db.all('SELECT * FROM products', (err, rows) => {
    if (err) {
      console.error("Error fetching products:", err);
      return res.status(500).send('Error fetching products');
    }

    // Return products as JSON
    res.json({ products: rows });
  });
});

// Route for purchasing products
app.post('/shop/purchase', (req, res) => {
  const { userId, productId, amount } = req.body;

  // Logic for payment and purchase
  if (amount >= 0) { // Check for valid payment amount
    console.log(`User ${userId} successfully purchased product ${productId} for Ksh ${amount}`);
    return res.json({ success: true });
  } else {
    return res.status(400).json({ success: false, message: 'Invalid purchase request' });
  }
});

// Route for admin to view and add products
app.get('/admin/products', (req, res) => {
  // Fetch products for admin view
  db.all('SELECT * FROM products', (err, rows) => {
    if (err) {
      console.error("Error fetching products for admin:", err);
      return res.status(500).send('Error fetching products');
    }

    res.json({ products: rows });
  });
});

// Admin route to update or add new products
app.post('/admin/products', (req, res) => {
  const { name, price, description, imageUrl } = req.body;

  // SQL query to insert the new product into the database
  const query = `INSERT INTO products (name, price, description, imageUrl) VALUES (?, ?, ?, ?)`;

  db.run(query, [name, price, description, imageUrl], function (err) {
    if (err) {
      console.error("Error adding product:", err);
      return res.status(500).send('Error adding product');
    }

    res.json({ success: true, message: 'Product added successfully' });
  });
});

// Route for serving predictions page to the user after payment
app.post('/user/betting/predictions', (req, res) => {
  const { userId, amount } = req.body;

  // Process payment before showing predictions (Ksh 20 is required)
  if (amount === 20) {
    console.log(`User ${userId} successfully paid Ksh 20 for predictions`);

    // Fetch 21 predictions after payment is confirmed
    db.all('SELECT * FROM betting_predictions LIMIT 21', (err, rows) => {
      if (err) {
        console.error("Error fetching betting predictions:", err);
        return res.status(500).send('Error fetching betting predictions');
      }

      // Send the predictions back to the user
      res.json({ predictions: rows });
    });
  } else {
    return res.status(400).json({ success: false, message: 'Invalid payment amount. Please pay Ksh 20.' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});