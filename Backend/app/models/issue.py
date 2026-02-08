from pydantic import BaseModel
from datetime import datetime

class Issue_model(BaseModel):
    title: str
    description: str
    category: str
    rating: int
    latitude: float
    longitude: float


def issue_model(data: dict) -> dict:
    return {
        "title": data["title"],
        "description": data["description"],
        "category": data["category"],
        "rating": data["rating"],
        "user_id": data["user_id"],
        "location": {
            "type": "Point",
            "coordinates": [data["longitude"], data["latitude"]]  # lng, lat
        },
        "status": "Active",
        "validations": 0,
        "validated_by": [],
        "created_at": datetime.utcnow()
    }
