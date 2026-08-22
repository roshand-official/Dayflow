"""Coverage risk computation service."""

from sqlalchemy.orm import Session
from datetime import date
from models.employee import Employee
from models.leave import LeaveRequest


def compute_coverage_risk(
    db: Session,
    employee_id: int,
    department_id: int,
    date_from: date,
    date_to: date,
    exclude_request_id: int = None,
) -> dict:
    """
    Compute the coverage risk for a department if a leave request is approved.

    Returns:
        dict with team_size, on_leave_count, coverage_percentage, risk_level
    """
    # Count total active employees in department
    team_size = db.query(Employee).filter(
        Employee.department_id == department_id,
        Employee.status == "active",
    ).count()

    if team_size == 0:
        return {
            "team_size": 0,
            "on_leave_count": 0,
            "coverage_percentage": 0.0,
            "risk_level": "unknown",
        }

    # Count overlapping approved/pending leaves in the same department
    query = db.query(LeaveRequest).join(Employee).filter(
        Employee.department_id == department_id,
        LeaveRequest.status.in_(["approved", "pending"]),
        LeaveRequest.date_from <= date_to,
        LeaveRequest.date_to >= date_from,
        LeaveRequest.employee_id != employee_id,
    )
    if exclude_request_id:
        query = query.filter(LeaveRequest.id != exclude_request_id)

    on_leave_count = query.count()

    # Coverage = (team_size - on_leave - 1) / team_size * 100
    # The -1 accounts for the requesting employee themselves
    remaining = team_size - on_leave_count - 1
    coverage_percentage = round((remaining / team_size) * 100, 1) if team_size > 0 else 0

    # Risk level classification
    if coverage_percentage >= 75:
        risk_level = "low"
    elif coverage_percentage >= 50:
        risk_level = "medium"
    else:
        risk_level = "high"

    return {
        "team_size": team_size,
        "on_leave_count": on_leave_count,
        "coverage_percentage": max(0, coverage_percentage),
        "risk_level": risk_level,
    }
