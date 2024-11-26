// middleware/authMiddleware.js

const User = require('../models/User'); // Import the User model

async function isAdmin(req, res, next) {
  try {
    // Ensure the user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).send('Unauthorized');
    }

    // Fetch the user from the database
    const user = await User.findById(req.user.id);

    // Check if the user has the role of admin
    if (user && user.role === 'admin') {
      return next();
    } else {
      return res.status(403).send('Forbidden');
    }
  } catch (error) {
    console.error('Error checking admin status:', error);
    return res.status(500).send('Internal Server Error');
  }
}

module.exports = isAdmin;
