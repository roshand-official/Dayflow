from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import date, datetime, timezone
from database import get_db
from models.user import User
from models.leave import LeaveType, LeaveRequest, LeaveBalance
from models.employee import Employee
from schemas.leave import LeaveApply, LeaveReview, LeaveListResponse, LeaveBalanceResponse
from services.auth_service import get_current_user
from middleware.rbac import require_hr_officer
from services.coverage_service import compute_coverage_risk
from services.alert_service import generate_alerts

router = APIRouter(prefix="/api/leave", tags=["leave"])

@router.get("/types")
def get_leave_types(db: Session = Depends(get_db)):
    return db.query(LeaveType).all()

@router.get("/balance", response_model=list[LeaveBalanceResponse])
def get_leave_balance(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not current_user.employee_id:
        return []
        
    balances = db.query(LeaveBalance).filter(
        LeaveBalance.employee_id == current_user.employee_id,
        LeaveBalance.year == date.today().year
    ).all()
    
    # If balances don't exist yet, seed them (simple approach for hackathon)
    if not balances:
        leave_types = db.query(LeaveType).all()
        for lt in leave_types:
            new_bal = LeaveBalance(
                employee_id=current_user.employee_id,
                leave_type_id=lt.id,
                total_days=lt.max_days,
                used_days=0,
                year=date.today().year
            )
            db.add(new_bal)
            balances.append(new_bal)
        db.commit()
        
    result = []
    for b in balances:
        result.append({
            "leave_type_id": b.leave_type_id,
            "leave_type_name": b.leave_type.name,
            "total_days": b.total_days,
            "used_days": b.used_days,
            "remaining_days": b.total_days - b.used_days,
            "color": b.leave_type.color
        })
    return result

@router.post("/apply")
def apply_leave(data: LeaveApply, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not current_user.employee_id:
        raise HTTPException(status_code=400, detail="User is not linked to an employee profile")
        
    # Calculate days (simple inclusive logic)
    days = (data.date_to - data.date_from).days + 1
    if days <= 0:
        raise HTTPException(status_code=400, detail="Invalid date range")
        
    # Check balance
    balance = db.query(LeaveBalance).filter(
        LeaveBalance.employee_id == current_user.employee_id,
        LeaveBalance.leave_type_id == data.leave_type_id,
        LeaveBalance.year == date.today().year
    ).first()
    
    if balance and (balance.total_days - balance.used_days) < days:
        raise HTTPException(status_code=400, detail="Insufficient leave balance")
        
    # Create request
    req = LeaveRequest(
        employee_id=current_user.employee_id,
        leave_type_id=data.leave_type_id,
        date_from=data.date_from,
        date_to=data.date_to,
        days=days,
        reason=data.reason,
        status="pending"
    )
    
    # Pre-compute coverage risk
    employee = db.query(Employee).filter(Employee.id == current_user.employee_id).first()
    if employee and employee.department_id:
        coverage = compute_coverage_risk(
            db, 
            employee.id, 
            employee.department_id, 
            data.date_from, 
            data.date_to
        )
        req.coverage_risk = coverage["coverage_percentage"]
        
    db.add(req)
    db.commit()
    db.refresh(req)
    
    # Trigger alert scan asynchronously in a real app, doing it synchronously here
    generate_alerts(db)
    
    return req

@router.get("/requests", response_model=LeaveListResponse)
def get_leave_requests(
    status: str = None, 
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    query = db.query(LeaveRequest)
    
    # RBAC filtering
    if current_user.role != "hr_officer":
        query = query.filter(LeaveRequest.employee_id == current_user.employee_id)
        
    if status:
        query = query.filter(LeaveRequest.status == status)
        
    # Re-compute risk for HR view so it's fresh
    requests = query.order_by(LeaveRequest.created_at.desc()).all()
    
    # Format response (mapping relations manually for Pydantic if needed, though from_attributes helps)
    res = []
    for r in requests:
        d = {
            "id": r.id,
            "employee_id": r.employee_id,
            "employee_name": r.employee.full_name if r.employee else None,
            "department_name": r.employee.department.name if r.employee and r.employee.department else None,
            "leave_type_id": r.leave_type_id,
            "leave_type_name": r.leave_type.name if r.leave_type else None,
            "date_from": r.date_from,
            "date_to": r.date_to,
            "days": r.days,
            "reason": r.reason,
            "status": r.status,
            "reviewer_name": r.reviewer.full_name if r.reviewer else None,
            "review_comment": r.review_comment,
            "reviewed_at": r.reviewed_at,
            "coverage_risk": r.coverage_risk,
            "created_at": r.created_at
        }
        res.append(d)
        
    return {"requests": res, "total": len(res)}

@router.put("/{request_id}/review")
def review_leave(
    request_id: int, 
    data: LeaveReview, 
    current_user: User = Depends(require_hr_officer), 
    db: Session = Depends(get_db)
):
    req = db.query(LeaveRequest).filter(LeaveRequest.id == request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Leave request not found")
        
    if req.status != "pending":
        raise HTTPException(status_code=400, detail=f"Request is already {req.status}")
        
    if data.status not in ["approved", "rejected"]:
        raise HTTPException(status_code=400, detail="Invalid status")
        
    req.status = data.status
    req.review_comment = data.comment
    req.reviewer_id = current_user.employee_id
    req.reviewed_at = datetime.now(timezone.utc)
    
    # If approved, deduct balance
    if data.status == "approved":
        balance = db.query(LeaveBalance).filter(
            LeaveBalance.employee_id == req.employee_id,
            LeaveBalance.leave_type_id == req.leave_type_id,
            LeaveBalance.year == req.date_from.year
        ).first()
        
        if balance:
            balance.used_days += req.days
            
    db.commit()
    
    generate_alerts(db)
    
    return req
