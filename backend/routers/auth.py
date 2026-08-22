from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime
from database import get_db
from models.user import User
from models.employee import Employee
from schemas.user import UserLogin, UserSignup, TokenResponse, UserMeResponse
from services.auth_service import hash_password, verify_password, create_access_token, get_current_user

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/login", response_model=TokenResponse)
def login(user_credentials: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_credentials.email).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    if not verify_password(user_credentials.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    
    access_token = create_access_token(data={"sub": str(user.id)})
    return {"access_token": access_token, "user": user}

@router.post("/signup", response_model=TokenResponse)
def signup(user_data: UserSignup, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
        
    new_employee = Employee(
        first_name=user_data.first_name,
        last_name=user_data.last_name,
        email=user_data.email,
        employee_code=user_data.employee_code or f"EMP{int(datetime.now().timestamp())}",
    )
    db.add(new_employee)
    db.commit()
    db.refresh(new_employee)
    
    new_user = User(
        email=user_data.email,
        password_hash=hash_password(user_data.password),
        role=user_data.role,
        employee_id=new_employee.id
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    access_token = create_access_token(data={"sub": str(new_user.id)})
    return {"access_token": access_token, "user": new_user}

@router.get("/me", response_model=UserMeResponse)
def get_me(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    employee = db.query(Employee).filter(Employee.id == current_user.employee_id).first()
    
    return {
        "id": current_user.id,
        "email": current_user.email,
        "role": current_user.role,
        "employee_id": employee.id if employee else None,
        "employee_name": employee.full_name if employee else None,
        "employee_code": employee.employee_code if employee else None,
        "department": employee.department.name if employee and employee.department else None,
        "job_title": employee.job_title if employee else None,
        "photo_url": employee.photo_url if employee else None,
    }
