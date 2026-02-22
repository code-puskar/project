# Backend and Frontend Deployment Guide

This guide covers deploying your FastAPI Backend and React (Vite) Frontend. 

## 1. Backend Deployment (Render or Railway)

Since your backend uses Python (FastAPI) and MongoDB Atlas, setting it up on Render or Railway is the easiest approach.

**Deploying on Render:**
1. Create an account on [Render](https://render.com/).
2. Click **New +** and select **Web Service**.
3. Connect your GitHub repository containing this code.
4. Render might ask you for a root directory. If your backend is inside `Backend/`, set the **Root Directory** to `Backend/`.
5. **Environment**: Select `Python 3`.
6. **Build Command**: `pip install -r requirements.txt` *(Make sure to run `pip freeze > requirements.txt` inside your Backend folder if you haven't already!)*
7. **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
8. **Environment Variables**: Click "Advanced" and add the following variables:
   - `MONGO_URL`: Your MongoDB connected string (e.g. `mongodb+srv://...`)
   - `JWT_SECRET`: A very long, random string for signing JWT tokens.
   - `FRONTEND_URL`: The URL of your deployed frontend (e.g., `https://my-smart-city.vercel.app`) to allow CORS.
9. Click **Create Web Service**. Wait a few minutes for the build to finish. Your API will be live at `https://your-app-name.onrender.com`.

## 2. Frontend Deployment (Vercel or Netlify)

Vercel is generally the best tool for deploying Vite React applications.

**Deploying on Vercel:**
1. Create an account on [Vercel](https://vercel.com/) and connect your GitHub.
2. Click **Add New -> Project** and import your repository.
3. Keep the **Root Directory** as `Front`.
4. The Build & Development Settings will automatically default to Vite.
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. **Environment Variables**: Add your frontend API keys here.
   - `VITE_MAPBOX_TOKEN`: Your Mapbox Token
   - `VITE_CESIUM_ION_TOKEN`: Your Cesium Ion Token
6. **Update API URL**: Currently, your frontend probably calls `http://localhost:8000`. You will need to change this inside your `src/services/api.js` (or wherever you make Axios/Fetch calls) to point to your new backend URL from Render (e.g. `https://your-app-name.onrender.com`).
   - *Tip: You can use a `.env` variable for this on your frontend, like `VITE_API_BASE_URL`!*
7. Click **Deploy**. Vercel will build and launch your frontend.

### Final Checklist ✅
1. **Backend**: Deployed, running on Render, with valid `MONGO_URL`, `JWT_SECRET` and `FRONTEND_URL` environment variables set.
2. **Frontend**: Deployed on Vercel, Mapbox/Cesium tokens added, and API endpoints updated to hit your new Render URL instead of `localhost:8000`.
3. **CORS**: Backend is configured to accept requests from your Vercel URL.
