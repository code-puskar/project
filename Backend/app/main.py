from fastapi import FastAPI
from app.routes import auth, issues, users, admin
from app.routes import issues
from app.routes import admin
from fastapi.middleware.cors import CORSMiddleware
from app.routes import issue_images



import os

app = FastAPI() 
# Allow CORS for frontend development server
# Adjust origins as needed for production
# Important because frontend and backend run on different ports during development

allowed_origins = [
    "https://safexcity.vercel.app/"
    "http://localhost:5173",  # React (Vite)
    "http://localhost:5174",  # Vite (different dev port)
    "http://localhost:5175",  # Vite (different dev port)
]

frontend_url = os.getenv("FRONTEND_URL")
if frontend_url:
    allowed_origins.append(frontend_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(admin.router)
app.include_router(issue_images.router)
app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(issues.router, prefix="/issues", tags=["Issues"])
app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(admin.router, prefix="/admin", tags=["Admin"])
app.include_router(issues.router)