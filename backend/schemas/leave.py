"""Leave schemas."""

from pydantic import BaseModel
from typing import Optional, List
from datetime import date, datetime


class LeaveApply(BaseModel):
    leave_type_id: int
    date_from: date
    date_to: date
    reason: str = ""


class LeaveReview(BaseModel):
    status: str  # approved | rejected
    comment: str = ""


class LeaveTypeResponse(BaseModel):
    id: int
    name: str
    max_days: int
    color: str

    class Config:
        orm_mode = True


class LeaveBalanceResponse(BaseModel):
    leave_type_id: int
    leave_type_name: str
    total_days: int
    used_days: int
    remaining_days: int
    color: str


class LeaveRequestResponse(BaseModel):
    id: int
    employee_id: int
    employee_name: Optional[str] = None
    department_name: Optional[str] = None
    leave_type_id: int
    leave_type_name: Optional[str] = None
    date_from: date
    date_to: date
    days: int
    reason: str
    status: str
    reviewer_name: Optional[str] = None
    review_comment: str
    reviewed_at: Optional[datetime] = None
    coverage_risk: float
    created_at: Optional[datetime] = None

    class Config:
        orm_mode = True


class CoverageInfo(BaseModel):
    team_size: int
    on_leave_count: int
    coverage_percentage: float
    risk_level: str  # low | medium | high


class LeaveListResponse(BaseModel):
    requests: List[LeaveRequestResponse]
    total: int
