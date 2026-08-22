"""Alert model — HR attention center items."""

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, JSON
from database import Base
from datetime import datetime, timezone


class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    severity = Column(String(20), nullable=False, default="info")  # critical | warning | info | success
    alert_type = Column(String(50), nullable=False)  # late_arrivals | pending_approvals | leave_overlap | document_expiry
    title = Column(String(300), nullable=False)
    description = Column(Text, default="")
    affected_employee_ids = Column(JSON, default=list)  # List of employee IDs
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=True)
    recommended_action = Column(String(300), default="")
    action_url = Column(String(300), default="")  # Frontend route to navigate to
    status = Column(String(20), default="new")  # new | acknowledged | resolved
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    resolved_at = Column(DateTime, nullable=True)
