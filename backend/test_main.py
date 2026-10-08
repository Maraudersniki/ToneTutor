import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch
from main import app

client = TestClient(app)

@patch("main.genai.GenerativeModel")
def test_rewrite_message_success(mock_genai_model):
    # Mock the Gemini API response
    mock_instance = mock_genai_model.return_value
    mock_instance.generate_content.return_value.text = '{"revised_text": "Hello world.", "feedback_points": ["Point 1", "Point 2", "Point 3"]}'
    
    # Mock the API key so it bypasses the 500 error check
    with patch("main.API_KEY", "dummy_key"):
        response = client.post("/api/rewrite", json={
            "draft_text": "sup world",
            "selected_mode": "peer_collaborator"
        })
        
        assert response.status_code == 200
        data = response.json()
        assert data["revised_text"] == "Hello world."
        assert len(data["feedback_points"]) == 3
