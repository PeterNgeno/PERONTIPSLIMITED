const Quiz = require('../models/Quiz');
const Product = require('../models/Product');
const BettingPrediction = require('../models/BettingPrediction');

// Update Quiz
exports.updateQuiz = async (req, res) => {
  try {
    const { quizId, question, answer } = req.body;

    // Ensure required fields are provided
    if (!quizId || !question || !answer) {
      return res.status(400).json({ message: 'Quiz ID, question, and answer are required.' });
    }

    // Update the quiz
    const quiz = await Quiz.findByIdAndUpdate(
      quizId,
      { question, answer },
      { new: true, runValidators: true } // Return updated document and run validation
    );

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found.' });
    }

    res.json(quiz);
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

    // Update the betting prediction
    const predictionRecord = await BettingPrediction.findByIdAndUpdate(
      predictionId,
      { prediction, odds },
      { new: true, runValidators: true }
    );

    if (!predictionRecord) {
      return res.status(404).json({ message: 'Betting prediction not found.' });
    }

    res.json(predictionRecord);
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

    // Update the product
    const product = await Product.findByIdAndUpdate(
      productId,
      { name, price, imageUrl },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    res.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Failed to update product.' });
  }
};
