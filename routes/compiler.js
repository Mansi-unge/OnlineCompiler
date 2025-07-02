// routes/compiler.js
// Defines API routes for the code compiler service

const express = require('express');
const { runCode, getSubmissions } = require('../controllers/compilerController');

const router = express.Router();

// Route to compile and run code
// Endpoint: POST /run
// Expects: { code, language, input (optional) }
// Returns: { output }
router.post('/run', runCode);

// Route to fetch recent submissions
// Endpoint: GET /submissions
// Returns: Array of last 50 submissions
router.get('/submissions', getSubmissions);

module.exports = router;
