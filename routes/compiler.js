// routes/compiler.js
const express = require('express');
const { runCode, getSubmissions } = require('../controllers/compilerController');

const router = express.Router();

router.post('/run', runCode);
router.get('/submissions', getSubmissions);

module.exports = router;
