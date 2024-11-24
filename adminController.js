const Quiz = require('../models/Quiz');
const Product = require('../models/Product');
const BettingPrediction = require('../models/BettingPrediction');

// Update Quiz
exports.updateQuiz = async (req, res) => {
  try {
    const { quizId, question, answer } = req.body;
    const quiz = await Quiz.findByIdAndUpdate(quizId, { question, answer }, { new: true });
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update quiz.' });
  }
};

// Update Betting Prediction
exports.updateBettingPrediction = async (req, res) => {
  try {
    const { predictionId, prediction, odds } = req.body;
    const predictionRecord = await BettingPrediction.findByIdAndUpdate(predictionId, { prediction, odds }, { new: true });
    res.json(predictionRecord);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update betting prediction.' });
  }
};

// Update Product (for shop)
exports.updateProduct = async (req, res) => {
  try {
    const { productId, name, price, imageUrl } = req.body;
    const product = await Product.findByIdAndUpdate(productId, { name, price, imageUrl }, { new: true });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update product.' });
  }
};