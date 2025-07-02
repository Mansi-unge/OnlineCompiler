// utils/fileMap.js
// Maps supported programming languages to their file extensions, Docker images, and execution commands

const fileMap = {
  python: {
    extension: 'py',
    image: 'python:3.10',
    run: 'python main.py' // Runs the Python file
  },
  c: {
    extension: 'c',
    image: 'gcc',
    run: 'gcc main.c -o main && ./main' // Compiles C code and runs the binary
  },
  cpp: {
    extension: 'cpp',
    image: 'gcc',
    run: 'g++ main.cpp -o main && ./main' // Compiles C++ code and runs the binary
  },
  java: {
    extension: 'java',
    image: 'openjdk',
    run: 'javac Main.java && java -Xmx256m Main' // Compiles and runs Java with memory limit
  },
  node: {
    extension: 'js',
    image: 'node',
    run: 'node main.js' // Runs JavaScript using Node.js
  },
  go: {
    extension: 'go',
    image: 'golang',
    run: 'go run main.go' // Compiles and runs Go code
  },
  ruby: {
    extension: 'rb',
    image: 'ruby',
    run: 'ruby main.rb' // Runs Ruby script
  },
  php: {
    extension: 'php',
    image: 'php',
    run: 'php main.php' // Runs PHP script
  },
  bash: {
    extension: 'sh',
    image: 'bash',
    run: 'bash main.sh' // Executes Bash shell script
  },
  csharp: {
    extension: 'cs',
    image: 'mcr.microsoft.com/dotnet/sdk',
    run: 'dotnet new console -o app && mv Program.cs app/ && dotnet run --project app'
    // Creates new .NET console app, moves code in, then runs it
  },
};

module.exports = fileMap;
