from fastapi import APIRouter, Depends, HTTPException
from app.dependencies.auth import get_current_user
from app.database import issues_collection
from app.schemas.issue import IssueCreate
from app.utils.distance import calculate_distance
from bson import ObjectId
from app.database import users_collection
from datetime import datetime
from app.utils.constants import (
    ISSUE_VERIFY_COUNT,
    REPORTER_REWARD,
    VALIDATOR_REWARD
)

router = APIRouter()


# ----------------------------
# Create Issue
# ----------------------------
@router.post("/")
def create_issue(
    issue: IssueCreate,
    current_user: dict = Depends(get_current_user)
):
    distance = calculate_distance(
        issue.user_latitude,
        issue.user_longitude,
        issue.latitude,
        issue.longitude
    )

    if distance > 1000:
        raise HTTPException(
            status_code=403,
            detail="You must be within 1 km of the issue location to report it"
        )

    issues_collection.insert_one({
        "issue_type": issue.issue_type,
        "description": issue.description,
        "rating": issue.rating,
        "status": "Active",
        "user_id": current_user["user_id"],
        "location": {
            "type": "Point",
            "coordinates": [issue.longitude, issue.latitude]
        },
        "created_at": datetime.utcnow()
    })

    return {
        "message": "Issue created successfully",
        "distance_meters": round(distance, 2)
    }


# ----------------------------
# Get All Issues
# ----------------------------
@router.get("/")
def get_all_issues():
    return list(issues_collection.find({}, {"_id": 0}))


# ----------------------------
# Get Nearby Issues (THIS ONE)
# ----------------------------
@router.get("/nearby")
def nearby_issues(
    lat: float,
    lng: float,
    radius: int = 500
):
    return list(
        issues_collection.find(
            {
                "location": {
                    "$near": {
                        "$geometry": {
                            "type": "Point",
                            "coordinates": [lng, lat]
                        },
                        "$maxDistance": radius
                    }
                }
            },
            {"_id": 0}
        )
    )
# ----------------------------
# Secure Test Endpoint  

@router.get("/secure-test")
def secure_test(current_user: dict = Depends(get_current_user)):
    return {
        "message": "You are authenticated",
        "user": current_user
    }
# ----------------------------
#ISSUE VALIDATION ENDPOINT
# ----------------------------  
@router.post("/{issue_id}/validate")
def validate_issue(
    issue_id: str,
    current_user: dict = Depends(get_current_user)
):
    issue = issues_collection.find_one({"_id": ObjectId(issue_id)})

    if not issue:
        raise HTTPException(404, "Issue not found")

    user_id = current_user["user_id"]

    if user_id == issue["user_id"]:
        raise HTTPException(400, "You cannot validate your own issue")

    if user_id in issue.get("validated_by", []):
        raise HTTPException(400, "You already validated this issue")

    # Update issue
    issues_collection.update_one(
        {"_id": ObjectId(issue_id)},
        {
            "$inc": {"validations": 1},
            "$push": {"validated_by": user_id}
        }
    )

    # Reward validator
    users_collection.update_one(
        {"_id": ObjectId(user_id)},
        {"$inc": {"reputation": VALIDATOR_REWARD}}
    )

    # Check verification threshold
    updated_issue = issues_collection.find_one({"_id": ObjectId(issue_id)})

    if updated_issue["validations"] >= ISSUE_VERIFY_COUNT:
        issues_collection.update_one(
            {"_id": ObjectId(issue_id)},
            {"$set": {"status": "Verified"}}
        )

        # Reward reporter
        users_collection.update_one(
            {"_id": ObjectId(issue["user_id"])},
            {"$inc": {"reputation": REPORTER_REWARD}}
        )

        return {"message": "Issue verified 🎉"}

    return {"message": "Issue validated successfully"}

