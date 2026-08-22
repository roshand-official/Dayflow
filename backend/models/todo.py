"""Todo model — for Supabase todos demo widget."""

from sqlalchemy import Column, Integer, String, Boolean, DateTime
from database import Base
from datetime import datetime, timezone


class Todo(Base):
    __tablename__ = "todos"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=True)
    name = Column(String(255), nullable=True)
    is_complete = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
