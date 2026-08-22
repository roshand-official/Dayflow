"""Employee model — core HR profile."""

from sqlalchemy import Column, Integer, String, Date, ForeignKey, Boolean, DateTime
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime, timezone


class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)
    employee_code = Column(String(20), unique=True, nullable=False, index=True)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    phone = Column(String(20), default="")
    address = Column(String(500), default="")
    date_of_birth = Column(Date, nullable=True)
    gender = Column(String(20), default="")
    photo_url = Column(String(500), default="")

    # Job details
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=True)
    job_title = Column(String(200), default="")
    manager_id = Column(Integer, ForeignKey("employees.id"), nullable=True)
    joining_date = Column(Date, nullable=True)
    employment_type = Column(String(50), default="full_time")  # full_time | part_time | contract
    status = Column(String(20), default="active")  # active | inactive | on_leave

    # Salary (basic structure — HR-editable only)
    basic_salary = Column(Integer, default=0)
    hra = Column(Integer, default=0)
    other_allowances = Column(Integer, default=0)
    deductions = Column(Integer, default=0)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    department = relationship("Department", back_populates="employees", foreign_keys=[department_id])
    manager = relationship("Employee", remote_side=[id], foreign_keys=[manager_id])
    user = relationship("User", back_populates="employee", uselist=False)
    attendances = relationship("Attendance", back_populates="employee", cascade="all, delete-orphan")
    leave_requests = relationship("LeaveRequest", back_populates="employee", foreign_keys="LeaveRequest.employee_id", cascade="all, delete-orphan")
    payslips = relationship("Payslip", back_populates="employee", cascade="all, delete-orphan")

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"

    @property
    def net_salary(self):
        return self.basic_salary + self.hra + self.other_allowances - self.deductions

    @property
    def department_name(self):
        return self.department.name if self.department else None

    @property
    def manager_name(self):
        return self.manager.full_name if self.manager else None

    @property
    def attendance_rate(self):
        if not self.attendances:
            return 0.0
        total_days = len(self.attendances)
        present = sum(1 for a in self.attendances if a.status in ["present", "late"])
        return round((present / total_days) * 100, 1)
