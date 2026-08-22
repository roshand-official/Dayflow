"""DayFlow HRMS — Application Configuration."""

import os
from pathlib import Path
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

# Base directory
BASE_DIR = Path(__file__).resolve().parent

# Database
raw_db_url = os.getenv("DATABASE_URL", f"sqlite:///{BASE_DIR / 'dayflow.db'}")
if raw_db_url.startswith("postgres://"):
    raw_db_url = raw_db_url.replace("postgres://", "postgresql://", 1)
DATABASE_URL = raw_db_url

# JWT
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "dayflow-hackathon-secret-key-2026")
JWT_ALGORITHM = "HS256"
JWT_ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours for hackathon convenience

# CORS
CORS_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
]

# Business rules
SHIFT_START_HOUR = 9  # 9:00 AM
SHIFT_START_MINUTE = 0
GRACE_PERIOD_MINUTES = 15  # Late after 9:15 AM
HALF_DAY_THRESHOLD_HOURS = 4  # Less than 4h = half day
LATE_ALERT_THRESHOLD = 3  # >=3 late arrivals in 7 days triggers alert
APPROVAL_BACKLOG_HOURS = 48  # Pending >48h triggers alert
