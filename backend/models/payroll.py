"""Payslip model — lightweight salary slip records."""

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime, timezone


class Payslip(Base):
    __tablename__ = "payslips"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False, index=True)
    period = Column(String(20), nullable=False)  # "2026-08", "2026-07"
    basic = Column(Integer, default=0)
    hra = Column(Integer, default=0)
    other_allowances = Column(Integer, default=0)
    deductions = Column(Integer, default=0)
    net_pay = Column(Integer, default=0)
    status = Column(String(20), default="generated")  # draft | generated | paid
    generated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    employee = relationship("Employee", back_populates="payslips")
