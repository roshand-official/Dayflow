"""Notification model — in-app notifications for users."""

from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime, timezone


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    title = Column(String(300), nullable=False)
    message = Column(Text, default="")
    type = Column(String(50), default="system")  # leave_approved | leave_rejected | leave_applied | attendance | system
    is_read = Column(Boolean, default=False)
    link = Column(String(300), default="")  # Frontend route to navigate to
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", backref="notifications")
