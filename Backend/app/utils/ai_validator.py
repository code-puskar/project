import os
import json
import logging
import requests
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

# OpenRouter Configuration
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
MODEL = "google/gemini-2.0-flash-001"

import base64

def validate_image_content(file_path: str) -> tuple[bool, str]:
    """
    Validates if the uploaded image actually depicts a road/city issue using Gemini Vision via OpenRouter.
    """
    if not OPENROUTER_API_KEY:
        logger.warning("OPENROUTER_API_KEY not found. Skipping image AI validation.")
        return True, ""

    try:
        logger.info(f"AI Validating image content: {file_path}")
        
        with open(file_path, "rb") as image_file:
            base64_image = base64.b64encode(image_file.read()).decode('utf-8')
            
        # Determine mime type roughly from extension
        ext = file_path.split(".")[-1].lower()
        mime_type = f"image/{ext}" if ext != "jpg" else "image/jpeg"

        prompt = """
Analyze this image and determine if it depicts a GENUINE city infrastructure issue (like a pothole, broken streetlight, garbage pile, waterlogging, damaged road, etc.).

STRICT VALIDATION RULES:
1. INAPPROPRIATE CONTENT: If the image contains nudity, violence, or highly offensive material, is_valid = false.
2. RELEVANCE: Is this clearly a picture of a road, street, or public infrastructure issue? If it's a selfie, a cartoon, an indoor photo, a screenshot, or entirely unrelated to city reporting, is_valid = false.
3. LEGITIMACY: Does it look like a reasonable report?

Return ONLY valid JSON:
{"is_valid": true, "reason": ""} or {"is_valid": false, "reason": "reason here"}
"""

        response = requests.post(
            url="https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "Content-Type": "application/json"
            },
            data=json.dumps({
                "model": MODEL,
                "messages": [
                    {
                        "role": "user",
                        "content": [
                            {"type": "text", "text": prompt},
                            {
                                "type": "image_url",
                                "image_url": {
                                    "url": f"data:{mime_type};base64,{base64_image}"
                                }
                            }
                        ]
                    }
                ],
                "response_format": {"type": "json_object"}
            }),
            timeout=25,
        )

        response.raise_for_status()
        data = response.json()
        
        result_text = data['choices'][0]['message']['content']
        result = json.loads(result_text)
        
        is_valid = result.get("is_valid", False)
        reason = result.get("reason", "Unknown AI error")
        
        if not is_valid:
            logger.warning(f"Image AI Rejected: {reason}")
            
        return is_valid, reason

    except Exception as e:
        logger.error(f"Image AI Validation Error: {e}")
        # Fail open so users aren't blocked if AI service is temporarily down
        return True, ""


def validate_issue_content(description: str, issue_type: str) -> tuple[bool, str]:
    """
    Validates if the provided description is a relevant road/city issue using OpenRouter (strictly AI).
    """
    if not OPENROUTER_API_KEY:
        logger.warning("OPENROUTER_API_KEY not found. Skipping AI validation.")
        return True, ""

    try:
        logger.info(f"AI Validating issue - Type: {issue_type}, Desc: {description[:50]}...")

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

        response = requests.post(
            url="https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "Content-Type": "application/json"
            },
            data=json.dumps({
                "model": MODEL,
                "messages": [
                    {"role": "user", "content": prompt}
                ],
                "response_format": {"type": "json_object"}
            }),
            timeout=15,
        )

        if response.status_code != 200:
            raise Exception(f"OpenRouter Error: {response.status_code} - {response.text}")

        data = response.json()
        text = data['choices'][0]['message']['content'].strip()

        # Basic JSON cleanup
        if "```json" in text:
            text = text.split("```json")[1].split("```")[0].strip()
        elif "```" in text:
            text = text.split("```")[1].split("```")[0].strip()

        result = json.loads(text)
        is_valid = result.get("is_valid", True)
        reason = result.get("reason", "")
        logger.info(f"AI Result - Valid: {is_valid}, Reason: {reason}")
        return is_valid, reason

    except Exception as e:
        error_msg = str(e)
        logger.error(f"AI Service Error: {error_msg}")

        # PRODUCTION STANDARD: Strictly rely on AI.
        if "429" in error_msg:
            return False, "Validation system is currently busy. Please try again in 1 minute."

        return False, f"Validation system unavailable. ({error_msg[:50]})"
