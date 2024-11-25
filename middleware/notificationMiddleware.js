const Notification = require('../models/Notification');

// Middleware to log a notification for a user (for example, when they log in)
module.exports = async (req, res, next) => {
  if (req.user) { // If user is logged in
    try {
      await Notification.createNotification(req.user.id, 'New login event.');
    } catch (err) {
      console.error('Error logging notification:', err);
    }
  }
  next();
};
