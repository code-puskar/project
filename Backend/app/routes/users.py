from fastapi import APIRouter

router = APIRouter()

@router.get("/me")
def my_profile():
    return {"message": "User profile (JWT later)"}
