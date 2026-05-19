# SafeXCity Project Documentation

## 1. Executive Summary

SafeXCity is a smart city issue reporting system. It allows citizens to report civic issues such as potholes, garbage, broken lights, and water problems directly on a live map. The platform combines user authentication, geospatial validation, AI moderation, reputation scoring, and an admin dashboard.

The project demonstrates a practical civic-tech workflow:

1. A citizen logs in.
2. The app detects the user's current location.
3. The citizen clicks a nearby road location on the map.
4. The backend checks for duplicate nearby issues.
5. AI validates the issue description.
6. The issue appears on the map.
7. Other users validate it.
8. Admins monitor and resolve verified issues.

## 2. Problem Statement

Traditional civic complaint systems are often slow, fragmented, and difficult to track. Citizens may not know where to report problems, and authorities may not get a real-time location-based view of city issues.

SafeXCity addresses this by making civic reporting:

- Location-based.
- Transparent.
- Moderated.
- Scalable.
- Easy to visualize.

## 3. System Architecture

```text
Citizen / Admin Browser
        |
        v
React + Vite Frontend
        |
        v
Axios REST API calls
        |
        v
FastAPI Backend
        |
        v
MongoDB Database
        |
        v
OpenRouter AI validation and Mapbox services
```

### Frontend Responsibilities

- Render the landing page and map dashboard.
- Manage login/register modals.
- Store JWT token in local storage.
- Send authenticated API requests.
- Display issues as Deck.gl map layers.
- Track user geolocation.
- Search locations and calculate routes with Mapbox.
- Show admin pages for issue and user management.

### Backend Responsibilities

- Authenticate users with JWT.
- Hash passwords using Argon2.
- Enforce role-based admin access.
- Validate and create issue reports.
- Run duplicate detection with MongoDB geospatial queries.
- Maintain issue validation and reputation logic.
- Validate uploaded images using EXIF GPS and AI.
- Expose admin statistics and moderation endpoints.

### Database Responsibilities

MongoDB stores:

- Users.
- Issues.
- Validation metadata.
- Image references.
- Reputation and moderation status.

MongoDB is appropriate here because issue records are document-shaped and the project relies on geospatial queries through a 2dsphere index.

## 4. Important Modules

### Backend

`Backend/app/main.py`

- Creates the FastAPI application.
- Adds CORS middleware.
- Adds SlowAPI rate-limiting middleware.
- Registers auth, issue, image, user, and admin routers.
- Runs database index setup on startup.

`Backend/app/database.py`

- Connects to MongoDB.
- Exposes `users_collection`, `issues_collection`, and `validations_collection`.
- Creates indexes for unique emails and geospatial issue lookup.

`Backend/app/routes/auth.py`

- Handles registration and login.
- Enforces password strength.
- Hashes passwords.
- Issues JWT tokens.
- Blocks banned users from login.

`Backend/app/routes/issues.py`

- Creates new reports.
- Prevents duplicate nearby active reports.
- Validates report text with AI.
- Lists issues with optional bounding-box filters.
- Handles user validation and issue resolution.
- Adds reputation points when issues are verified.

`Backend/app/routes/issue_images.py`

- Accepts image uploads from the original reporter.
- Validates file type and size.
- Extracts GPS metadata.
- Verifies that image GPS is near the issue location.
- Uses AI vision validation for image relevance.

`Backend/app/routes/admin.py`

- Provides admin-only issue management.
- Provides user search and ban/unban actions.
- Provides dashboard statistics.

`Backend/app/dependencies/auth.py`

- Reads the bearer token.
- Verifies JWT payload.
- Loads the user from MongoDB.
- Rejects missing, expired, invalid, or banned users.

`Backend/app/dependencies/admin.py`

- Ensures the current user has admin role.

### Frontend

`Front/src/App.jsx`

- Coordinates landing, dashboard, auth modals, issue modal, and issue drawer.
- Hydrates auth state from local storage.
- Fetches the current user profile.
- Handles issue creation and issue refresh.

`Front/src/services/api.js`

- Creates the Axios client.
- Uses `VITE_API_URL` when available.
- Adds bearer token to requests automatically.

`Front/src/components/MapView.jsx`

- Tracks live user location.
- Fetches issues from the backend.
- Polls issues periodically.
- Shows nearby issue alerts.
- Handles route planning and map controls.
- Passes clean map state into `DeckMap`.

`Front/src/components/DeckMap.jsx`

- Renders the Mapbox map.
- Renders Deck.gl issue markers and route paths.
- Handles marker hover and marker click.
- Checks rendered map features to reduce invalid non-road reports.

`Front/src/components/IssueModal.jsx`

- Collects issue type, description, rating, and location.
- Submits issue creation requests.

`Front/src/components/IssueDrawer.jsx`

- Displays issue details.
- Allows eligible users to validate an issue.

`Front/src/pages/admin/*`

- Implements admin dashboard, issue management, and user management.

## 5. Data Flow: Login

1. User submits email and password.
2. Frontend sends `POST /auth/login`.
3. Backend finds user by email.
4. Backend checks password hash.
5. Backend creates a JWT with user id, email, and role.
6. Frontend stores `access_token`.
7. Axios interceptor attaches the token to future requests.
8. Frontend calls `/users/me` to load profile and role.

## 6. Data Flow: Issue Reporting

1. User clicks the map.
2. Frontend checks distance from current GPS position.
3. Frontend asks `DeckMap` whether the click appears to be on a road.
4. Issue modal opens.
5. User submits details.
6. Backend checks for duplicate active issue within 100 meters.
7. Backend sends description and type to AI validation.
8. Backend stores the issue as `Active`.
9. Frontend refreshes issue markers.

## 7. Data Flow: Validation and Reputation

1. A different user opens an issue drawer.
2. User clicks validate.
3. Backend prevents self-validation and repeated validation.
4. Backend increments validation count.
5. If the issue reaches the verify threshold, status changes to `Verified`.
6. Validator gains reputation.
7. Reporter gains reputation when the issue becomes verified.

## 8. Security Design

Implemented:

- JWT bearer authentication.
- Argon2 password hashing.
- Password strength validation.
- Role-based admin routes.
- Banned user checks.
- Rate limits on sensitive endpoints.
- CORS allowlist.
- File type and file size checks for image upload.
- EXIF GPS verification for uploaded evidence.

Recommended next steps:

- Add refresh tokens or shorter-lived access tokens.
- Add structured security logging.
- Add automated tests for auth and admin authorization.
- Store uploaded images in object storage rather than local disk.
- Add request body size limits at the deployment layer.

## 9. Design And UX Evaluation

Strengths:

- The product opens with a polished civic-tech landing page.
- The dashboard is map-first, which matches the domain.
- Controls are compact and suited to repeat use.
- Mobile bottom controls make filters easier to reach.
- The admin area separates operational workflows from citizen workflows.
- Marker colors and drawer status make issue states scannable.

Areas to improve:

- Add stronger accessibility labels for custom icon buttons.
- Reduce visual density in some map overlays.
- Add skeleton/loading states instead of plain text fallback.
- Add a public design token document for color, spacing, radius, and typography.
- Split heavy map/3D libraries so initial loading is faster.

## 10. Production Readiness

Already strong:

- Clean separation between frontend and backend.
- Modular FastAPI route structure.
- Environment-driven configuration.
- Geospatial indexing.
- Rate limiting.
- Authentication and authorization.
- Production frontend build succeeds.
- Backend syntax compile check succeeds.

Needs hardening before real public launch:

- Automated tests.
- CI pipeline.
- Error monitoring.
- Request logging.
- Bundle splitting.
- Image hosting.
- Database migration/index management strategy.
- Removal of generated cache files from version control.

## 11. Judge Q&A

### Why did you use FastAPI?

FastAPI is fast, Python-native, and gives automatic OpenAPI documentation. It is a good fit because the backend includes validation, authentication, and AI integration, all of which are easy to express in Python.

### Why MongoDB instead of SQL?

Issues are document-like records with location, status, validations, images, and metadata. MongoDB also supports 2dsphere indexes, which makes nearby and bounding-box geospatial queries straightforward.

### How do you prevent fake reports?

The system uses multiple layers: users must be authenticated, reports must be near the user's current location, clicks are checked against map road features, duplicate reports are blocked, descriptions are AI validated, and images are checked with EXIF GPS plus AI vision validation.

### How do you prevent duplicate issues?

When an issue is created, the backend searches for an active issue of the same type within a 100 meter radius using MongoDB's `$near` geospatial query. If one exists, the new report is rejected.

### How does reputation work?

Users gain reputation for useful participation. Validators receive points when they validate someone else's report. The original reporter receives points when enough validations move the issue into a verified state.

### What is role-based access control here?

Normal users can report and validate issues. Admin users can view all users, ban/unban accounts, delete abusive issues, and review operational statistics. Admin routes are protected by an `admin_only` dependency.

### How does image verification work?

Only the reporter can upload images for their issue. The backend checks file type and size, extracts GPS metadata, confirms the image was taken near the issue, then sends the image to AI validation.

### What happens if AI is unavailable?

Text validation currently fails closed, meaning the report is rejected if text AI validation is unavailable. Image validation fails open, meaning image upload is allowed if the image AI service fails. This is a deliberate reliability tradeoff, but it should be tuned for the final deployment policy.

### How does the map render many points?

Deck.gl renders issue markers as WebGL layers, which is more scalable than rendering many DOM markers. Mapbox provides the base map and features; Deck.gl handles custom overlays.

### Why is this project scalable?

The frontend and backend are separate deployable units. Backend routes are modular. MongoDB geospatial indexes support location queries. Heavy UI rendering is delegated to WebGL libraries. Environment variables allow separate development and production settings.

### What would you improve next?

I would add automated tests, CI/CD, chunk splitting for map libraries, better observability, persistent object storage for uploaded images, and stronger accessibility testing.

## 12. Suggested Presentation Script

Good morning respected judges. My project is SafeXCity, a smart city mapping system for reporting and managing civic issues in real time.

The problem I am addressing is that civic complaints are often reported through slow or scattered channels. Citizens do not always know where to report problems, and authorities do not always get a live location-based overview.

SafeXCity solves this with a map-first platform. A citizen can log in, click a nearby road location, submit the issue details, and see it appear on the map. The backend validates the report, checks for duplicates, and stores it in MongoDB with geospatial indexing. Other users can validate the issue, and admins can monitor or resolve it from a dedicated dashboard.

Technically, the frontend is built with React, Vite, Tailwind CSS, Mapbox, and Deck.gl. The backend is built with FastAPI, MongoDB, JWT authentication, Argon2 password hashing, rate limiting, and AI validation through OpenRouter.

The strongest part of the project is that it is not only a UI demo. It includes real backend workflows: authentication, role-based access, duplicate detection, AI moderation, image GPS validation, reputation scoring, and admin moderation.

In the future, I would add automated tests, CI/CD, analytics, object storage for uploaded files, and deeper accessibility improvements. This would make it ready for a real public pilot.
