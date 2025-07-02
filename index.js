// Load environment variables from .env file
require('dotenv').config();

// Import core dependencies
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Import custom modules
const connectDB = require('./config/db'); // MongoDB connection logic
const compilerRoutes = require('./routes/compiler'); // Compiler API routes

const app = express();
const port = process.env.PORT || 3000;

// 🔗 Connect to MongoDB
connectDB();

// 🧩 Register middlewares
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(bodyParser.json()); // Parse incoming JSON requests

// 🔀 Register routes
app.use('/', compilerRoutes); // All compiler-related routes

// 🌐 Health check route (optional for testing if API is live)
app.get('/', (req, res) => {
  res.send('🔥 CrackIt.dev Compiler API is running!');
});

// 🚀 Start the server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
