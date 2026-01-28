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
