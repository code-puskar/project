from pydantic import BaseModel, Field

class IssueCreate(BaseModel):
    issue_type: str = Field(..., example="Pothole")
    description: str = Field(..., min_length=10, max_length=1000, example="Large pothole causing traffic")
    latitude: float = Field(..., example=23.0225)
    longitude: float = Field(..., example=72.5714)
    user_latitude: float  # User current location
    user_longitude: float
    rating: int = Field(..., ge=1, le=4, example=3)
