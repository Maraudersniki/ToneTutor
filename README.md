# ToneTutor

## Project Overview
ToneTutor is an AI-powered communication coach built to help users elevate their high-stakes professional messages. Using Google's Gemini API, it provides instant, niche-specific rewriting and actionable feedback.

## Problem Statement Alignment
Many professionals, students, and developers struggle with finding the right tone in high-stakes communications, such as cold-emailing recruiters or asking professors for recommendations. ToneTutor solves this problem by acting as a personalized communication coach. It not only polishes the rough draft to sound confident and professional, but it also provides specific, educational feedback points explaining *why* the changes were made, helping the user learn and improve their writing skills over time.

## Tech Stack & Efficiency
- **Frontend**: React (Vite) + Tailwind CSS (Custom Dark Mode Bento UI)
- **Backend**: Python (FastAPI) + Uvicorn
- **AI Engine**: Google Gemini API (`gemini-3.5-flash-lite`)
- **Deployment**: Dockerized for Google Cloud Run

## How to Run

### Backend
1. `cd backend`
2. Create a `.env` file and add your `GEMINI_API_KEY=your_key_here`
3. `pip install -r requirements.txt`
4. `uvicorn main:app --reload`

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev`
