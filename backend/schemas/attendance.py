"""Attendance schemas."""

from pydantic import BaseModel
from typing import Optional, List
from datetime import date, datetime


class AttendanceCheckIn(BaseModel):
    notes: Optional[str] = ""


class AttendanceCheckOut(BaseModel):
    notes: Optional[str] = ""


class AttendanceResponse(BaseModel):
    id: int
    employee_id: int
    employee_name: Optional[str] = None
    date: date
    check_in: Optional[datetime] = None
    check_out: Optional[datetime] = None
    worked_hours: float
    status: str
    notes: str

    class Config:
        orm_mode = True


class AttendanceTodayResponse(BaseModel):
    is_checked_in: bool
    check_in: Optional[datetime] = None
    check_out: Optional[datetime] = None
    worked_hours: float
    status: str


class AttendanceSummary(BaseModel):
    total_days: int
    present: int
    absent: int
    late: int
    half_day: int
    on_leave: int
    wfh: int
    attendance_rate: float


class AttendanceListResponse(BaseModel):
    records: List[AttendanceResponse]
    summary: Optional[AttendanceSummary] = None
    total: int
