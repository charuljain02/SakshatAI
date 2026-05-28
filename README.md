# 🚀 SakshatAI — AI Interview Simulator

A production-style AI-powered interview preparation platform that simulates real technical interviews using voice interaction, LLM-based evaluation, and structured interview flow.

---

## 🌐 Live Demo
https://sakshatai-client.onrender.com/

---

## 📌 Overview

SakshatAI is a full-stack AI interview simulator designed to replicate real-world technical interview experiences.

It allows users to:
- 🎤 Answer questions using voice or text
- 🤖 Interact with an AI interviewer
- 🧠 Receive AI-generated feedback and scoring
- ⏱️ Experience timed interview sessions
- 🎬 Engage with a realistic interview flow system

---

## ✨ Key Features

### 🤖 AI Interview Engine
- Powered by OpenRouter API
- Uses LLMs (GPT / Claude / Mistral)
- Generates contextual technical questions
- Evaluates answers intelligently

---

### 🎙️ Voice Interaction System
- Speech-to-text (Web Speech API)
- Text-to-speech AI interviewer
- Continuous microphone handling
- Hybrid input support (voice + text)

---

### ⏱️ Interview Flow System
Structured flow:

Intro → Question → Answer → Evaluation → Next Question

- Timer-based questions
- Auto progression system
- Controlled interview lifecycle

---

### 🧠 AI Evaluation System
Each answer is analyzed using LLM:

- Score (0–10)
- Feedback
- Communication assessment
- Improvement suggestions

---

### 🎬 AI Interview Experience
- AI voice responses
- Avatar-based UI experience
- Real-time conversational feel
- Interview simulation environment

---

## 🧱 Tech Stack

### Frontend
- React.js (Vite)
- Tailwind CSS
- Redux Toolkit
- Axios
- Framer Motion
- React Router DOM
- Web Speech API
- Recharts
- React Icons

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- REST APIs
- Multer

### AI Integration
- OpenRouter API
- GPT / Claude / Mistral models

### Deployment
- Frontend: Render
- Backend: Render

---

## 🏗️ System Architecture
<img width="1452" height="1440" alt="image" src="https://github.com/user-attachments/assets/46971b66-bf27-48ed-8a30-5ce8049e4957" />

 
---

## 🔌 API Endpoints

### Submit Answer
```http
POST /api/interview/submit-answer
{
  "interviewId": "string",
  "questionIndex": 0,
  "answer": "string",
  "timeTaken": 45
}
Finish Interview
POST /api/interview/finish
{
  "interviewId": "string"
}
```

## 🧠 How It Works

- User starts interview session  
- AI generates structured questions  
- User answers via voice/text  
- Backend sends response to OpenRouter  
- AI evaluates:
  - Score (0–10)  
  - Feedback  
  - Improvement tips  
- Result is displayed instantly  
- Next question continues flow  
- Final report is generated  

---

## 💳 Credit System

- Users receive free credits  
- Each interview consumes credits  
- No payment integration yet (MVP stage)  
- System designed for future Stripe/Razorpay integration  

---

## 🔥 Highlights

- Real-time AI interviewer experience  
- Voice-based interaction system  
- LLM-powered evaluation engine  
- Fully automated interview lifecycle  
- SaaS-ready scalable architecture  
- Production deployment on Render  

---

## 📁 Project Structure

```bash id="project_structure"
client/   → React frontend
server/   → Express backend
```
```
🚀 Local Setup
Clone repository
git clone https://github.com/your-username/SakshatAI.git
Install dependencies

Frontend:

cd client
npm install
npm run dev

Backend:

cd server
npm install
npm run dev
```
```
🔐 Environment Variables

Create .env file in server/:

MONGO_URI=your_mongodb_url
JWT_SECRET=your_secret
OPENROUTER_API_KEY=your_api_key
PORT=5000
```
---
### 📈 Future Improvements
💰 Payment gateway integration (Razorpay / Stripe)
📊 Analytics dashboard for user performance
🧑‍💼 Resume-based adaptive interviews
🎯 Difficulty selection system
🧠 Emotion / confidence detection system
🌐 WebSocket real-time interviewer
---
### 👨‍💻 Author
Charul Jain

GitHub: https://github.com/charuljain02
⭐ Project Status
🚧 Actively Maintained
🚀 Production MVP Completed
📌 Ready for Internship / Portfolio Showcase
