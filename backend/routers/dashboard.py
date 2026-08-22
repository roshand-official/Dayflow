from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date
from database import get_db
from models.user import User
from models.employee import Employee
from models.attendance import Attendance
from models.leave import LeaveRequest
from models.payroll import Payslip
from schemas.alert import DashboardKPI
from services.auth_service import get_current_user

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])

@router.get("/kpis", response_model=DashboardKPI)
def get_dashboard_kpis(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Very simplified KPI aggregation for the demo
    today = date.today()
    
    total_employees = db.query(Employee).filter(Employee.status == "active").count()
    
    today_attendances = db.query(Attendance).filter(Attendance.date == today).all()
    present_count = sum(1 for a in today_attendances if a.status in ["present", "late"])
    absent_count = sum(1 for a in today_attendances if a.status == "absent")
    late_count = sum(1 for a in today_attendances if a.status == "late")
    
    on_leave = db.query(LeaveRequest).filter(
        LeaveRequest.status == "approved",
        LeaveRequest.date_from <= today,
        LeaveRequest.date_to >= today
    ).count()
    
    attendance_rate = round((present_count / total_employees) * 100, 1) if total_employees > 0 else 0
    
    if current_user.role == "hr_officer":
        pending_actions = db.query(LeaveRequest).filter(LeaveRequest.status == "pending").count()
    else:
        pending_actions = db.query(LeaveRequest).filter(
            LeaveRequest.employee_id == current_user.employee_id,
            LeaveRequest.status == "pending"
        ).count()
        
    current_period = f"{today.year}-{today.month:02d}"
    payslips = db.query(Payslip).filter(Payslip.period == current_period).all()
    total_payroll = sum(p.net_pay for p in payslips)
    
    return {
        "attendance_rate": attendance_rate,
        "total_employees": total_employees,
        "present_today": present_count,
        "absent_today": absent_count,
        "on_leave": on_leave,
        "pending_actions": pending_actions,
        "total_payroll": total_payroll,
        "payroll_processed_pct": 100.0 if payslips else 0.0,
        "late_today": late_count,
        "new_employees_month": 0
    }

@router.get("/activity")
def get_recent_activity(db: Session = Depends(get_db)):
    # Recent leave requests as activity
    recent_leaves = db.query(LeaveRequest).order_by(LeaveRequest.created_at.desc()).limit(5).all()
    activity = []
    for l in recent_leaves:
        activity.append({
            "id": l.id,
            "type": "leave",
            "title": f"Leave requested by {l.employee.full_name if l.employee else 'Unknown'}",
            "time": l.created_at.isoformat() if l.created_at else None,
            "status": l.status
        })
    return activity

from models.department import Department

@router.get("/coverage")
def get_department_coverage(db: Session = Depends(get_db)):
    today = date.today()
    departments = db.query(Department).all()
    
    coverage_data = []
    for dept in departments:
        team_size = db.query(Employee).filter(Employee.department_id == dept.id, Employee.status == "active").count()
        on_leave = db.query(LeaveRequest).join(Employee, LeaveRequest.employee_id == Employee.id).filter(
            Employee.department_id == dept.id,
            LeaveRequest.status == "approved",
            LeaveRequest.date_from <= today,
            LeaveRequest.date_to >= today
        ).count()
        
        pct = round(((team_size - on_leave) / team_size) * 100) if team_size > 0 else 100
        coverage_data.append({
            "department": dept.name,
            "coverage_pct": pct,
            "team_size": team_size,
            "on_leave": on_leave
        })
        
    return coverage_data
