const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  code: { type: String, required: true },
  language: { type: String, required: true },
  input: { type: String },
  output: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // optional
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Submission', submissionSchema);


