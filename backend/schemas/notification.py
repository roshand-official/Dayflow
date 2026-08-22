"""Notification schemas."""

from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class NotificationResponse(BaseModel):
    id: int
    user_id: int
    title: str
    message: str
    type: str
    is_read: bool
    link: str
    created_at: Optional[datetime] = None

    class Config:
        orm_mode = True


class NotificationListResponse(BaseModel):
    notifications: List[NotificationResponse]
    unread_count: int
    total: int
