const db = require('../db'); // Import the SQLite database connection

// Update Quiz
exports.updateQuiz = async (req, res) => {
  try {
    const { quizId, question, answer } = req.body;

    // Ensure required fields are provided
    if (!quizId || !question || !answer) {
      return res.status(400).json({ message: 'Quiz ID, question, and answer are required.' });
    }

    // Update the quiz in the database
    const query = `UPDATE quizzes SET question = ?, answer = ? WHERE id = ?`;
    db.run(query, [question, answer, quizId], function (err) {
      if (err) {
        return res.status(500).json({ message: 'Failed to update quiz.' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ message: 'Quiz not found.' });
      }

      res.json({ message: 'Quiz updated successfully.' });
    });
  } catch (error) {
    console.error('Error updating quiz:', error);
    res.status(500).json({ message: 'Failed to update quiz.' });
  }
};

// Update Betting Prediction
exports.updateBettingPrediction = async (req, res) => {
  try {
    const { predictionId, prediction, odds } = req.body;

    // Ensure required fields are provided
    if (!predictionId || !prediction || !odds) {
      return res.status(400).json({ message: 'Prediction ID, prediction, and odds are required.' });
    }

    // Update the betting prediction in the database
    const query = `UPDATE betting_predictions SET prediction = ?, odds = ? WHERE id = ?`;
    db.run(query, [prediction, odds, predictionId], function (err) {
      if (err) {
        return res.status(500).json({ message: 'Failed to update betting prediction.' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ message: 'Betting prediction not found.' });
      }

      res.json({ message: 'Betting prediction updated successfully.' });
    });
  } catch (error) {
    console.error('Error updating betting prediction:', error);
    res.status(500).json({ message: 'Failed to update betting prediction.' });
  }
};

// Update Product (for shop)
exports.updateProduct = async (req, res) => {
  try {
    const { productId, name, price, imageUrl } = req.body;

    // Ensure required fields are provided
    if (!productId || !name || !price) {
      return res.status(400).json({ message: 'Product ID, name, and price are required.' });
    }

    // Update the product in the database
    const query = `UPDATE products SET name = ?, price = ?, imageUrl = ? WHERE id = ?`;
    db.run(query, [name, price, imageUrl, productId], function (err) {
      if (err) {
        return res.status(500).json({ message: 'Failed to update product.' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ message: 'Product not found.' });
      }

      res.json({ message: 'Product updated successfully.' });
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Failed to update product.' });
  }
};
