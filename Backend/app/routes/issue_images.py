from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, Request
from bson import ObjectId
import os, uuid
from app.utils.exif import extract_gps
from app.database import issues_collection
from app.dependencies.auth import get_current_user
from app.utils.distance import calculate_distance
from app.utils.rate_limit import limiter
from app.utils.ai_validator import validate_image_content

router = APIRouter(prefix="/issues", tags=["Issue Images"])

UPLOAD_DIR = "app/uploads/issues"
MAX_DISTANCE_METERS = 100
MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024  # 10MB
ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png"}

os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/{issue_id}/upload-image")
@limiter.limit("10/hour")
def upload_issue_image(
    request: Request,
    issue_id: str,
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    issue = issues_collection.find_one({"_id": ObjectId(issue_id)})

    if not issue:
        raise HTTPException(404, "Issue not found")

    # 🔐 Only reporter can upload
    if issue["user_id"] != current_user["user_id"]:
        raise HTTPException(
            status_code=403,
            detail="Only the issue reporter can upload images"
        )

    # 🛡️ File type validation
    ext = file.filename.split(".")[-1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(400, "Only image files are allowed")

    # 📏 File size validation
    contents = file.file.read()
    if len(contents) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(400, "File size exceeds 10MB limit")

    # 💾 Save file
    filename = f"{uuid.uuid4()}.{ext}"
    file_path = os.path.join(UPLOAD_DIR, filename)

    with open(file_path, "wb") as f:
        f.write(contents)

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

    # 🤖 AI Image Validation
    is_valid, reason = validate_image_content(file_path)
    if not is_valid:
        os.remove(file_path)
        raise HTTPException(
            status_code=400,
            detail=f"AI Monitor: {reason}"
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
