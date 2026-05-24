# 🚀 SakshatAI — AI-Powered Interview Simulator

> A real-time AI interview platform that simulates technical interviews using speech recognition, AI-driven questioning (OpenRouter), and automated evaluation with feedback generation.

---

## 🎯 Overview

SakshatAI is a full-stack AI interview platform designed to replicate real-world technical interview experiences.

It enables users to:
- Speak answers naturally using voice input 🎤  
- Receive AI-generated questions 🤖  
- Get instant feedback using LLM evaluation 🧠  
- Experience timed, structured interview flow ⏱️  
- Interact with an AI interviewer using voice + video avatar 🎬  

---

## ✨ Key Features

### 🤖 AI Interviewer (OpenRouter Powered)
- Uses OpenRouter API to access multiple LLMs (GPT, Claude, Mistral, etc.)
- Generates contextual interview questions
- Evaluates user answers intelligently
- Provides structured feedback and improvement tips

---

### 🎙️ Voice-Based Interaction System
- Real-time speech-to-text using Web Speech API
- AI speaks questions using Speech Synthesis API
- Continuous microphone listening with smart restart handling
- Hybrid input support (voice + text)

---

### ⏱️ Interview Flow Engine
- Structured question-by-question flow
- Automatic timer per question
- Auto-submit on timeout
- Controlled progression system:

Intro → Question → Answer → AI Feedback → Next Question

---

### 🧠 AI Evaluation System
Each answer is processed by an LLM via OpenRouter:
- Score (0–10)
- Feedback analysis
- Improvement suggestions
- Communication assessment

---

### 🎬 AI Avatar Experience
- Male/Female AI video avatars
- Synchronized with AI speech state
- Creates immersive interview environment

---

## 🧱 Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Framer Motion
- Axios
- Web Speech API
- React Icons

### Backend
- Node.js
- Express.js
- REST APIs
- OpenRouter API Integration

### AI Layer
- OpenRouter API
- GPT / Claude / Mistral models

---

## 🏗️ System Architecture

User (Voice/Text)
        ↓
React Frontend
        ↓
Express Backend
        ↓
OpenRouter LLM
        ↓
AI Evaluation (Score + Feedback)
        ↓
Frontend UI Update



---

## 🔌 API Endpoints

### Submit Answer
POST /api/interview/submit-answer

Request Body:
{
  "interviewId": "string",
  "questionIndex": 0,
  "answer": "string",
  "timeTaken": 45
}

---

### Finish Interview
POST /api/interview/finish

Request Body:
{
  "interviewId": "string"
}

---

## 🧠 OpenRouter Integration

POST https://openrouter.ai/api/v1/chat/completions

System Prompt:
"You are an expert technical interviewer. Evaluate answers strictly."

Output:
- Score (0–10)
- Feedback
- Improvement tips

---

## 🚀 How It Works

1. User starts interview session
2. AI introduces interview flow
3. AI asks question using voice + avatar
4. User responds using mic or typing
5. Answer is sent to backend
6. OpenRouter evaluates response
7. Feedback is displayed instantly
8. Next question begins
9. Final interview summary is generated

---

## 🔥 Highlights

- Real-time AI voice interviewer
- Speech-to-text system
- LLM-based evaluation
- Fully automated interview flow
- Human-like conversational experience
- Production-style architecture

---

## 📌 Future Improvements

- Resume-based dynamic questions
- WebSocket real-time AI interviewer
- Recruiter dashboard
- Emotion detection system
- Multi-round interview system

---

## 🧑‍💻 Author

Charul Jain  
Full Stack Developer | AI Enthusiast  

---

## ⭐ Project Status

Active Development 🚧  
Ready for deployment 🚀  

---
