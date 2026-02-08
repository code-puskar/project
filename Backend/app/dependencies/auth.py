from bson import ObjectId
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials, OAuth2PasswordBearer
from app.utils.jwt import verify_token
from app.database import users_collection
from jose import jwt, JWTError

security = HTTPBearer()

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    token = credentials.credentials
    payload = verify_token(token)


    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )

    # ✅ Extract user id from token
    user_id = payload.get("user_id")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload"
        )

    # ✅ Fetch user from MongoDB
    user = users_collection.find_one({"_id": ObjectId(user_id)})

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    # ✅ Check banned status
    if user.get("is_banned", False):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your account is banned"
        )

    # ✅ Return user info (or payload if you want lightweight)
    return{
    "user_id": str(user["_id"]),
    "email": user["email"],
    "role": user.get("role", "user")
}

