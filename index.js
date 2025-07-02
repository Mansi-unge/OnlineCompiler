require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/db'); // 🆕 DB connection
const compilerRoutes = require('./routes/compiler');

const app = express();
const port = process.env.PORT || 3000;

// 📦 Connect DB
connectDB();

// 🧩 Middlewares
app.use(cors());
app.use(bodyParser.json());

// 🔀 Routes
app.use('/', compilerRoutes);

// 🌐 Health check route
app.get('/', (req, res) => {
  res.send('CrackIt.dev Compiler API is running!');
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
