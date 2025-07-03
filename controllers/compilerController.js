const fs = require('fs');
const path = require('path');
const os = require('os');
const { exec } = require('child_process');
const Submission = require('../models/Submission');
const fileMap = require('../utils/fileMap');

exports.runCode = async (req, res) => {
  const { code, language, input } = req.body;

  if (!code || !language) {
    return res.status(400).json({ error: 'Code and language are required' });
  }

  const langConfig = fileMap[language.toLowerCase()];
  if (!langConfig) {
    return res.status(400).json({ error: 'Unsupported language' });
  }

  const tempDir = path.resolve(__dirname, '../temp');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
  }

  const fileName =
    language === 'java' ? 'Main.java'
    : language === 'csharp' ? 'Program.cs'
    : `main.${langConfig.extension}`;

  const filePath = path.join(tempDir, fileName);
  fs.writeFileSync(filePath, code);

  let dockerPath = tempDir;
  if (os.platform() === 'win32') {
    dockerPath = dockerPath.replace(/\\/g, '/').replace(/^([A-Za-z]):/, (_, d) => `/${d.toLowerCase()}`);
  }

  const runCommand = `docker run --rm -i \
    -v ${dockerPath}:/app \
    -w /app \
    --cpus="1" \
    --memory="512m" \
    --pids-limit=128 \
    --network=none \
    ${langConfig.image} sh -c "timeout 5s ${langConfig.run}"`;

  console.log('[RunCommand]', runCommand);

  const dockerProcess = exec(runCommand, async (err, stdout, stderr) => {
    fs.unlink(filePath, () => {});
    fs.readdir(tempDir, (err, files) => {
      if (!err) {
        files.forEach(file => {
          if (file !== '.gitkeep') {
            fs.unlink(path.join(tempDir, file), () => {});
          }
        });
      }
    });

    const result = {
      code,
      language,
      input,
      output: stdout || stderr,
      userId: null
    };

    try {
      await Submission.create(result);
    } catch (e) {
      console.error('MongoDB save error:', e.message);
    }

    res.json({ output: stdout || stderr });
  });

  if (input) {
    dockerProcess.stdin.write(input);
  }
  dockerProcess.stdin.end();
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
