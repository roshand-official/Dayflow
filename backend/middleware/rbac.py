"""RBAC middleware — role-based access control dependencies."""

from fastapi import HTTPException, status, Depends
from models.user import User
from services.auth_service import get_current_user


def require_hr_officer(current_user: User = Depends(get_current_user)) -> User:
    """Dependency: requires HR Officer role."""
    if current_user.role != "hr_officer":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This action requires HR Officer privileges",
        )
    return current_user


def require_employee_or_hr(current_user: User = Depends(get_current_user)) -> User:
    """Dependency: allows any authenticated user."""
    return current_user
