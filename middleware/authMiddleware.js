// middleware/authMiddleware.js

function isAdmin(req, res, next) {
  if (req.user && req.user.role === 'admin') {
    return next();
  } else {
    res.status(403).send('Forbidden');
  }
}

module.exports = isAdmin;
