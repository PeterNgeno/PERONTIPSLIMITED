const VisitorStats = require('../models/VisitorStats'); // Import the MongoDB model for VisitorStats

module.exports = async (req, res, next) => {
  try {
    // Insert a new visitor stat record
    await VisitorStats.create({
      path: req.path,
      visitedAt: new Date(), // Use the current timestamp
    });
  } catch (err) {
    console.error('Error logging visitor stats:', err.message);
  }
  next();
};
