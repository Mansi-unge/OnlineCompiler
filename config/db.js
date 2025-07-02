// config/db.js
// This file handles the MongoDB connection setup using Mongoose

const mongoose = require('mongoose');

// Async function to connect to MongoDB
const connectDB = async () => {
  try {
    // Attempt to connect using the URI from environment variables
    await mongoose.connect(process.env.MONGO_URI);

    // Log success message
    console.log('MongoDB connected');
  } catch (err) {
    //  Log connection errors and exit the process
    console.error('MongoDB connection error:', err.message);
    process.exit(1); // Exit with failure
  }
};

// Export the function so it can be used in index.js
module.exports = connectDB;
