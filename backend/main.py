import os
import json
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from pydantic import BaseModel, Field
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

# Configure Gemini API
API_KEY = os.getenv("GEMINI_API_KEY")
if API_KEY:
    genai.configure(api_key=API_KEY)

app = FastAPI(title="ToneTutor API")

app.add_middleware(GZipMiddleware, minimum_size=1000)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"message": "An internal error occurred. Please try again later."},
    )

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for the hackathon environment
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

class RewriteRequest(BaseModel):
    draft_text: str = Field(..., min_length=1, max_length=5000, description="The user's rough draft")
    selected_mode: str = Field(..., max_length=50)
    formality: int = Field(default=3, ge=1, le=5)
    length: int = Field(default=3, ge=1, le=5)

class RewriteResponse(BaseModel):
    revised_text: str
    feedback_points: list[str]

def format_prompt(draft: str, selected_mode: str, formality: int, length: int) -> str:
    if selected_mode == "campus_communicator":
        mode_context = "You are helping a student email a professor for recommendations, extensions, or approvals."
        tone = "respectful, concise, and academic."
        feedback_instructions = "Ensure the 'feedback_points' array contains exactly 3 specific, educational points teaching the user why the changes were made."
    elif selected_mode == "recruiter_bridge":
        mode_context = "You are helping a junior developer cold-message a tech recruiter for jobs or internships."
        tone = "professional, confident, and action-oriented."
        feedback_instructions = "Ensure the 'feedback_points' array contains exactly 3 specific, educational points teaching the user why the changes were made."
    elif selected_mode == "peer_collaborator":
        mode_context = "You are an expert communication coach helping a user message a project teammate, classmate, or peer."
        tone = "collaborative, friendly, and clear without being overly formal or stiff. It should strike a casually professional tone."
        feedback_instructions = """Ensure the 'feedback_points' array contains exactly 3 specific points:
    1. A structural change making the message more collaborative.
    2. A tone change avoiding sounding too bossy or too passive.
    3. A clarity change making the request or update easier to understand."""
    else:
        raise ValueError("Invalid mode selected.")

    system_prompt = f"""
{mode_context} 
Your task is to rewrite the provided rough draft to be {tone}

You must strictly output valid JSON with the following schema:
{{
  "revised_text": "The polished email string here.",
  "feedback_points": [
    "First specific reason for a change...",
    "Second specific reason for a change...",
    "Third specific reason for a change..."
  ]
}}
{feedback_instructions}
CRITICAL: Do NOT use literal placeholder letters like 'X', 'Y', or 'Z' in your output. You must write a specific, natural heading for each point based on the actual text. 
Example of BAD output: 'Why I removed X to sound confident:' 
Example of GOOD output: 'Why I removed the word "just" to sound confident:'
"""
    system_prompt += f"\n\nCRITICAL MODIFIERS:\n- Formality Level (1-5): {formality} (1 is extremely casual slang, 3 is standard professional, 5 is strictly formal/academic).\n- Length Level (1-5): {length} (1 is as short as possible, 3 is standard, 5 is highly detailed and expanded)."
    
    return system_prompt + f"\n\nRough Draft:\n{draft}"

@app.post("/api/rewrite", response_model=RewriteResponse)
async def rewrite_text(request: RewriteRequest) -> RewriteResponse:
    """
    Rewrites a given draft message based on the selected mode, formality, and length.
    
    Returns the revised text and actionable feedback points.
    """
    if not API_KEY:
        raise HTTPException(status_code=500, detail="Gemini API key is not configured.")
        
    if not request.draft_text.strip():
        raise HTTPException(status_code=400, detail="Draft text cannot be empty.")
        
    try:
        prompt = format_prompt(request.draft_text, request.selected_mode, request.formality, request.length)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    try:
        model = genai.GenerativeModel('gemini-3.5-flash-lite')
        response = model.generate_content(prompt)
        response_text = response.text.strip()
        
        # Clean markdown code blocks if the model wrapped the JSON
        if response_text.startswith("```json"):
            response_text = response_text[7:-3].strip()
        elif response_text.startswith("```"):
            response_text = response_text[3:-3].strip()
            
        result = json.loads(response_text)
        
        return RewriteResponse(
            revised_text=result.get("revised_text", ""),
            feedback_points=result.get("feedback_points", [])
        )
        
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Failed to parse the response from the AI.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
