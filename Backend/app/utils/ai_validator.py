import re
from google import genai
import os
import json
from dotenv import load_dotenv

load_dotenv()

# Configure Gemini client
api_key = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=api_key) if api_key else None


def is_obvious_gibberish(text: str) -> tuple[bool, str]:
    """
    Advanced deterministic check for gibberish/non-descriptive text.
    Uses character distribution and linguistic heuristics.
    """
    text = text.strip()
    original_text = text
    text_lower = text.lower()
    
    # 1. Extremely short
    if len(text) < 5:
        return True, "Description is too short. Please provide more detail."

    # 2. Keyboard smashing / Consecutive Consonants
    # We treat 'y' as a semi-vowel here to be safe
    if re.search(r'[^aeiouy\s]{5,}', text_lower):
        return True, "Invalid input (suspicious character sequence detected)."

    # 3. Vowel Density Check
    vowels = re.findall(r'[aeiouy]', text_lower)
    vowel_count = len(vowels)
    if len(text) > 6:
        vowel_ratio = vowel_count / len(text)
        # English usually has > 25% vowels. We'll be lenient and use 15%.
        if vowel_ratio < 0.15 and " " not in text:
            return True, "Invalid input (seems like random characters)."

    # 4. Space Distribution
    # If a long string has no spaces, it's likely gibberish
    if len(text) > 12 and " " not in text:
        return True, "Invalid input (please use spaces between words)."

    # 5. Repeating characters
    if re.search(r'(.)\1{3,}', text_lower):
        return True, "Invalid input (excessive repeating characters)."

    # 6. Low alphanumeric content
    alnum_ratio = len(re.findall(r'[a-zA-Z0-9]', text)) / len(text)
    if alnum_ratio < 0.5:
        return True, "Invalid input (too many symbols/special characters)."

    return False, ""



def validate_issue_content(description: str, issue_type: str) -> tuple[bool, str]:
    """
    Validates if the provided description is a relevant road/city issue.
    Uses a hybrid approach: Local Pre-validation + AI Verification.
    """
    # Step 1: Local Pre-validation (Failsafe & Speed)
    is_gibberish, reason = is_obvious_gibberish(description)
    if is_gibberish:
        print(f"DEBUG: Local Validator blocked input: {reason}")
        return False, reason

    # Step 2: AI Verification (Gemini)
    if not client:
        print("Warning: GEMINI_API_KEY not found. Skipping AI verification (Local validation passed).")
        return True, ""

    try:
        print(f"DEBUG: AI Validating issue - Type: {issue_type}, Desc: {description}")

        prompt = f"""
Analyze if the following report is a RELEVANT and DESCRIPTIVE road/city issue.

Category: {issue_type}
Description: "{description}"

STRICT VALIDATION RULES:
1. RELEVANCE: Is this about city infrastructure? (potholes, garbage, lighting, etc.)
2. GIBBERISH: Is the description random letters or nonsensical? If YES, is_valid = false.
3. BREVITY: Is the description too short/vague to be useful? If YES, is_valid = false.
4. ACCURACY: If category is "Pothole" but description is unrelated, is_valid = false.

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
        return result.get("is_valid", True), result.get("reason", "")

    except Exception as e:
        print(f"AI Service Error: {e}")
        # Default to True on API error because Local Pre-validation already passed
        # This prevents blocking users if Gemini is down/quota-limited.
        return True, ""

