// middleware/notificationLogger.js

const Notification = require('../models/Notification'); // Import Notification model

// Middleware to log a notification for a user (e.g., when they log in)
module.exports = async (req, res, next) => {
  if (req.user) { // If user is logged in
    try {
      // Create a new notification in the database
      await Notification.create({
        userId: req.user.id,
        message: 'New login event.',
        createdAt: new Date(),
      });
    } catch (err) {
      console.error('Error logging notification:', err);
    }
  }
  next();
};
