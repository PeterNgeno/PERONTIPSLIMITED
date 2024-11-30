const sqlite3 = require('sqlite3').verbose();

// Connect to SQLite database
const db = new sqlite3.Database('./peron_tips.db', (err) => {
  if (err) {
    console.error('SQLite connection error:', err.message);
  } else {
    console.log('Connected to SQLite database.');
  }
});

// Create the notifications table if it doesn't exist
db.run(`
  CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    message TEXT NOT NULL,
    user_id INTEGER NOT NULL,
    is_read BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )
`);

// Notification Model (functions for CRUD operations)
const Notification = {
  // Create a new notification
  create: (message, user_id, callback) => {
    const query = `
      INSERT INTO notifications (message, user_id) 
      VALUES (?, ?)
    `;
    db.run(query, [message, user_id], function (err) {
      if (err) return callback(err);
      callback(null, { id: this.lastID, message, user_id, is_read: false, created_at: new Date() });
    });
  },

  // Get all notifications for a user
  findByUserId: (user_id, callback) => {
    const query = `
      SELECT * FROM notifications 
      WHERE user_id = ? 
      ORDER BY created_at DESC
    `;
    db.all(query, [user_id], (err, rows) => {
      if (err) return callback(err);
      callback(null, rows);
    });
  },

  // Mark a notification as read
  markAsRead: (id, callback) => {
    const query = `
      UPDATE notifications 
      SET is_read = 1 
      WHERE id = ?
    `;
    db.run(query, [id], function (err) {
      if (err) return callback(err);
      callback(null, { id, is_read: true });
    });
  },

  // Delete a notification
  delete: (id, callback) => {
    const query = `
      DELETE FROM notifications 
      WHERE id = ?
    `;
    db.run(query, [id], function (err) {
      if (err) return callback(err);
      callback(null, { id });
    });
  },
};

// Export the Notification model
module.exports = Notification;
