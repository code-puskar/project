import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

# Configure Gemini
api_key = os.getenv("GEMINI_API_KEY")
if api_key:
    genai.configure(api_key=api_key)

def validate_issue_content(description: str, issue_type: str) -> tuple[bool, str]:
    """
    Validates if the provided description is a relevant road/city issue.
    Returns (is_valid, reason)
    """
    if not api_key:
        # Fallback if API key is missing during dev
        print("Warning: GEMINI_API_KEY not found. Skipping AI validation.")
        return True, ""

    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
        
        prompt = f"""
        You are an AI monitor for a "Smart City Road Issue Reporting" app.
        Your task is to verify if a user's report is relevant and helpful.
        
        Report Category: {issue_type}
        User Description: "{description}"
        
        Rules for relevance:
        1. It must be related to city infrastructure (roads, potholes, garbage, streetlights, water leakage, etc.).
        2. It should not be random gibberish, test text (like "asdf"), or offensive content.
        3. It should not be a general greeting or unrelated chat.
        4. If the category is "Other", use common sense to see if it fits a city maintenance context.
        
        Respond ONLY in JSON format:
        {{
          "is_valid": true/false,
          "reason": "Brief explanation if false, otherwise empty"
        }}
        """
        
        response = model.generate_content(prompt)
        # Handle cases where response might be wrapped in ```json ... ```
        text = response.text.strip()
        if "```json" in text:
            text = text.split("```json")[1].split("```")[0].strip()
        elif "```" in text:
            text = text.split("```")[1].split("```")[0].strip()
            
        import json
        result = json.loads(text)
        return result.get("is_valid", True), result.get("reason", "")
        
    except Exception as e:
        print(f"AI Validation Error: {e}")
        # Default to True on API error to avoid blocking users if service is down
        return True, ""
