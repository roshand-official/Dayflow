"""Alert generation service — rule-based HR intelligence."""

from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta, timezone, date
from models.alert import Alert
from models.attendance import Attendance
from models.leave import LeaveRequest
from models.employee import Employee
from config import LATE_ALERT_THRESHOLD, APPROVAL_BACKLOG_HOURS


def generate_alerts(db: Session):
    """Run all alert scans and create new alerts."""
    _scan_late_arrivals(db)
    _scan_approval_backlog(db)
    _scan_leave_overlap_clusters(db)
    db.commit()


def _scan_late_arrivals(db: Session):
    """Flag employees with >= LATE_ALERT_THRESHOLD late check-ins in trailing 7 days."""
    seven_days_ago = date.today() - timedelta(days=7)

    late_counts = (
        db.query(
            Attendance.employee_id,
            func.count(Attendance.id).label("late_count"),
        )
        .filter(
            Attendance.status == "late",
            Attendance.date >= seven_days_ago,
        )
        .group_by(Attendance.employee_id)
        .having(func.count(Attendance.id) >= LATE_ALERT_THRESHOLD)
        .all()
    )

    if not late_counts:
        return

    employee_ids = [r[0] for r in late_counts]

    # Check if we already have an active alert for this
    existing = db.query(Alert).filter(
        Alert.alert_type == "late_arrivals",
        Alert.status == "new",
    ).first()

    if existing:
        existing.affected_employee_ids = employee_ids
        existing.title = f"{len(employee_ids)} employee{'s' if len(employee_ids) > 1 else ''} with repeated late check-ins"
        existing.description = f"{len(employee_ids)} employees have been late {LATE_ALERT_THRESHOLD}+ times in the past 7 days."
    else:
        alert = Alert(
            severity="warning",
            alert_type="late_arrivals",
            title=f"{len(employee_ids)} employee{'s' if len(employee_ids) > 1 else ''} with repeated late check-ins",
            description=f"{len(employee_ids)} employees have been late {LATE_ALERT_THRESHOLD}+ times in the past 7 days.",
            affected_employee_ids=employee_ids,
            recommended_action="Review attendance patterns and consider follow-up",
            action_url="/attendance",
            status="new",
        )
        db.add(alert)


def _scan_approval_backlog(db: Session):
    """Flag leave requests pending longer than APPROVAL_BACKLOG_HOURS."""
    cutoff = datetime.now(timezone.utc) - timedelta(hours=APPROVAL_BACKLOG_HOURS)

    pending_old = (
        db.query(LeaveRequest)
        .filter(
            LeaveRequest.status == "pending",
            LeaveRequest.created_at <= cutoff,
        )
        .all()
    )

    if not pending_old:
        return

    employee_ids = [r.employee_id for r in pending_old]

    existing = db.query(Alert).filter(
        Alert.alert_type == "pending_approvals",
        Alert.status == "new",
    ).first()

    if existing:
        existing.affected_employee_ids = employee_ids
        existing.title = f"{len(pending_old)} leave request{'s' if len(pending_old) > 1 else ''} awaiting approval"
        existing.description = f"These requests have been pending for more than {APPROVAL_BACKLOG_HOURS} hours."
    else:
        alert = Alert(
            severity="critical" if len(pending_old) >= 5 else "warning",
            alert_type="pending_approvals",
            title=f"{len(pending_old)} leave request{'s' if len(pending_old) > 1 else ''} awaiting approval",
            description=f"These requests have been pending for more than {APPROVAL_BACKLOG_HOURS} hours.",
            affected_employee_ids=employee_ids,
            recommended_action="Review and process pending leave requests",
            action_url="/leave",
            status="new",
        )
        db.add(alert)


def _scan_leave_overlap_clusters(db: Session):
    """Flag departments where multiple employees have overlapping leave."""
    today = date.today()
    next_week = today + timedelta(days=7)

    # Find upcoming approved/pending leaves
    upcoming = (
        db.query(
            Employee.department_id,
            func.count(LeaveRequest.id).label("overlap_count"),
        )
        .join(Employee, LeaveRequest.employee_id == Employee.id)
        .filter(
            LeaveRequest.status.in_(["approved", "pending"]),
            LeaveRequest.date_from <= next_week,
            LeaveRequest.date_to >= today,
        )
        .group_by(Employee.department_id)
        .having(func.count(LeaveRequest.id) >= 3)
        .all()
    )

    if not upcoming:
        return

    for dept_id, count in upcoming:
        existing = db.query(Alert).filter(
            Alert.alert_type == "leave_overlap",
            Alert.department_id == dept_id,
            Alert.status == "new",
        ).first()

        if not existing:
            alert = Alert(
                severity="warning",
                alert_type="leave_overlap",
                title=f"High leave overlap in department",
                description=f"{count} employees in the same department have overlapping leave this week.",
                affected_employee_ids=[],
                department_id=dept_id,
                recommended_action="Review team coverage before approving more leave",
                action_url="/leave",
                status="new",
            )
            db.add(alert)
