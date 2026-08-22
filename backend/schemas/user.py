"""User / Auth schemas."""

from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class UserLogin(BaseModel):
    email: str
    password: str


class UserSignup(BaseModel):
    email: str
    password: str
    role: str = "employee"
    first_name: str
    last_name: str
    employee_code: Optional[str] = None


class UserResponse(BaseModel):
    id: int
    email: str
    role: str
    is_active: bool
    employee_id: Optional[int] = None

    class Config:
        orm_mode = True


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class UserMeResponse(BaseModel):
    id: int
    email: str
    role: str
    employee_id: Optional[int] = None
    employee_name: Optional[str] = None
    employee_code: Optional[str] = None
    department: Optional[str] = None
    job_title: Optional[str] = None
    photo_url: Optional[str] = None
