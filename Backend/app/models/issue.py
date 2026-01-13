from pydantic import BaseModel
from datetime import datetime

class IssueCreate(BaseModel):
    title: str
    description: str
    category: str
    severity: int
    latitude: float
    longitude: float


def issue_model(data: dict) -> dict:
    return {
        "title": data["title"],
        "description": data["description"],
        "category": data["category"],
        "severity": data["severity"],
        "user_id": data["user_id"],
        "location": {
            "type": "Point",
            "coordinates": [data["longitude"], data["latitude"]]  # lng, lat
        },
        "created_at": datetime.utcnow()
    }
