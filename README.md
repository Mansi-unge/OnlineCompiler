# 🚀 CrackIt.dev - Online Code Compiler API (Judge0 Alternative)

A powerful, self-hosted **multi-language online compiler API** built with **Node.js**, **Docker**, and **MongoDB**.  
This is a scalable alternative to Judge0 that lets you compile and run code in real-time inside secure Docker containers.

---

## 📦 Tech Stack

| Layer         | Tech Used                                |
|--------------|-------------------------------------------|
| Backend       | Node.js, Express.js                      |
| Containerization | Docker                                |
| Database       | MongoDB (Mongoose ODM)                  |
| Runtime        | Official Docker images for each language|
| Dev Tools      | Nodemon, dotenv, Postman                |

---

## ✨ Features

| Feature                        | Description                                                                  |
|-------------------------------|------------------------------------------------------------------------------|
| ✅ Multi-language support      | Supports Python, C, C++, Java, Node.js, Go, PHP, Bash, Ruby, C#              |
| ✅ Docker sandbox execution    | Executes each code in an isolated Docker container for security              |
| ✅ Input support               | Accepts standard input from users                                            |
| ✅ Output/Error handling       | Returns the correct output or error message                                  |
| ✅ MongoDB submission logging  | Stores all submissions in MongoDB with timestamp                            |
| ✅ Self-hosted freedom         | No rate limits, no dependency on external APIs like Judge0                   |
| ✅ Modular project structure   | Clean, organized, and scalable folder structure                              |

---

## ⚖️ Judge0 vs Custom Compiler

| Feature               | Judge0 API                      | This Compiler (Custom Built)          |
|----------------------|----------------------------------|---------------------------------------|
| Hosted / Self-hosted | Public API (external)           | Fully self-hosted                     |
| Input support        | ✅ Yes                           | ✅ Yes                                |
| Language support     | ✅ Wide                          | ✅ Most major languages               |
| Docker isolation     | ✅ Yes                           | ✅ Yes                                |
| Code storage         | ❌ No built-in logging           | ✅ MongoDB storage                    |
| Offline usage        | ❌ Requires internet             | ✅ Works offline                      |
| Extensibility        | ❌ Limited                       | ✅ Fully customizable                 |

---

## 🧠 Project Architecture

NODE_DOCKER_COMPILER/
├── config/ # MongoDB connection config
├── controllers/ # Compiler logic (run & get submissions)
├── models/ # Mongoose schema for submissions
├── routes/ # API endpoints
├── utils/ # Language config and file map
├── temp/ # Temp folder for code execution
├── .env # Environment variables
├── .gitignore
├── index.js # Server entry point
├── package.json


---

## 🔧 How It Works

1. The `/run` API receives code, language, and optional input.
2. A temporary file is created for the code.
3. A Docker container spins up with a limited memory & CPU.
4. The code runs inside the container and returns output or error.
5. The result is saved in MongoDB and returned to the user.

---

---

## ⚙️ Supported Languages

| Language  | Docker Image            |
| --------- | ------------------------ |
| Python    | python:3.10              |
| C         | gcc                      |
| C++       | gcc                      |
| Java      | openjdk                 |
| Node.js   | node                     |
| Go        | golang                   |
| Ruby      | ruby                     |
| PHP       | php                      |
| Bash      | bash                     |
| C#        | mcr.microsoft.com/dotnet/sdk |

---


