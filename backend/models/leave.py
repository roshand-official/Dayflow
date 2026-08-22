"""Leave models — types, requests, and balances."""

from sqlalchemy import Column, Integer, String, Date, DateTime, ForeignKey, Float, Text
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime, timezone


class LeaveType(Base):
    __tablename__ = "leave_types"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)  # Paid Leave, Sick Leave, Unpaid Leave
    max_days = Column(Integer, default=12)
    description = Column(String(500), default="")
    color = Column(String(20), default="#BFDCE8")  # For UI display

    requests = relationship("LeaveRequest", back_populates="leave_type")
    balances = relationship("LeaveBalance", back_populates="leave_type")


class LeaveRequest(Base):
    __tablename__ = "leave_requests"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False, index=True)
    leave_type_id = Column(Integer, ForeignKey("leave_types.id"), nullable=False)
    date_from = Column(Date, nullable=False)
    date_to = Column(Date, nullable=False)
    days = Column(Integer, default=1)
    reason = Column(Text, default="")
    status = Column(String(20), default="pending")  # pending | approved | rejected | cancelled
    reviewer_id = Column(Integer, ForeignKey("employees.id"), nullable=True)
    review_comment = Column(Text, default="")
    reviewed_at = Column(DateTime, nullable=True)
    coverage_risk = Column(Float, default=0.0)  # Computed: % of department still present
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    employee = relationship("Employee", back_populates="leave_requests", foreign_keys=[employee_id])
    reviewer = relationship("Employee", foreign_keys=[reviewer_id])
    leave_type = relationship("LeaveType", back_populates="requests")


class LeaveBalance(Base):
    __tablename__ = "leave_balances"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False, index=True)
    leave_type_id = Column(Integer, ForeignKey("leave_types.id"), nullable=False)
    total_days = Column(Integer, default=0)
    used_days = Column(Integer, default=0)
    year = Column(Integer, default=2026)

    leave_type = relationship("LeaveType", back_populates="balances")
