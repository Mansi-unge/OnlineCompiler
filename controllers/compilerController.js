// controllers/compilerController.js
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const Submission = require('../models/Submission');
const fileMap = require('../utils/fileMap');

exports.runCode = async (req, res) => {
  const { code, language, input } = req.body;
  if (!code || !language) {
    return res.status(400).json({ error: 'Code and language are required' });
  }

  const langConfig = fileMap[language.toLowerCase()];
  if (!langConfig) return res.status(400).json({ error: 'Unsupported language' });

  const tempDir = path.resolve(__dirname, '../temp');
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

  const fileName =
    language === 'java'
      ? 'Main.java'
      : language === 'csharp'
      ? 'Program.cs'
      : `main_${Date.now()}.${langConfig.extension}`;

  const filePath = path.join(tempDir, fileName);
  fs.writeFileSync(filePath, code);

  const runCommand = `echo "${input || ''}" | docker run --rm \
    -v ${tempDir}:/app \
    -w /app \
    --cpus="1" \
    --memory="512m" \
    --pids-limit=128 \
    --network=none \
    ${langConfig.image} sh -c "timeout 5s ${langConfig.run}"`;

  exec(runCommand, async (err, stdout, stderr) => {
    fs.unlink(filePath, () => {});
    if (language === 'java' || language === 'csharp') {
      fs.rm(tempDir, { recursive: true, force: true }, () => {});
    }

    const result = { code, language, input, output: stdout || stderr, userId: null };
    try {
      await Submission.create(result);
    } catch (e) {
      console.error('❌ Mongo Save Error:', e.message);
    }

    res.json({ output: stdout || stderr });
  });
};

exports.getSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find().sort({ createdAt: -1 }).limit(50);
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
};
