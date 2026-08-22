<div align="center">
  <img src="https://raw.githubusercontent.com/roshand-official/Dayflow/main/frontend/public/favicon.svg" alt="DayFlow Logo" width="120" />

  <h1>DayFlow HRMS</h1>
  <p><strong>HR, without the busywork.</strong></p>

  <p>
    Built for the <strong>Odoo Hackathon at NMIT Bangalore</strong>.<br/>
    A premium, full-stack Human Resource Management System designed to automate tedious HR tasks and empower teams with actionable insights.
  </p>

  <div>
    <img src="https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
    <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI" />
    <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  </div>
</div>

---

## 🌟 The Problem
Modern HR teams are bogged down by spreadsheets, manual payroll processing, and disconnected attendance systems. Employees lack transparency regarding their leave balances and payslips, while managers struggle to assess coverage risks when approving time off.

## 💡 The Solution: DayFlow
DayFlow transforms HR operations into a seamless, automated experience. With a stunning glassmorphic UI, real-time alerts, and intelligent dashboards, DayFlow bridges the gap between employees and management.

### ✨ Key Features
- 🎯 **Attention Center**: AI-driven alerts for HR officers (e.g., late arrivals, leave overlaps, pending approvals).
- 🛡️ **Coverage Impact Panel**: Real-time calculation of department coverage risk when reviewing leave requests.
- 💰 **One-Click Payroll**: Automatically generate payslips for all active employees based on attendance and salary bands.
- 📅 **Smart Attendance**: Check-in/out tracking with automated weekly history aggregation.
- 🎨 **Glassmorphic UI**: Premium, modern aesthetics using a custom design system and fluid animations.
- 🔒 **Role-Based Access Control**: Secure JWT authentication ensuring data privacy across HR and Employee roles.
- ☁️ **Supabase Integration**: Robust remote database management and integrated Todos widget.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 powered by Vite
- **Styling**: Tailwind CSS & Vanilla CSS (Custom Glassmorphic Design System)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **API Client**: Axios

### Backend
- **Framework**: FastAPI (Python)
- **Database**: PostgreSQL (via Supabase) / SQLite (Fallback)
- **ORM**: SQLAlchemy
- **Authentication**: JWT & Passlib (Bcrypt)

---

## 🚀 Getting Started

### 1. Backend Setup
Navigate to the backend directory and set up the Python environment:
```bash
cd backend
python -m venv venv
# Activate the virtual environment
venv\Scripts\activate   # On Windows
# source venv/bin/activate # On macOS/Linux

# Install dependencies
pip install -r requirements.txt
```

**Database Configuration**:
By default, the backend uses a local SQLite database (`dayflow.db`). To connect to Supabase PostgreSQL, open `backend/.env` and configure your `DATABASE_URL`.

**Run the Server**:
```bash
python main.py
# The API will be available at http://localhost:8000
```
*Note: The database is automatically created and seeded with mock employees, attendance history, and leave requests on the first run.*

### 2. Frontend Setup
Navigate to the frontend directory and install the Node modules:
```bash
cd frontend
npm install
```

**Supabase Configuration**:
Create a `.env` file in the `frontend/` directory with your Supabase credentials:
```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

**Run the App**:
```bash
npm run dev
# The App will be available at http://localhost:5173
```

---

## 🔐 Demo Credentials

Use the following credentials to explore the platform:

| Role | Email | Password |
|------|-------|----------|
| **HR Officer** | `hr@dayflow.com` | `dayflow123` |
| **Employee** | `ananya@dayflow.com` | `dayflow123` |

---

<div align="center">
  <i>Crafted with ❤️ for the Odoo Hackathon</i>
</div>
