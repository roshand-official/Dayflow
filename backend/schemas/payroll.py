"""Payroll schemas."""

from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class PayslipResponse(BaseModel):
    id: int
    employee_id: int
    employee_name: Optional[str] = None
    period: str
    basic: int
    hra: int
    other_allowances: int
    deductions: int
    net_pay: int
    status: str
    generated_at: Optional[datetime] = None

    class Config:
        orm_mode = True


class SalaryUpdate(BaseModel):
    basic_salary: Optional[int] = None
    hra: Optional[int] = None
    other_allowances: Optional[int] = None
    deductions: Optional[int] = None


class PayrollSummary(BaseModel):
    total_payroll: int
    total_employees: int
    processed_count: int
    pending_count: int
    average_salary: int


class PayslipListResponse(BaseModel):
    payslips: List[PayslipResponse]
    summary: Optional[PayrollSummary] = None
    total: int
