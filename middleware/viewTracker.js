const db = require('../db');

module.exports = (req, res, next) => {
  const sql = `INSERT INTO VisitorStats (path, visitedAt) VALUES (?, CURRENT_TIMESTAMP)`;
  db.run(sql, [req.path], (err) => {
    if (err) console.error(err.message);
  });
  next();
};
