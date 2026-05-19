# SafeXCity Deployment Guide

This guide explains how to deploy the FastAPI backend and Vite React frontend.

## 1. Backend Deployment

Recommended platforms:

- Render
- Railway
- Any VPS/container host that supports Python

### Render Setup

1. Create a Render account.
2. Create a new Web Service.
3. Connect the GitHub repository.
4. Set Root Directory to `Backend`.
5. Set Environment to Python 3.
6. Build command:

```bash
pip install -r requirements.txt
```

7. Start command:

```bash
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

8. Add environment variables:

```env
MONGO_URL=mongodb+srv://...
JWT_SECRET=replace_with_a_long_random_secret
OPENROUTER_API_KEY=optional_openrouter_key
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

9. Deploy and test:

```text
https://your-backend-domain.onrender.com/health
https://your-backend-domain.onrender.com/docs
```

## 2. Frontend Deployment

Recommended platforms:

- Vercel
- Netlify

### Vercel Setup

1. Create a Vercel account.
2. Import the GitHub repository.
3. Set Root Directory to `Front`.
4. Use Vite defaults:
   - Build command: `npm run build`
   - Output directory: `dist`
5. Add environment variables:

```env
VITE_API_URL=https://your-backend-domain.onrender.com
VITE_MAPBOX_TOKEN=your_mapbox_token
VITE_CESIUM_ION_TOKEN=optional_cesium_token
```

6. Deploy.

## 3. CORS Checklist

The backend allows:

- `https://safexcity.vercel.app`
- `http://localhost:5173`
- `http://localhost:5174`
- `http://localhost:5175`
- The value of `FRONTEND_URL`, if set

For production, set `FRONTEND_URL` to the deployed frontend URL.

## 4. Database Checklist

Use MongoDB Atlas for hosted deployment.

Required indexes are created at backend startup:

- Unique index on `users.email`
- 2dsphere index on `issues.location.coordinates`

## 5. Pre-Deployment Verification

Run these locally before deployment:

```bash
cd Front
npm run lint
npm run build

cd ..
python -m compileall Backend\app
```

## 6. Production Hardening Checklist

Before a real public launch:

- Add automated backend tests.
- Add frontend integration tests.
- Add CI/CD checks for lint, build, and tests.
- Store uploads in S3, Cloudinary, or another object store.
- Add structured logs and error monitoring.
- Configure deployment request-size limits.
- Add a backup policy for MongoDB Atlas.
- Remove generated cache files from version control.
