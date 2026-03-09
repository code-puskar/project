from fastapi import APIRouter, Depends, HTTPException
from bson import ObjectId
from app.database import issues_collection, users_collection
from app.dependencies.admin import admin_only

router = APIRouter(prefix="/admin", tags=["Admin"])

# ----------------------------
# View all issues (admin)
# ----------------------------
@router.get("/issues")
def get_all_issues_admin(admin=Depends(admin_only)):
    return list(
        issues_collection.find({}, {"_id": 0})
    )

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
    users_collection.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"is_banned": True}}
    )
    return {"message": "User banned successfully"}


# ----------------------------
# Get all users (admin)
# ----------------------------
@router.get("/users")
def get_all_users(admin=Depends(admin_only)):
    users = list(
        users_collection.find({}, {"password_hash": 0})
    )
    for u in users:
        u["_id"] = str(u["_id"])
    return users


# ----------------------------
# Get Admin Stats
# ----------------------------
@router.get("/stats")
def get_admin_stats(admin=Depends(admin_only)):
    total_users = users_collection.count_documents({})
    total_issues = issues_collection.count_documents({})
    resolved_issues = issues_collection.count_documents({"status": "Resolved"})
    verified_issues = issues_collection.count_documents({"status": "Verified"})
    active_issues = issues_collection.count_documents({"status": "Active"})

    recent_issues = list(issues_collection.find({}, {"_id": 1, "title": 1, "issue_type": 1, "status": 1, "created_at": 1, "user_id": 1}).sort("created_at", -1).limit(5))
    for r in recent_issues:
        r["_id"] = str(r["_id"])

    return {
        "total_users": total_users,
        "total_issues": total_issues,
        "resolved_issues": resolved_issues,
        "verified_issues": verified_issues,
        "active_issues": active_issues,
        "recent_issues": recent_issues
    }
