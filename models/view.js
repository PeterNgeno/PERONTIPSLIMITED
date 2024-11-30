const db = require('../db'); // Import the SQLite database connection

// Create the 'views' table if it doesn't exist
const createViewTable = () => {
  db.run(`
    CREATE TABLE IF NOT EXISTS views (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      page TEXT NOT NULL,
      date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
    );
  `, (err) => {
    if (err) {
      console.error('Error creating views table:', err);
    } else {
      console.log('Views table created successfully');
    }
  });
};

// Add a new view to the database
const addView = (page) => {
  return new Promise((resolve, reject) => {
    const query = `INSERT INTO views (page) VALUES (?)`;
    db.run(query, [page], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(this.lastID); // Return the ID of the inserted view
      }
    });
  });
};

// Get all views (or you can add specific filters for page, etc.)
const getViews = () => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM views ORDER BY date DESC`;
    db.all(query, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows); // Return all views
      }
    });
  });
};

module.exports = { createViewTable, addView, getViews };
