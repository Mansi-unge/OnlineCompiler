const fileMap = {
  c: {
    extension: 'c',
    image: 'gcc:latest',
    run: 'gcc main.c -o main && ./main'
  },
  cpp: {
    extension: 'cpp',
    image: 'gcc:latest',
    run: 'g++ main.cpp -o main && ./main'
  },
  python: {
    extension: 'py',
    image: 'python:3.10',
    run: 'python main.py'
  },
  java: {
    extension: 'java',
    image: 'openjdk:17',
    run: 'javac Main.java && java -Xmx256m Main'
  },
  node: {
    extension: 'js',
    image: 'node:18',
    run: 'node main.js'
  },
  go: {
    extension: 'go',
    image: 'golang:1.20',
    run: 'go run main.go'
  },
  ruby: {
    extension: 'rb',
    image: 'ruby:3.2',
    run: 'ruby main.rb'
  },
  php: {
    extension: 'php',
    image: 'php:8.2',
    run: 'php main.php'
  },
  bash: {
    extension: 'sh',
    image: 'bash:latest',
    run: 'bash main.sh'
  },
  csharp: {
    extension: 'cs',
    image: 'mcr.microsoft.com/dotnet/sdk:7.0',
    run: 'dotnet new console -o app && mv Program.cs app/ && dotnet run --project app'
  },
};

module.exports = fileMap;
