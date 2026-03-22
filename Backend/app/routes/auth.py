from fastapi import APIRouter, HTTPException, Request
from app.database import users_collection
from app.utils.rate_limit import limiter
from app.models.user import UserRegister, UserLogin
from app.utils.security import hash_password, verify_password
from app.utils.jwt import create_access_token
from datetime import datetime, timezone
import re
import logging

logger = logging.getLogger(__name__)

router = APIRouter()


def validate_password_strength(password: str) -> tuple[bool, str]:
    """Validate password meets minimum strength requirements."""
    if len(password) < 8:
        return False, "Password must be at least 8 characters long"
    if not re.search(r'[A-Z]', password):
        return False, "Password must contain at least one uppercase letter"
    if not re.search(r'[a-z]', password):
        return False, "Password must contain at least one lowercase letter"
    if not re.search(r'[0-9]', password):
        return False, "Password must contain at least one number"
    return True, ""


@router.post("/register")
@limiter.limit("5/minute")
def register(request: Request, user: UserRegister):
    if users_collection.find_one({"email": user.email}):
        raise HTTPException(400, "Email already exists")

    # Validate password strength
    is_valid, reason = validate_password_strength(user.password)
    if not is_valid:
        raise HTTPException(400, reason)

    users_collection.insert_one({
        "name": user.name,
        "email": user.email,
        "password_hash": hash_password(user.password),
        "role": "user",
        "reputation": 0,
        "is_banned": False,
        "created_at": datetime.now(timezone.utc)
    })
    return {"message": "User registered"}


@router.post("/login")
@limiter.limit("10/minute")
def login(request: Request, user: UserLogin):
    db_user = users_collection.find_one({"email": user.email})

    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if db_user.get("is_banned", False):
        raise HTTPException(status_code=403, detail="Your account has been banned")

    if not verify_password(user.password, db_user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({
        "user_id": str(db_user["_id"]),
        "email": db_user["email"],
        "role": db_user["role"]
    })

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": str(db_user["_id"]),
            "name": db_user["name"],
            "email": db_user["email"],
            "role": db_user["role"],
            "reputation": db_user.get("reputation", 0)
        }
    }