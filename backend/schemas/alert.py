"""Alert schemas."""

from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class AlertResponse(BaseModel):
    id: int
    severity: str
    alert_type: str
    title: str
    description: str
    affected_employee_ids: list
    department_id: Optional[int] = None
    recommended_action: str
    action_url: str
    status: str
    created_at: Optional[datetime] = None

    class Config:
        orm_mode = True


class AlertListResponse(BaseModel):
    alerts: List[AlertResponse]
    total: int


class DashboardKPI(BaseModel):
    attendance_rate: float
    total_employees: int
    present_today: int
    absent_today: int
    on_leave: int
    pending_actions: int
    total_payroll: int
    payroll_processed_pct: float
    late_today: int
    new_employees_month: int
