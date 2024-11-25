const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

// Database setup
const db = new sqlite3.Database('database.sqlite');

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Serve the index.html (Landing page)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Quiz Routes (For Admin and User)
app.get('/admin/quiz', (req, res) => {
  const section = req.query.section;
  
  // Fetch the quiz questions from the database based on the section
  db.all('SELECT * FROM quizzes WHERE section = ?', [section], (err, rows) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching questions' });
    }
    res.json({
      section,
      questions: rows.map(row => ({
        question: row.question,
        options: [row.option1, row.option2, row.option3],
        correctAnswer: row.correctAnswer
      }))
    });
  });
});

app.post('/admin/quiz', (req, res) => {
  const { section, questions } = req.body;

  questions.forEach(q => {
    // Insert or update each question in the database
    db.run(`INSERT INTO quizzes (section, question, option1, option2, option3, correctAnswer) VALUES (?, ?, ?, ?, ?, ?)`, 
    [section, q.question, q.options[0], q.options[1], q.options[2], q.correctAnswer], (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error saving questions' });
      }
    });
  });

  res.send('Questions updated successfully');
});

// User Submit Answers
app.post('/user/quiz/submit', (req, res) => {
  const { answers } = req.body;
  
  // Logic to check answers against correct answers in the database
  db.all('SELECT * FROM quizzes WHERE section = ?', ['A'], (err, rows) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching answers' });
    }

    const correctAnswers = rows.map(row => row.correctAnswer);
    let score = 0;

    answers.forEach((answer, index) => {
      if (answer === correctAnswers[index]) {
        score++;
      }
    });

    // Score and decision based on the score
    if (score === 10) {
      // Automatically proceed to payment if 100% score
      res.json({ success: true, message: 'You scored 100%! Please proceed to the payment page.' });
    } else {
      res.json({ success: false, message: `You scored ${score} out of 10. Please try again.` });
    }
  });
});

// Payment Routes
app.get('/payment', (req, res) => {
  // Logic to handle payment for quiz sections
  res.send('Payment Page');
});

// Serve the shop page
app.get('/shop', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'shop.html'));
});

// Product Search functionality (for shop page)
app.get('/products', (req, res) => {
  const searchQuery = req.query.search || '';
  const query = `SELECT * FROM products WHERE name LIKE ? OR description LIKE ?`;

  db.all(query, [`%${searchQuery}%`, `%${searchQuery}%`], (err, rows) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching products' });
    }
    res.json(rows);
  });
});

// Admin Routes for Managing Products
app.post('/admin/product', (req, res) => {
  const { name, price, description, imageUrl } = req.body;

  db.run('INSERT INTO products (name, price, description, imageUrl) VALUES (?, ?, ?, ?)', 
  [name, price, description, imageUrl], (err) => {
    if (err) {
      return res.status(500).json({ message: 'Error adding product' });
    }
    res.send('Product added successfully');
  });
});

app.put('/admin/product', (req, res) => {
  const { id, name, price, description, imageUrl } = req.body;

  db.run('UPDATE products SET name = ?, price = ?, description = ?, imageUrl = ? WHERE id = ?',
  [name, price, description, imageUrl, id], (err) => {
    if (err) {
      return res.status(500).json({ message: 'Error updating product' });
    }
    res.send('Product updated successfully');
  });
});

// Static Files
app.use(express.static(path.join(__dirname, 'public')));

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
