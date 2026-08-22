"""Department model."""

from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base


class Department(Base):
    __tablename__ = "departments"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    description = Column(String(500), default="")
    head_id = Column(Integer, ForeignKey("employees.id"), nullable=True)

    employees = relationship(
        "Employee",
        back_populates="department",
        foreign_keys="Employee.department_id",
    )
