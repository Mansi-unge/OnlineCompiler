// utils/fileMap.js
const fileMap = {
  python: { extension: 'py', image: 'python:3.10', run: 'python main.py' },
  c: { extension: 'c', image: 'gcc', run: 'gcc main.c -o main && ./main' },
  cpp: { extension: 'cpp', image: 'gcc', run: 'g++ main.cpp -o main && ./main' },
  java: { extension: 'java', image: 'openjdk', run: 'javac Main.java && java -Xmx256m Main' },
  node: { extension: 'js', image: 'node', run: 'node main.js' },
  go: { extension: 'go', image: 'golang', run: 'go run main.go' },
  ruby: { extension: 'rb', image: 'ruby', run: 'ruby main.rb' },
  php: { extension: 'php', image: 'php', run: 'php main.php' },
  bash: { extension: 'sh', image: 'bash', run: 'bash main.sh' },
  csharp: {
    extension: 'cs',
    image: 'mcr.microsoft.com/dotnet/sdk',
    run: 'dotnet new console -o app && mv Program.cs app/ && dotnet run --project app',
  },
};

module.exports = fileMap;
