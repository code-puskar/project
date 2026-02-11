🌍 Smart City Mapping System

A real-time civic issue reporting and monitoring platform built with a modern full-stack architecture.

🚀 Overview
The Smart City Mapping System is a full-stack web application that enables citizens to report, track, and manage civic issues in real-time using an interactive map interface.

**It empowers:**

🧑 Citizens to report issues (potholes, garbage, streetlight failures, etc.)

🏛️ Administrators to monitor and resolve complaints

📊 Authorities to visualize issue density and trends

This system is designed with scalability, clean architecture, and real-world deployment readiness in mind.

**✨ Key Features**
🗺️ Interactive Map Integration

Real-time issue plotting using Leaflet

Dynamic markers based on issue severity

Click-to-report functionality

**🔐 Authentication & Authorization**

JWT-based secure login

Role-based access control (Citizen / Admin)

Protected routes

**📝 Issue Management**

Create, update, delete issues

Status tracking (Pending / In Progress / Resolved)

Admin moderation system

**📊 Dashboard Analytics**

Issue counts by status

Heatmap-style visualization

Filter by category and severity

**⚡ Clean RESTful API**

Structured endpoints

Proper HTTP status codes

Modular route organization

**🏗️ Architecture**

Frontend (React + Vite)
        ↓
REST API (FastAPI)
        ↓
Database (PostgreSQL)

**Backend Structure**
app/
 ├── routers/
 │   ├── auth.py
 │   ├── issues.py
 ├── models/
 ├── schemas/
 ├── dependencies/
 ├── database.py
 └── main.py

**🛠️ Tech Stack**
**Frontend:**
React
Vite
React 
Leaflet/Mapbox
Axios
Tailwind CSS

**Backend**

FastAPI
SQLAlchemy
Pydantic
JWT Authentication

**Database**
PostgreSQL

📦 Installation
1️⃣ Clone Repository
git clone https://github.com/your-username/smart-city-mapping.git
cd smart-city-mapping

**2️⃣ Backend Setup**

cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt


Create .env file:

DATABASE_URL=postgresql://user:password@localhost/dbname
SECRET_KEY=your_secret_key


Run server:

uvicorn app.main:app --reload

3️⃣ Frontend Setup
cd frontend
npm install
npm run dev

**🔐 Environment Variables**

Variable	Description
DATABASE_URL	PostgreSQL connection string
SECRET_KEY	JWT signing key
ACCESS_TOKEN_EXPIRE_MINUTES	Token expiration time
📡 API Endpoints (Sample)
Auth

POST /register

POST /login

Issues

GET /issues

POST /issues

PUT /issues/{id}

DELETE /issues/{id}

**🧠 Design Principles**

Clean Architecture
Separation of Concerns
Reusable Components
Secure Authentication
Production-ready structure

**📈 Future Improvements**

📍 Heatmap density visualization
📱 Mobile responsiveness improvements
📨 Email notifications
📊 Advanced analytics dashboard
🚀 Dockerized deployment

**🤝 Contributing**
Pull requests are welcome.
For major changes, please open an issue first to discuss proposed changes.

**📜 License**
This project is licensed under the MIT License.

👨‍💻 Author

Puskar Debnath
Full Stack Developer | React | FastAPI | Systems Thinking
