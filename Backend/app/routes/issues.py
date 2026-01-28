from fastapi import APIRouter, Depends, HTTPException
from bson import ObjectId
from datetime import datetime

from app.dependencies.auth import get_current_user
from app.database import issues_collection, users_collection
from app.schemas.issue import IssueCreate
from app.utils.constants import (
    ISSUE_VERIFY_COUNT,
    REPORTER_REWARD,
    VALIDATOR_REWARD
)

router = APIRouter(prefix="/issues", tags=["Issues"])

DUPLICATE_RADIUS_METERS = 100  # meters






# ----------------------------
# Create Issue
# ----------------------------
@router.post("/")
def create_issue(
    issue: IssueCreate,
    current_user: dict = Depends(get_current_user)
):
    existing_issue = issues_collection.find_one({
        "status": "Active",
        "location": {
            "$near": {
                "$geometry": {
                    "type": "Point",
                    "coordinates": [issue.longitude, issue.latitude]
                },
                "$maxDistance": DUPLICATE_RADIUS_METERS
            }
        }
    })

    if existing_issue:
        raise HTTPException(
            status_code=400,
            detail="A similar issue already exists nearby"
        )

    issues_collection.insert_one({
        "issue_type": issue.issue_type,
        "description": issue.description,
        "location": {
            "type": "Point",
            "coordinates": [issue.longitude, issue.latitude]
        },
        "status": "Active",
        "user_id": current_user["user_id"],
        "validations": 0,
        "validated_by": [],
        "created_at": datetime.utcnow()
    })

    return {"message": "Issue reported successfully"}






# ----------------------------
# Get All Issues
# ----------------------------
@router.get("/")
def get_all_issues():
    return list(
        issues_collection.find(
            {"status": {"$in": ["Active", "Verified"]}},
            {"_id": 0}
        )
    )


# ----------------------------
# Get Nearby Issues (THIS ONE)
# ----------------------------
@router.get("/nearby")
def nearby_issues(lat: float, lng: float, radius: int = 500):
    return list(
        issues_collection.find(
            {
                "status": {"$in": ["Active", "Verified"]},
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
    user_id = current_user["user_id"]
    issue = issues_collection.find_one({"_id": ObjectId(issue_id)})

    if not issue:
        raise HTTPException(404, "Issue not found")

    if issue["user_id"] == user_id:
        raise HTTPException(400, "You cannot validate your own issue")

    if user_id in issue.get("validated_by", []):
        raise HTTPException(400, "You already validated this issue")

    new_validation_count = issue["validations"] + 1

    update_data = {
        "$inc": {"validations": 1},
        "$push": {"validated_by": user_id}
    }

    if new_validation_count >= ISSUE_VERIFY_COUNT:
        update_data["$set"] = {"status": "Verified"}

    issues_collection.update_one(
        {"_id": ObjectId(issue_id)},
        update_data
    )

    # Reward validator
    users_collection.update_one(
        {"_id": ObjectId(user_id)},
        {"$inc": {"reputation": VALIDATOR_REWARD}}
    )

    # Reward reporter only once (on verification)
    if new_validation_count == ISSUE_VERIFY_COUNT:
        users_collection.update_one(
            {"_id": ObjectId(issue["user_id"])},
            {"$inc": {"reputation": REPORTER_REWARD}}
        )
        return {"message": "Issue verified 🎉"}

    return {"message": "Issue validated successfully"}








# ----------------------------
# ISSUE RESOLUTION ENDPOINT
# ----------------------------
@router.post("/{issue_id}/resolve")
def resolve_issue(
    issue_id: str,
    current_user: dict = Depends(get_current_user)
):
    issue = issues_collection.find_one({"_id": ObjectId(issue_id)})

    if not issue:
        raise HTTPException(404, "Issue not found")

    # ❌ Only verified issues can be resolved
    if issue["status"] != "Verified":
        raise HTTPException(
            400,
            "Only verified issues can be resolved"
        )

    user_id = current_user["user_id"]
    user_role = current_user.get("role")

    # ❌ Only admin or reporter
    if user_role != "admin" and issue["user_id"] != user_id:
        raise HTTPException(
            403,
            "You are not allowed to resolve this issue"
        )

    issues_collection.update_one(
        {"_id": ObjectId(issue_id)},
        {
            "$set": {
                "status": "Resolved",
                "resolved_at": datetime.utcnow(),
                "resolved_by": user_id
            }
        }
    )

    return {"message": "Issue marked as resolved"}
# ----------------------------  
# Nearby Issues
@router.get("/alerts/nearby")
def nearby_alerts(
    lat: float,
    lng: float,
    current_user: dict = Depends(get_current_user)
):
    alerts = list(
        issues_collection.find(
            {
                "status": {"$in": ["Active", "Verified"]},
                "location": {
                    "$near": {
                        "$geometry": {
                            "type": "Point",
                            "coordinates": [lng, lat]
                        },
                        "$maxDistance": 1000
                    }
                }
            },
            {
                "_id": 0,
                "issue_type": 1,
                "description": 1,
                "location": 1,
                "status": 1
            }
        )
    )

    return {
        "count": len(alerts),
        "alerts": alerts
    }
# ----------------------------
