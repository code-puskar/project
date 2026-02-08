from pydantic import BaseModel, Field

class IssueCreate(BaseModel):
    issue_type: str = Field(..., example="Pothole")
    description: str = Field(..., example="Large pothole causing traffic")
    latitude: float = Field(..., example=23.0225)
    longitude: float = Field(..., example=72.5714)
    user_latitude: float # User current location
    user_longitude: float
    rating: int = Field(..., ge=1, le=5, example=4)
from pydantic import BaseModel, Field


