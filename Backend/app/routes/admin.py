from fastapi import APIRouter, Depends, HTTPException, Query
from bson import ObjectId
from app.database import issues_collection, users_collection
from app.dependencies.admin import admin_only
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/admin", tags=["Admin"])


# ----------------------------
# View all issues (admin) with pagination, search, and filter
# ----------------------------
@router.get("/issues")
def get_all_issues_admin(
    admin=Depends(admin_only),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    status: str = Query(None, description="Filter by status: Active, Verified, Resolved"),
    issue_type: str = Query(None, description="Filter by issue type"),
    search: str = Query(None, description="Search in description"),
):
    query = {}

    if status:
        query["status"] = status
    if issue_type:
        query["issue_type"] = issue_type
    if search:
        query["description"] = {"$regex": search, "$options": "i"}

    total = issues_collection.count_documents(query)
    issues = list(
        issues_collection.find(query)
        .sort("created_at", -1)
        .skip(skip)
        .limit(limit)
    )

    for issue in issues:
        issue["_id"] = str(issue["_id"])

    return {
        "total": total,
        "skip": skip,
        "limit": limit,
        "issues": issues
    }


# ----------------------------
# Delete abusive issue
# ----------------------------
@router.delete("/issues/{issue_id}")
def delete_issue(issue_id: str, admin=Depends(admin_only)):
    result = issues_collection.delete_one({"_id": ObjectId(issue_id)})

    if result.deleted_count == 0:
        raise HTTPException(404, "Issue not found")

    return {"message": "Issue removed by admin"}


# ----------------------------
# Ban user (soft ban)
# ----------------------------
@router.post("/users/{user_id}/ban")
def ban_user(user_id: str, admin=Depends(admin_only)):
    user = users_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(404, "User not found")
    if user.get("role") == "admin":
        raise HTTPException(400, "Cannot ban an admin user")

    users_collection.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"is_banned": True}}
    )
    logger.info(f"User {user_id} banned by admin {admin['user_id']}")
    return {"message": "User banned successfully"}


# ----------------------------
# Unban user
# ----------------------------
@router.post("/users/{user_id}/unban")
def unban_user(user_id: str, admin=Depends(admin_only)):
    user = users_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(404, "User not found")

    users_collection.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"is_banned": False}}
    )
    logger.info(f"User {user_id} unbanned by admin {admin['user_id']}")
    return {"message": "User unbanned successfully"}


# ----------------------------
# Get all users (admin) with pagination and search
# ----------------------------
@router.get("/users")
def get_all_users(
    admin=Depends(admin_only),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    search: str = Query(None, description="Search by name or email"),
):
    query = {}
    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"email": {"$regex": search, "$options": "i"}},
        ]

    total = users_collection.count_documents(query)
    users = list(
        users_collection.find(query, {"password_hash": 0})
        .skip(skip)
        .limit(limit)
    )
    for u in users:
        u["_id"] = str(u["_id"])

    return {
        "total": total,
        "skip": skip,
        "limit": limit,
        "users": users
    }


# ----------------------------
# Get Admin Stats
# ----------------------------
@router.get("/stats")
def get_admin_stats(admin=Depends(admin_only)):
    total_users = users_collection.count_documents({})
    banned_users = users_collection.count_documents({"is_banned": True})
    total_issues = issues_collection.count_documents({})
    resolved_issues = issues_collection.count_documents({"status": "Resolved"})
    verified_issues = issues_collection.count_documents({"status": "Verified"})
    active_issues = issues_collection.count_documents({"status": "Active"})

    # Issue type breakdown
    issue_types = {}
    for itype in ["Pothole", "Garbage", "Streetlight", "Water", "Other"]:
        issue_types[itype] = issues_collection.count_documents({"issue_type": itype})

    recent_issues = list(
        issues_collection.find(
            {},
            {"_id": 1, "title": 1, "issue_type": 1, "status": 1, "created_at": 1, "user_id": 1, "description": 1}
        ).sort("created_at", -1).limit(10)
    )
    for r in recent_issues:
        r["_id"] = str(r["_id"])

    return {
        "total_users": total_users,
        "banned_users": banned_users,
        "total_issues": total_issues,
        "resolved_issues": resolved_issues,
        "verified_issues": verified_issues,
        "active_issues": active_issues,
        "issue_types": issue_types,
        "recent_issues": recent_issues
    }
