const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite:database.sqlite');

const User = sequelize.define('User', {
  username: { type: DataTypes.STRING, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
  sectionProgress: { type: DataTypes.JSON, defaultValue: {} }, // Tracks sections completed in the quiz
  score: { type: DataTypes.INTEGER, defaultValue: 0 },  // Stores user's total score
  paymentHistory: { type: DataTypes.JSON, defaultValue: [] },  // Store payments made by the user
  lastPaymentDate: { type: DataTypes.DATE, allowNull: true }
});

// Example of creating a user or updating a user's progress
async function createUser(username, password, email) {
  return await User.create({ username, password, email });
}

// Example of updating user's quiz progress after they complete a section
async function updateUserProgress(userId, section, score) {
  const user = await User.findByPk(userId);
  user.sectionProgress[section] = score;
  await user.save();
}

module.exports = User;
