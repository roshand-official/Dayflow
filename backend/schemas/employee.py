"""Employee schemas."""

from pydantic import BaseModel
from typing import Optional, List
from datetime import date, datetime


class EmployeeBase(BaseModel):
    first_name: str
    last_name: str
    email: str
    phone: Optional[str] = ""
    address: Optional[str] = ""
    date_of_birth: Optional[date] = None
    gender: Optional[str] = ""
    photo_url: Optional[str] = ""
    department_id: Optional[int] = None
    job_title: Optional[str] = ""
    manager_id: Optional[int] = None
    joining_date: Optional[date] = None
    employment_type: Optional[str] = "full_time"


class EmployeeCreate(EmployeeBase):
    employee_code: str


class EmployeeUpdate(BaseModel):
    """Fields an employee can edit themselves (limited)."""
    phone: Optional[str] = None
    address: Optional[str] = None
    photo_url: Optional[str] = None


class EmployeeAdminUpdate(EmployeeBase):
    """All fields — HR officers only."""
    employee_code: Optional[str] = None
    basic_salary: Optional[int] = None
    hra: Optional[int] = None
    other_allowances: Optional[int] = None
    deductions: Optional[int] = None
    status: Optional[str] = None


class EmployeeResponse(BaseModel):
    id: int
    employee_code: str
    first_name: str
    last_name: str
    full_name: str
    email: str
    phone: str
    address: str
    date_of_birth: Optional[date] = None
    gender: str
    photo_url: str
    department_id: Optional[int] = None
    department_name: Optional[str] = None
    job_title: str
    manager_id: Optional[int] = None
    manager_name: Optional[str] = None
    joining_date: Optional[date] = None
    employment_type: str
    status: str
    basic_salary: Optional[int] = None
    hra: Optional[int] = None
    other_allowances: Optional[int] = None
    deductions: Optional[int] = None
    net_salary: Optional[int] = None
    attendance_rate: Optional[float] = None
    created_at: Optional[datetime] = None

    class Config:
        orm_mode = True


class EmployeeListResponse(BaseModel):
    employees: List[EmployeeResponse]
    total: int
