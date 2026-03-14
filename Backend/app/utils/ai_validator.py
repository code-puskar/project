from google import genai
import os
import json
from dotenv import load_dotenv

load_dotenv()

# Configure Gemini client
api_key = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=api_key) if api_key else None


def validate_issue_content(description: str, issue_type: str) -> tuple[bool, str]:
    """
    Validates if the provided description is a relevant road/city issue using ONLY AI.
    """
    if not client:
        print("Warning: GEMINI_API_KEY not found. Skipping AI validation.")
        return True, ""

    try:
        print(f"DEBUG: AI Validating issue - Type: {issue_type}, Desc: {description}")

        prompt = f"""
Analyze if the following report is a RELEVANT and DESCRIPTIVE road/city issue.

Category: {issue_type}
Description: "{description}"

STRICT VALIDATION RULES:
1. RELEVANCE: Is this about city infrastructure? (potholes, garbage, lighting, etc.)
2. GIBBERISH: Is the description random letters, keyboard smashing, or nonsensical? If YES, is_valid = false.
3. BREVITY: Is the description too short/vague to be useful? If YES, is_valid = false.
4. ACCURACY: If the category is unrelated to the description (e.g., Category: Water, Desc: "I love dogs"), is_valid = false.

IMPORTANT: "I love dogs", "Hello world", "Buy pizza" are UNRELATED and should be results in is_valid: false.

Return ONLY valid JSON:
{{"is_valid": true, "reason": ""}} or {{"is_valid": false, "reason": "reason here"}}
"""

        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt,
        )
        text = response.text.strip()
        
        # Basic JSON cleanup
        if "```json" in text:
            text = text.split("```json")[1].split("```")[0].strip()
        elif "```" in text:
            text = text.split("```")[1].split("```")[0].strip()

        result = json.loads(text)
        is_valid = result.get("is_valid", True)
        reason = result.get("reason", "")
        print(f"DEBUG: AI Result - Valid: {is_valid}, Reason: {reason}")
        return is_valid, reason

    except Exception as e:
        error_msg = str(e)
        print(f"AI Service Error: {error_msg}")
        
        # PRODUCTION STANDARD: Strictly rely on AI. 
        # If AI is hitting quota (429) or forbidden (403), we block the post 
        # to ensure junk never passes during downtime.
        if "429" in error_msg or "RESOURCE_EXHAUSTED" in error_msg:
            return False, "Validation system is currently busy (Quota reached). Please try again in 1 minute."
        
        return False, "Validation system temporarily unavailable. Please try again later."



