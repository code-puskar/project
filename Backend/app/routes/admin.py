from fastapi import APIRouter

router = APIRouter()

@router.get("/issues")
def all_issues():
    return {"message": "Admin issues list"}
