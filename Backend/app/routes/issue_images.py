from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from bson import ObjectId
import os, uuid

from app.database import issues_collection
from app.dependencies.auth import get_current_user
from app.utils.exif import extract_gps
from app.utils.distance import calculate_distance

router = APIRouter(prefix="/issues", tags=["Issue Images"])

UPLOAD_DIR = "app/uploads/issues"
MAX_DISTANCE_METERS = 100
ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png"}

os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/{issue_id}/upload-image")
def upload_issue_image(
    issue_id: str,
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    issue = issues_collection.find_one({"_id": ObjectId(issue_id)})

    if not issue:
        raise HTTPException(404, "Issue not found")

    # 🔐 Optional: only reporter can upload
    if issue["user_id"] != current_user["_id"]:
        raise HTTPException(
            status_code=403,
            detail="Only the issue reporter can upload images"
        )

    # 🛡️ File type validation
    ext = file.filename.split(".")[-1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(400, "Only image files are allowed")

    # 💾 Save file
    filename = f"{uuid.uuid4()}.{ext}"
    file_path = os.path.join(UPLOAD_DIR, filename)

    with open(file_path, "wb") as f:
        f.write(file.file.read())

    # 📍 Extract GPS
    gps = extract_gps(file_path)
    if not gps:
        os.remove(file_path)
        raise HTTPException(400, "Image does not contain GPS data")

    img_lat, img_lng = gps
    issue_lng, issue_lat = issue["location"]["coordinates"]

    # 📏 Distance verification
    distance = calculate_distance(
        img_lat,
        img_lng,
        issue_lat,
        issue_lng
    )

    if distance > MAX_DISTANCE_METERS:
        os.remove(file_path)
        raise HTTPException(
            400,
            "Image location does not match issue location"
        )

    # ✅ Save image reference
    issues_collection.update_one(
        {"_id": ObjectId(issue_id)},
        {"$push": {"images": filename}}
    )

    return {
        "message": "Image uploaded & verified successfully",
        "distance_meters": round(distance, 2)
    }
