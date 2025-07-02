// controllers/compilerController.js

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const Submission = require('../models/Submission');
const fileMap = require('../utils/fileMap');

// Controller to handle code execution requests
exports.runCode = async (req, res) => {
  const { code, language, input } = req.body;

  // Validate required fields
  if (!code || !language) {
    return res.status(400).json({ error: 'Code and language are required' });
  }

  // Get language-specific configuration
  const langConfig = fileMap[language.toLowerCase()];
  if (!langConfig) {
    return res.status(400).json({ error: 'Unsupported language' });
  }

  // Create or use existing temporary directory
  const tempDir = path.resolve(__dirname, '../temp');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
  }

  // Define filename based on language (Java and C# require specific names)
  const fileName =
    language === 'java'
      ? 'Main.java'
      : language === 'csharp'
      ? 'Program.cs'
      : `main_${Date.now()}.${langConfig.extension}`;

  const filePath = path.join(tempDir, fileName);

  // Write the submitted code to the temporary file
  fs.writeFileSync(filePath, code);

  // Prepare Docker command for secure execution with resource limits
  const runCommand = `echo "${input || ''}" | docker run --rm \
    -v ${tempDir}:/app \
    -w /app \
    --cpus="1" \
    --memory="512m" \
    --pids-limit=128 \
    --network=none \
    ${langConfig.image} sh -c "timeout 5s ${langConfig.run}"`;

  // Execute the Docker command
  exec(runCommand, async (err, stdout, stderr) => {
    // Remove the temp file after execution
    fs.unlink(filePath, () => {});

    // Clean up the entire temp directory for Java and C#
    if (language === 'java' || language === 'csharp') {
      fs.rm(tempDir, { recursive: true, force: true }, () => {});
    }

    // Create a submission record with input, code, and output
    const result = {
      code,
      language,
      input,
      output: stdout || stderr,
      userId: null // Can be enhanced with authentication
    };

    // Save the result to MongoDB
    try {
      await Submission.create(result);
    } catch (e) {
      console.error('MongoDB save error:', e.message);
    }

    // Return the output to the client
    res.json({ output: stdout || stderr });
  });
};

// Controller to fetch latest submissions
exports.getSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find()
      .sort({ createdAt: -1 })
      .limit(50); // Limit to latest 50 submissions
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
};
