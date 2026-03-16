from fastapi import FastAPI
from app.routes import auth, issues, users, admin
from app.routes import issue_images
from fastapi.middleware.cors import CORSMiddleware

import os

app = FastAPI(
    title="SafeXCity API",
    description="Real-time civic issue reporting and monitoring platform",
    version="1.0.0",
)

# Allow CORS for frontend development server
allowed_origins = [
    "https://safexcity.vercel.app",
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
]

frontend_url = os.getenv("FRONTEND_URL")
if frontend_url:
    allowed_origins.append(frontend_url.rstrip("/"))

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check endpoint
@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "ok"}

# Register routers — issues, admin, and issue_images already define
# their own prefix inside APIRouter(), so no prefix here for those.
app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(issues.router)        # prefix="/issues" already in router
app.include_router(issue_images.router)  # prefix="/issues" already in router
app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(admin.router)         # prefix="/admin" already in router