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
    Validates if the provided description is a relevant road/city issue.
    Returns (is_valid, reason)
    """
    if not client:
        print("Warning: GEMINI_API_KEY not found. Skipping AI validation.")
        return True, ""

    try:
        print(f"DEBUG: Validating issue - Type: {issue_type}, Desc: {description}")

        prompt = f"""
Analyze if the following report is a RELEVANT and DESCRIPTIVE road/city issue.

Category: {issue_type}
Description: "{description}"

STRICT VALIDATION RULES:
1. RELEVANCE: Is this about city infrastructure? (potholes, garbage, lighting, etc.)
2. GIBBERISH: Is the description random letters, keyboard smashing (e.g., "hgghwefe", "asdf"), or nonsensical? If YES, is_valid = false.
3. BREVITY: Is the description too short to be useful (e.g., "hi", "ok", "test")? If YES, is_valid = false.
4. ACCURACY: If category is "Pothole" but description is "I like pizza", is_valid = false.

Return ONLY valid JSON, no markdown:
{{"is_valid": true, "reason": ""}}
or
{{"is_valid": false, "reason": "reason here"}}
"""

        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt,
        )
        text = response.text.strip()
        print(f"DEBUG: AI Response: {text}")

        # Basic JSON cleanup
        if "```json" in text:
            text = text.split("```json")[1].split("```")[0].strip()
        elif "```" in text:
            text = text.split("```")[1].split("```")[0].strip()

        result = json.loads(text)
        is_valid = result.get("is_valid", True)
        reason = result.get("reason", "")
        print(f"DEBUG: Result - Valid: {is_valid}, Reason: {reason}")
        return is_valid, reason

    except Exception as e:
        print(f"AI Validation Error (Fail-safe active): {e}")
        # Default to True on API error or quota limit to avoid blocking users
        return True, ""
