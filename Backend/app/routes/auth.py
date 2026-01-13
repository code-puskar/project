from fastapi import APIRouter, HTTPException
from app.database import users_collection
from app.models.user import UserRegister, UserLogin
from app.utils.security import hash_password, verify_password
from app.utils.jwt import create_access_token

router = APIRouter()

@router.post("/register")
def register(user: UserRegister):
    if users_collection.find_one({"email": user.email}):
        raise HTTPException(400, "Email already exists")

    users_collection.insert_one({
        "name": user.name,
        "email": user.email,
        "password_hash": hash_password(user.password),  # hashing later
        "role": "user",
        "reputation": 0
    })
    return {"message": "User registered"}
@router.post("/login")
def login(user: UserLogin):
    db_user = users_collection.find_one({"email": user.email})

    if not db_user:
        raise HTTPException(status_code=400, detail="Invalid credentials")

    if not verify_password(user.password, db_user["password_hash"]):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    token = create_access_token({
        "user_id": str(db_user["_id"]),
        "email": db_user["email"],
        "role": db_user["role"]
    })

    return {
        "access_token": token,
        "token_type": "bearer"
    }