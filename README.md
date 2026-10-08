# ToneTutor

ToneTutor is a full-stack web application designed to help users rewrite high-stakes professional messages. It not only polishes the drafts to suit specific niches but also teaches the user *why* the changes were made to improve their future communication skills.

## Problem it Solves
Writing professional messages can be daunting. A slight misstep in tone when emailing a professor for an extension or cold-messaging a recruiter can lead to ignored emails or rejected requests. ToneTutor acts as an AI communication coach that fixes these mistakes and explains its reasoning.

## Core Features
- **Dual-Niche Modes**: 
  - *Campus Communicator*: Tailored for students emailing professors (respectful, concise, academic).
  - *Recruiter Bridge*: Tailored for junior developers networking with tech recruiters (professional, confident, action-oriented).
- **AI-Powered Polishing**: Re-writes rough drafts using the Google Gemini Pro API.
- **Coach's Feedback**: Provides 3 specific reasons explaining what was changed and why.

## Tech Stack
- **Frontend**: React (Vite) + Tailwind CSS
- **Backend**: Python (FastAPI)
- **AI**: Google Gemini Pro API

## Setup Instructions

### Prerequisites
- Node.js and npm
- Python 3.9+
- A Google Gemini API Key

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create a virtual environment and activate it:
   ```bash
   python -m venv venv
   source venv/Scripts/activate  # On Windows
   ```
3. Install the dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure the environment variables:
   - Copy `.env.example` to `.env`.
   - Add your Gemini API Key: `GEMINI_API_KEY=your_api_key_here`
5. Run the backend server:
   ```bash
   python main.py
   # Or using uvicorn directly: uvicorn main:app --reload
   ```
   The backend will be running at `http://localhost:8000`.

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend will be accessible at `http://localhost:5173`.
