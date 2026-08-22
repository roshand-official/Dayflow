from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db
from models.user import User
from models.employee import Employee
from models.department import Department
from schemas.employee import EmployeeResponse, EmployeeListResponse, EmployeeUpdate, EmployeeAdminUpdate
from services.auth_service import get_current_user
from middleware.rbac import require_hr_officer

router = APIRouter(prefix="/api/employees", tags=["employees"])

@router.get("", response_model=EmployeeListResponse)
def get_employees(
    department_id: Optional[int] = None,
    search: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Employee)
    
    # If standard employee, perhaps only show active employees or just limit details
    # But for DayFlow, directory is visible to all
    
    if department_id:
        query = query.filter(Employee.department_id == department_id)
        
    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            (Employee.first_name.ilike(search_filter)) | 
            (Employee.last_name.ilike(search_filter)) | 
            (Employee.employee_code.ilike(search_filter))
        )
        
    total = query.count()
    employees = query.offset(skip).limit(limit).all()
    
    return {"employees": employees, "total": total}

@router.get("/search")
def search_employees(q: str, limit: int = 5, db: Session = Depends(get_db)):
    """Lightweight search for the top bar."""
    if not q:
        return []
        
    search_filter = f"%{q}%"
    results = db.query(Employee).filter(
        (Employee.first_name.ilike(search_filter)) | 
        (Employee.last_name.ilike(search_filter)) | 
        (Employee.job_title.ilike(search_filter))
    ).limit(limit).all()
    
    return [
        {
            "id": emp.id,
            "full_name": emp.full_name,
            "job_title": emp.job_title,
            "department_name": emp.department.name if emp.department else None,
            "photo_url": emp.photo_url
        }
        for emp in results
    ]

@router.get("/{employee_id}", response_model=EmployeeResponse)
def get_employee(employee_id: int, db: Session = Depends(get_db)):
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    # In a real app we might populate extra computed fields here
    return employee

@router.put("/{employee_id}")
def update_employee(
    employee_id: int, 
    update_data: EmployeeUpdate, 
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Only allow user to edit themselves
    if current_user.role != "hr_officer" and current_user.employee_id != employee_id:
        raise HTTPException(status_code=403, detail="Not authorized to edit this profile")
        
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
        
    for key, value in update_data.dict(exclude_unset=True).items():
        setattr(employee, key, value)
        
    db.commit()
    db.refresh(employee)
    return employee

@router.put("/{employee_id}/admin")
def update_employee_admin(
    employee_id: int, 
    update_data: EmployeeAdminUpdate, 
    current_user: User = Depends(require_hr_officer),
    db: Session = Depends(get_db)
):
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
        
    for key, value in update_data.dict(exclude_unset=True).items():
        setattr(employee, key, value)
        
    db.commit()
    db.refresh(employee)
    return employee
