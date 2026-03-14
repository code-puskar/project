import requests
import os
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={api_key}"

payload = {
    "contents": [{
        "parts": [{"text": "Say hello in one word"}]
    }]
}

response = requests.post(url, json=payload)
print(f"Status: {response.status_code}")
print(f"Response: {response.text[:300]}")
