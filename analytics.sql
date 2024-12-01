-- Create a table to track user quiz attempts
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  section TEXT NOT NULL,
  score INTEGER NOT NULL,
  attempt_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  passed BOOLEAN NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users (id)
);

-- Create a table to store aggregate analytics data
CREATE TABLE IF NOT EXISTS analytics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  section TEXT NOT NULL,
  total_attempts INTEGER DEFAULT 0,
  total_passes INTEGER DEFAULT 0,
  total_failures INTEGER DEFAULT 0,
  last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
);
