# DayFlow HRMS

> HR, without the busywork.

DayFlow is a premium, full-stack HR Management System built for the Odoo Hackathon at NMIT Bangalore. 
It features a modern, glassmorphic UI, real-time alerts, and a production-ready backend.

## Tech Stack
- **Frontend**: React 18, Vite, Framer Motion, Tailwind CSS (for layout utilities), Lucide React
- **Backend**: FastAPI, SQLAlchemy, SQLite (swappable to Postgres)
- **Auth**: JWT with Role-Based Access Control (RBAC)

## Getting Started

### 1. Backend Setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python main.py
```
*Note: The database is automatically created and seeded with 25 employees, attendance history, and leave requests on first run.*

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Demo Credentials
| Role | Email | Password |
|------|-------|----------|
| **HR Officer** | hr@dayflow.com | dayflow123 |
| **Employee** | ananya@dayflow.com | dayflow123 |

## Key Features
- **Attention Center**: AI-driven alerts for HR (late arrivals, leave overlap, pending approvals)
- **Coverage Impact Panel**: Real-time calculation of department coverage risk when reviewing leave.
- **Glassmorphic UI**: Premium aesthetics using DayFlow's custom design system.
