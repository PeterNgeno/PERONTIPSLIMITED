const mongoose = require('mongoose');

// Define the User Schema
const UserSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  sectionProgress: { 
    type: Map, 
    of: Number, 
    default: {} 
  }, // Tracks sections completed in the quiz
  score: { 
    type: Number, 
    default: 0 
  }, // Stores user's total score
  paymentHistory: { 
    type: Array, 
    default: [] 
  }, // Stores payments made by the user
  lastPaymentDate: { 
    type: Date, 
    default: null 
  }
});

// Create the User Model
const User = mongoose.model('User', UserSchema);

// Example of creating a user
async function createUser(username, password, email) {
  const newUser = new User({ username, password, email });
  return await newUser.save();
}

// Example of updating user's quiz progress after they complete a section
async function updateUserProgress(userId, section, score) {
  const user = await User.findById(userId);
  if (user) {
    user.sectionProgress.set(section, score);
    await user.save();
    return user;
  } else {
    throw new Error('User not found');
  }
}

module.exports = {
  User,
  createUser,
  updateUserProgress
};
