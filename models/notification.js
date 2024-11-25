const db = require('../db'); // Import your database connection

const createNotificationTable = () => {
  db.run(`
    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      message TEXT,
      user_id INTEGER,
      is_read BOOLEAN DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
};

// Save a new notification
const createNotification = (userId, message) => {
  return new Promise((resolve, reject) => {
    const query = `INSERT INTO notifications (user_id, message) VALUES (?, ?)`;
    db.run(query, [userId, message], function (err) {
      if (err) reject(err);
      resolve(this.lastID);
    });
  });
};

// Get all notifications for a user
const getNotificationsByUser = (userId) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC`;
    db.all(query, [userId], (err, rows) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
};

// Mark a notification as read
const markNotificationAsRead = (notificationId) => {
  return new Promise((resolve, reject) => {
    const query = `UPDATE notifications SET is_read = 1 WHERE id = ?`;
    db.run(query, [notificationId], (err) => {
      if (err) reject(err);
      resolve(true);
    });
  });
};

module.exports = { createNotificationTable, createNotification, getNotificationsByUser, markNotificationAsRead };
