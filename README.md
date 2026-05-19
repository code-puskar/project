# SafeXCity - Smart City Mapping System

SafeXCity is a full-stack civic issue reporting platform for citizens and city administrators. Citizens can report nearby public infrastructure issues on an interactive map, while administrators can monitor, moderate, ban abusive users, and resolve verified reports.

## What The Project Solves

Cities often receive civic complaints through scattered, slow, or manual channels. SafeXCity centralizes that workflow into a map-first system:

- Citizens report issues at a real location.
- The backend rejects duplicate nearby reports.
- AI validation checks whether text and images are relevant.
- Other users validate legitimate issues.
- Admins monitor, moderate, and resolve issues from a dedicated dashboard.

## Core Features

- Interactive Mapbox and Deck.gl map with issue markers.
- Location-aware reporting with a distance limit from the user's current position.
- Road-surface click validation using rendered map features.
- JWT authentication with user/admin roles.
- User reputation for reporting and validating issues.
- Duplicate issue detection using MongoDB geospatial queries.
- AI text validation through OpenRouter.
- AI image validation with EXIF GPS matching.
- Admin dashboard for users, issue moderation, and statistics.
- Route planning and nearby issue alerts.
- Responsive landing page and mobile-oriented controls.

## Tech Stack

### Frontend

- React 19
- Vite / Rolldown Vite
- React Router
- Tailwind CSS
- Mapbox GL / React Map GL
- Deck.gl
- Three.js / React Three Fiber
- Framer Motion
- Axios

### Backend

- FastAPI
- MongoDB with PyMongo
- Pydantic
- Python JOSE JWT
- Passlib Argon2 password hashing
- SlowAPI rate limiting
- Pillow and EXIF utilities
- OpenRouter AI validation

### Database

- MongoDB
- 2dsphere geospatial index on issue locations
- Unique index on user email

## Repository Structure

```text
Backend/
  app/
    main.py                 FastAPI app, middleware, router registration
    database.py             MongoDB connection and indexes
    routes/                 API route modules
    dependencies/           Auth and admin guards
    models/                 Auth request models
    schemas/                Issue validation schemas
    utils/                  JWT, password hashing, AI, EXIF, distance, rate limit
Front/
  src/
    App.jsx                 App routing and main state coordination
    services/api.js         Axios API client
    pages/                  Landing, dashboard, login, admin pages
    components/             Map, issue, auth, drawer, and landing components
```

## Environment Variables

### Backend

Create `Backend/.env`:

```env
MONGO_URL=mongodb://localhost:27017/SmartCityDB
JWT_SECRET=replace_with_a_long_random_secret
OPENROUTER_API_KEY=optional_openrouter_key
FRONTEND_URL=http://localhost:5173
```

### Frontend

Create `Front/.env`:

```env
VITE_API_URL=http://localhost:8000
VITE_MAPBOX_TOKEN=your_mapbox_token
VITE_CESIUM_ION_TOKEN=optional_cesium_token
```

If `OPENROUTER_API_KEY` is not set, text validation rejects reports because the text validator is strict. Image validation currently fails open when the AI service is unavailable.

## Local Setup

### Backend

```bash
cd Backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Backend health check:

```text
GET http://localhost:8000/health
```

FastAPI docs:

```text
http://localhost:8000/docs
```

### Frontend

```bash
cd Front
npm install
npm run dev
```

Frontend default URL:

```text
http://localhost:5173
```

## Verification Commands

The project was checked with:

```bash
cd Front
npm run lint
npm run build

cd ..
python -m compileall Backend\app

cd Backend
$env:JWT_SECRET='local-test-secret'; $env:MONGO_URL='mongodb://localhost:27017/SmartCityDB'; python -c "from app.main import app; print(app.title)"
```

Current status:

- Frontend production build: passes.
- Frontend lint: passes with warnings about React hook dependency arrays.
- Backend syntax compile check: passes.
- Backend app import check with local environment overrides: passes.

## Main API Endpoints

### Auth

- `POST /auth/register`
- `POST /auth/login`

### User

- `GET /users/me`

### Issues

- `GET /issues/`
- `POST /issues/`
- `GET /issues/nearby`
- `POST /issues/{issue_id}/validate`
- `POST /issues/{issue_id}/resolve`
- `GET /issues/alerts/nearby`
- `POST /issues/{issue_id}/upload-image`

### Admin

- `GET /admin/stats`
- `GET /admin/issues`
- `DELETE /admin/issues/{issue_id}`
- `GET /admin/users`
- `POST /admin/users/{user_id}/ban`
- `POST /admin/users/{user_id}/unban`

## Presentation Documents

Use these files when preparing for judges:

- `PROJECT_DOCUMENTATION.md`: architecture, workflows, module explanations, API summary, and judge Q&A.
- `PRODUCTION_REVIEW.md`: design/code audit, what is production-ready, current risks, and improvement roadmap.
- `Deployment_Guide.md`: deployment steps for Render/Railway and Vercel/Netlify.

## Production Readiness Summary

The project is suitable for a strong academic/demo presentation because it has a real full-stack architecture, authentication, geospatial indexing, validation logic, rate limiting, admin flows, and a production build. Before using it as a real public municipal platform, prioritize automated backend tests, frontend integration tests, stronger observability, file hosting for uploaded images, CI/CD, bundle splitting, and cleanup of committed cache files.
