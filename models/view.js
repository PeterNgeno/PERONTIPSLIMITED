const mongoose = require('mongoose');

const ViewSchema = new mongoose.Schema({
  page: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model('View', ViewSchema);
