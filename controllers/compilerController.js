const fs = require('fs');
const path = require('path');
const os = require('os');
const { exec } = require('child_process');
const Submission = require('../models/Submission');
const fileMap = require('../utils/fileMap');

exports.runCode = async (req, res) => {
  try {
    let { code, language, input } = req.body;

    if (!code || !language) {
      return res.status(400).json({ error: 'Code and language are required' });
    }

    const langConfig = fileMap[language.toLowerCase()];
    if (!langConfig) {
      return res.status(400).json({ error: 'Unsupported language' });
    }

    // ✅ Auto-fix unsafe stdin handling for Node.js
    if (
      language.toLowerCase() === 'node' &&
      code.includes("stdin.on('data'")
    ) {
      code = `
        process.stdin.resume();
        process.stdin.setEncoding('utf8');
        let input = '';
        process.stdin.on('data', function(chunk) { input += chunk; });
        process.stdin.on('end', function() {
          console.log('You said: ' + input.trim());
        });
      `;
    }

    const tempDir = path.resolve(__dirname, '../temp');
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

    const fileName =
      language === 'java' ? 'Main.java' :
      language === 'csharp' ? 'Program.cs' :
      `main.${langConfig.extension}`;

    const filePath = path.join(tempDir, fileName);
    fs.writeFileSync(filePath, code, { encoding: 'utf-8' });

    // ✅ Convert path for Docker (Windows compatibility)
    let dockerPath = tempDir;
    if (os.platform() === 'win32') {
      dockerPath = dockerPath.replace(/\\/g, '/').replace(/^([A-Za-z]):/, (_, d) => `/${d.toLowerCase()}`);
    }

    const runCommand = `echo "${input || ''}" | docker run --rm \
      -v ${dockerPath}:/app \
      -w /app \
      --cpus="1" \
      --memory="512m" \
      --pids-limit=128 \
      --network=none \
      ${langConfig.image} sh -c "timeout 5s ${langConfig.run}"`;

    console.log('[RunCommand]', runCommand);
    console.log('[FileWritten]', filePath, 'Exists:', fs.existsSync(filePath));

    // ✅ Execute Docker safely
    exec(runCommand, async (err, stdout, stderr) => {
      console.log('[Docker Execution Complete]');

      // Clean up files
      try {
        fs.unlinkSync(filePath);
        const files = fs.readdirSync(tempDir);
        files.forEach(file => {
          if (file !== '.gitkeep') {
            fs.unlinkSync(path.join(tempDir, file));
          }
        });
      } catch (cleanupErr) {
        console.error('[Cleanup Error]', cleanupErr.message);
      }

      const output = stdout || stderr || 'No output';

      // Save submission
      try {
        await Submission.create({
          code,
          language,
          input,
          output,
          userId: null,
        });
      } catch (dbErr) {
        console.error('MongoDB save error:', dbErr.message);
      }

      if (err) {
        console.error('[Execution Error]', err.message);
        return res.status(500).json({ error: 'Execution failed', details: output });
      }

      return res.json({ output });
    });
  } catch (e) {
    console.error('[Fatal Error]', e.message);
    return res.status(500).json({ error: 'Server crashed', details: e.message });
  }
};


// Fetch latest submissions
exports.getSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find().sort({ createdAt: -1 }).limit(50);
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
};
