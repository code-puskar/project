from fastapi import FastAPI
from app.routes import auth, issues, users, admin
from app.routes import issue_images
from fastapi.middleware.cors import CORSMiddleware

from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
import os

from app.database import setup_database
from app.utils.rate_limit import limiter

app = FastAPI(
    title="SafeXCity API",
    description="Real-time civic issue reporting and monitoring platform",
    version="1.0.0",
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

@app.on_event("startup")
def startup_event():
    setup_database()

# Production + common dev origins; regex covers Vite ports and IPv6 localhost
allowed_origins = [
    "https://safexcity.vercel.app",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
    "http://127.0.0.1:5175",
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "http://[::1]:5173",
    "http://[::1]:5174",
    "http://[::1]:5175",
]

frontend_url = os.getenv("FRONTEND_URL")
if frontend_url:
    allowed_origins.append(frontend_url.rstrip("/"))

# CORS must be outermost so OPTIONS preflight is answered before rate limiting
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=r"^https?://(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(SlowAPIMiddleware)

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
