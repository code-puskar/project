from fastapi import APIRouter, Depends
from app.dependencies.auth import get_current_user
from app.database import issues_collection

router = APIRouter()

@router.get("/me")
def my_profile(current_user: dict = Depends(get_current_user)):
    user_id = current_user["user_id"]
    
    # Calculate stats
    reported_count = issues_collection.count_documents({"user_id": user_id})
    validated_count = issues_collection.count_documents({"validated_by": user_id})
    
    return {
        "id": user_id,
        "name": current_user["name"],
        "email": current_user["email"],
        "role": current_user["role"],
        "reputation": current_user.get("reputation", 0),
        "stats": {
            "reported": reported_count,
            "validated": validated_count
        }
    }
