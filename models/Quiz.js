const db = require('../db');

// Function to create a new quiz question
module.exports = {
  // Function to add a quiz question to the database
  addQuiz: (quiz, callback) => {
    const sql = `INSERT INTO Quizzes (question, options, answer) VALUES (?, ?, ?)`;
    db.run(sql, [quiz.question, JSON.stringify(quiz.options), quiz.answer], function (err) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, { id: this.lastID, ...quiz }); // Return inserted quiz with id
      }
    });
  },

  // Function to get all quiz questions
  getQuizzes: (callback) => {
    const sql = `SELECT * FROM Quizzes`;
    db.all(sql, [], (err, rows) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, rows); // Return all quizzes
      }
    });
  },

  // Function to get a specific quiz by ID
  getQuizById: (quizId, callback) => {
    const sql = `SELECT * FROM Quizzes WHERE id = ?`;
    db.get(sql, [quizId], (err, row) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, row); // Return the specific quiz
      }
    });
  },

  // Function to update an existing quiz
  updateQuiz: (quizId, updatedQuiz, callback) => {
    const sql = `UPDATE Quizzes SET question = ?, options = ?, answer = ? WHERE id = ?`;
    db.run(sql, [updatedQuiz.question, JSON.stringify(updatedQuiz.options), updatedQuiz.answer, quizId], function (err) {
      if (err) {
        callback(err, null);
      } else if (this.changes === 0) {
        callback(null, null); // No quiz was updated
      } else {
        callback(null, { id: quizId, ...updatedQuiz });
      }
    });
  },

  // Function to delete a quiz by ID
  deleteQuiz: (quizId, callback) => {
    const sql = `DELETE FROM Quizzes WHERE id = ?`;
    db.run(sql, [quizId], function (err) {
      if (err) {
        callback(err, null);
      } else if (this.changes === 0) {
        callback(null, null); // No quiz was deleted
      } else {
        callback(null, { message: 'Quiz deleted successfully' });
      }
    });
  }
};
