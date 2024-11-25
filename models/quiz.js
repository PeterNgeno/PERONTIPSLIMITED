// models/Quiz.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db'); // Sequelize instance

const Quiz = sequelize.define('Quiz', {
  section: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Ensure that each section (A, B, etc.) is unique
  },
  questions: {
    type: DataTypes.JSONB, // Store questions and answers as JSON
    allowNull: false,
  }
});

module.exports = Quiz;
