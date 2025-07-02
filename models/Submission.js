// models/Submission.js
// This schema defines the structure of a code submission document stored in MongoDB

const mongoose = require('mongoose');

// Define the schema for storing code submissions
const submissionSchema = new mongoose.Schema({
  // The code written by the user
  code: {
    type: String,
    required: true,
  },

  // Programming language selected by the user (e.g., C++, Python)
  language: {
    type: String,
    required: true,
  },

  // Optional custom input provided by the user during execution
  input: {
    type: String,
  },

  // Output returned after running the code (stdout or stderr)
  output: {
    type: String,
  },

  // Optional reference to the user who submitted the code (for future auth integration)
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },

  // Timestamp when the submission was created
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Export the model so it can be used throughout the application
module.exports = mongoose.model('Submission', submissionSchema);
