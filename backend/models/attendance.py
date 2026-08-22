"""Attendance model — check-in/out and status tracking."""

from sqlalchemy import Column, Integer, Float, String, Date, DateTime, ForeignKey, Time
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime, timezone


class Attendance(Base):
    __tablename__ = "attendances"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False, index=True)
    date = Column(Date, nullable=False, index=True)
    check_in = Column(DateTime, nullable=True)
    check_out = Column(DateTime, nullable=True)
    worked_hours = Column(Float, default=0.0)
    status = Column(String(20), default="absent")  # present | absent | half_day | late | leave | wfh
    notes = Column(String(500), default="")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    employee = relationship("Employee", back_populates="attendances")
