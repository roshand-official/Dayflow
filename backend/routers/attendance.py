from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import date, datetime, timezone, timedelta
from typing import Optional
from database import get_db
from models.user import User
from models.attendance import Attendance
from schemas.attendance import AttendanceCheckIn, AttendanceCheckOut, AttendanceTodayResponse, AttendanceListResponse, AttendanceSummary
from services.auth_service import get_current_user
from middleware.rbac import require_hr_officer
from config import SHIFT_START_HOUR, SHIFT_START_MINUTE, GRACE_PERIOD_MINUTES, HALF_DAY_THRESHOLD_HOURS

router = APIRouter(prefix="/api/attendance", tags=["attendance"])

@router.get("/today", response_model=AttendanceTodayResponse)
def get_today_attendance(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not current_user.employee_id:
        raise HTTPException(status_code=400, detail="User is not linked to an employee profile")
        
    today = date.today()
    attendance = db.query(Attendance).filter(
        Attendance.employee_id == current_user.employee_id,
        Attendance.date == today
    ).first()
    
    if not attendance:
        return {
            "is_checked_in": False,
            "status": "absent",
            "worked_hours": 0.0
        }
        
    return {
        "is_checked_in": attendance.check_in is not None and attendance.check_out is None,
        "check_in": attendance.check_in,
        "check_out": attendance.check_out,
        "worked_hours": attendance.worked_hours,
        "status": attendance.status
    }

@router.post("/check-in")
def check_in(data: AttendanceCheckIn, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not current_user.employee_id:
        raise HTTPException(status_code=400, detail="User is not linked to an employee profile")
        
    today = date.today()
    now = datetime.now(timezone.utc)
    
    # Check if already checked in today
    existing = db.query(Attendance).filter(
        Attendance.employee_id == current_user.employee_id,
        Attendance.date == today
    ).first()
    
    if existing:
        if existing.check_in and not existing.check_out:
            raise HTTPException(status_code=400, detail="Already checked in")
        # Could be re-checking in after checking out, but simplified here:
        raise HTTPException(status_code=400, detail="Attendance record already exists for today")
        
    # Determine status based on shift start
    shift_start = datetime(now.year, now.month, now.day, SHIFT_START_HOUR, SHIFT_START_MINUTE, tzinfo=timezone.utc)
    grace_end = shift_start + timedelta(minutes=GRACE_PERIOD_MINUTES)
    
    status = "present"
    if now > grace_end:
        status = "late"
        
    attendance = Attendance(
        employee_id=current_user.employee_id,
        date=today,
        check_in=now,
        status=status,
        notes=data.notes
    )
    db.add(attendance)
    db.commit()
    db.refresh(attendance)
    
    return attendance

@router.post("/check-out")
def check_out(data: AttendanceCheckOut, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not current_user.employee_id:
        raise HTTPException(status_code=400, detail="User is not linked to an employee profile")
        
    today = date.today()
    now = datetime.now(timezone.utc)
    
    attendance = db.query(Attendance).filter(
        Attendance.employee_id == current_user.employee_id,
        Attendance.date == today
    ).first()
    
    if not attendance or not attendance.check_in:
        raise HTTPException(status_code=400, detail="Must check in first")
        
    if attendance.check_out:
        raise HTTPException(status_code=400, detail="Already checked out")
        
    attendance.check_out = now
    
    # Compute worked hours
    duration = now - attendance.check_in.replace(tzinfo=timezone.utc)
    hours = duration.total_seconds() / 3600
    attendance.worked_hours = round(hours, 2)
    
    if attendance.worked_hours < HALF_DAY_THRESHOLD_HOURS:
        attendance.status = "half_day"
        
    if data.notes:
        attendance.notes = f"{attendance.notes} | Checkout: {data.notes}" if attendance.notes else data.notes
        
    db.commit()
    db.refresh(attendance)
    return attendance

@router.get("/history", response_model=AttendanceListResponse)
def get_history(
    date_from: Optional[date] = None,
    date_to: Optional[date] = None,
    employee_id: Optional[int] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Attendance)
    
    # RBAC: Employees can only see their own history
    if current_user.role != "hr_officer":
        query = query.filter(Attendance.employee_id == current_user.employee_id)
    elif employee_id:
        query = query.filter(Attendance.employee_id == employee_id)
        
    if date_from:
        query = query.filter(Attendance.date >= date_from)
    if date_to:
        query = query.filter(Attendance.date <= date_to)
        
    query = query.order_by(Attendance.date.desc())
    records = query.all()
    
    # Format records with employee name
    formatted_records = []
    for r in records:
        formatted_records.append({
            "id": r.id,
            "employee_id": r.employee_id,
            "employee_name": r.employee.full_name if r.employee else None,
            "date": r.date,
            "check_in": r.check_in,
            "check_out": r.check_out,
            "worked_hours": r.worked_hours,
            "status": r.status,
            "notes": r.notes or ""
        })
    
    # Compute summary
    summary = None
    if records:
        total_days = len(records)
        present = sum(1 for r in records if r.status in ["present", "late"])
        summary = {
            "total_days": total_days,
            "present": present,
            "absent": sum(1 for r in records if r.status == "absent"),
            "late": sum(1 for r in records if r.status == "late"),
            "half_day": sum(1 for r in records if r.status == "half_day"),
            "on_leave": sum(1 for r in records if r.status == "leave"),
            "wfh": sum(1 for r in records if r.status == "wfh"),
            "attendance_rate": round((present / total_days) * 100, 1) if total_days > 0 else 0
        }
        
    return {"records": formatted_records, "summary": summary, "total": len(formatted_records)}
