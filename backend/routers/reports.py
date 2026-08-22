from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date, timedelta
from database import get_db
from models.user import User
from models.attendance import Attendance
from models.leave import LeaveRequest, LeaveType
from middleware.rbac import require_hr_officer

router = APIRouter(prefix="/api/reports", tags=["reports"])

@router.get("/attendance-trend")
def get_attendance_trend(current_user: User = Depends(require_hr_officer), db: Session = Depends(get_db)):
    today = date.today()
    start_date = today - timedelta(days=6)
    
    records = db.query(Attendance).filter(Attendance.date >= start_date).all()
    
    # Group by date
    days_data = {}
    for i in range(7):
        d = start_date + timedelta(days=i)
        days_data[d] = {"name": d.strftime("%a"), "present": 0, "late": 0, "absent": 0}
        
    for r in records:
        if r.date in days_data:
            if r.status == "present":
                days_data[r.date]["present"] += 1
            elif r.status == "late":
                days_data[r.date]["late"] += 1
            elif r.status == "absent":
                days_data[r.date]["absent"] += 1
                
    return list(days_data.values())

@router.get("/leave-utilization")
def get_leave_utilization(current_user: User = Depends(require_hr_officer), db: Session = Depends(get_db)):
    leave_types = db.query(LeaveType).all()
    data = []
    
    for lt in leave_types:
        days_used = db.query(func.sum(LeaveRequest.days)).filter(
            LeaveRequest.leave_type_id == lt.id,
            LeaveRequest.status == "approved"
        ).scalar() or 0
        
        if days_used > 0:
            data.append({
                "name": lt.name,
                "value": int(days_used)
            })
            
    if not data:
        # Fallback if no leaves approved yet
        return [
            {"name": "Paid Leave", "value": 1},
            {"name": "Sick Leave", "value": 1}
        ]
        
    return data
