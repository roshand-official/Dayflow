import random
from datetime import date, datetime, timedelta, timezone
from sqlalchemy.orm import Session
from models.user import User
from models.employee import Employee
from models.department import Department
from models.attendance import Attendance
from models.leave import LeaveType, LeaveRequest, LeaveBalance
from models.payroll import Payslip
from models.notification import Notification
from services.auth_service import hash_password

def seed_database(db: Session):
    # 1. Check if already seeded
    if db.query(Department).first():
        print("Database already seeded.")
        return

    print("Seeding database...")

    # 2. Departments
    depts = [
        Department(name="Engineering", description="Product Development"),
        Department(name="Sales", description="Revenue and Growth"),
        Department(name="HR", description="People and Culture"),
        Department(name="Operations", description="Business Operations")
    ]
    db.add_all(depts)
    db.commit()
    for d in depts: db.refresh(d)

    # 3. Leave Types
    l_types = [
        LeaveType(name="Paid Leave", max_days=15, color="#D7FF00"),
        LeaveType(name="Sick Leave", max_days=7, color="#F2A6A0"),
        LeaveType(name="Unpaid Leave", max_days=30, color="#E8E6E1")
    ]
    db.add_all(l_types)
    db.commit()
    for lt in l_types: db.refresh(lt)

    # 4. Employees & Users
    names = [
        ("Ananya", "Sharma", depts[0].id, "Product Designer"),
        ("Rahul", "Verma", depts[0].id, "Software Engineer"),
        ("Priya", "Patel", depts[0].id, "Software Engineer"),
        ("Amit", "Singh", depts[0].id, "DevOps Engineer"),
        ("Sneha", "Gupta", depts[0].id, "QA Engineer"),
        ("Vikram", "Malhotra", depts[1].id, "Account Executive"),
        ("Neha", "Reddy", depts[1].id, "Sales Manager"),
        ("Rohan", "Desai", depts[1].id, "SDR"),
        ("Kavita", "Joshi", depts[2].id, "HR Manager"),
        ("Arjun", "Nair", depts[2].id, "Recruiter"),
        ("Pooja", "Mehta", depts[3].id, "Operations Analyst"),
        ("Karan", "Kapoor", depts[3].id, "Operations Manager")
    ]

    employees = []
    users = []
    today = date.today()
    
    # Create HR Admin first
    hr_emp = Employee(
        first_name="Admin",
        last_name="User",
        email="hr@dayflow.com",
        employee_code="EMP001",
        department_id=depts[2].id,
        job_title="HR Director",
        basic_salary=150000,
        hra=50000,
        other_allowances=20000,
        deductions=15000
    )
    db.add(hr_emp)
    db.commit()
    db.refresh(hr_emp)
    
    hr_user = User(
        email="hr@dayflow.com",
        password_hash=hash_password("dayflow123"),
        role="hr_officer",
        employee_id=hr_emp.id
    )
    db.add(hr_user)
    db.commit()

    # Create rest of employees
    for i, (first, last, dept_id, title) in enumerate(names):
        email = f"{first.lower()}@dayflow.com"
        emp = Employee(
            first_name=first,
            last_name=last,
            email=email,
            employee_code=f"EMP{i+2:03d}",
            department_id=dept_id,
            job_title=title,
            basic_salary=random.randint(60000, 120000),
            hra=random.randint(20000, 40000),
            deductions=random.randint(5000, 15000)
        )
        db.add(emp)
        db.commit()
        db.refresh(emp)
        employees.append(emp)
        
        user = User(
            email=email,
            password_hash=hash_password("dayflow123"),
            role="employee",
            employee_id=emp.id
        )
        db.add(user)
        
        # Leave balances
        for lt in l_types:
            lb = LeaveBalance(
                employee_id=emp.id,
                leave_type_id=lt.id,
                total_days=lt.max_days,
                used_days=random.randint(0, 5),
                year=2026
            )
            db.add(lb)
            
        # Payslips
        current_period = f"{today.year}-{today.month:02d}"
        ps = Payslip(
            employee_id=emp.id,
            period=current_period,
            basic=emp.basic_salary,
            hra=emp.hra,
            deductions=emp.deductions,
            net_pay=emp.basic_salary + emp.hra - emp.deductions
        )
        db.add(ps)
        
    db.commit()

    # 5. Seed Attendance (including some late patterns for alerts)
    for emp in employees:
        # Generate last 7 days of attendance
        for d in range(7):
            curr_date = today - timedelta(days=d)
            if curr_date.weekday() >= 5: continue # Skip weekends
            
            # Make Rahul and Priya consistently late (to trigger alert)
            is_late = emp.first_name in ["Rahul", "Priya"] and d % 2 == 0
            
            check_in_time = datetime(curr_date.year, curr_date.month, curr_date.day, 
                                   9 if not is_late else 9, 
                                   random.randint(0, 10) if not is_late else random.randint(20, 45),
                                   tzinfo=timezone.utc)
            
            check_out_time = check_in_time + timedelta(hours=8, minutes=random.randint(0, 45))
            
            att = Attendance(
                employee_id=emp.id,
                date=curr_date,
                check_in=check_in_time,
                check_out=check_out_time,
                worked_hours=8.0,
                status="late" if is_late else "present"
            )
            db.add(att)
            
    db.commit()

    # 6. Seed Leave Requests (including overlapping)
    # Ananya applies for leave next week
    req1 = LeaveRequest(
        employee_id=employees[0].id, # Ananya
        leave_type_id=l_types[0].id,
        date_from=today + timedelta(days=3),
        date_to=today + timedelta(days=5),
        days=3,
        reason="Family trip",
        status="pending"
    )
    db.add(req1)
    
    # Amit also applies for same days (creates overlap in Engineering)
    req2 = LeaveRequest(
        employee_id=employees[3].id, # Amit
        leave_type_id=l_types[0].id,
        date_from=today + timedelta(days=4),
        date_to=today + timedelta(days=5),
        days=2,
        reason="Personal work",
        status="pending"
    )
    db.add(req2)
    
    # Old pending request (to trigger backlog alert)
    req3 = LeaveRequest(
        employee_id=employees[5].id, # Vikram
        leave_type_id=l_types[1].id,
        date_from=today + timedelta(days=10),
        date_to=today + timedelta(days=12),
        days=3,
        reason="Medical",
        status="pending",
        created_at=datetime.now(timezone.utc) - timedelta(days=3)
    )
    db.add(req3)
    
    db.commit()

    # 7. Seed Notifications
    hr_user = db.query(User).filter(User.email == "hr@dayflow.com").first()
    ananya_user = db.query(User).filter(User.email == "ananya@dayflow.com").first()
    
    if ananya_user:
        n1 = Notification(
            user_id=ananya_user.id,
            title="Leave Request Approved",
            message="Your leave request for 3 days has been approved by HR.",
            type="leave_approved",
            link="/leave"
        )
        n2 = Notification(
            user_id=ananya_user.id,
            title="Payslip Generated",
            message=f"Your payslip for {today.strftime('%B %Y')} is now available.",
            type="system",
            link="/payroll"
        )
        db.add_all([n1, n2])
        
    if hr_user:
        n3 = Notification(
            user_id=hr_user.id,
            title="New Leave Request",
            message="Amit Singh has requested 2 days of leave.",
            type="leave_applied",
            link="/leave"
        )
        n4 = Notification(
            user_id=hr_user.id,
            title="System Alert",
            message="2 employees have been flagged for repeated late arrivals.",
            type="system",
            link="/"
        )
        db.add_all([n3, n4])

    # 10. Sample Todos for Supabase widget
    from models.todo import Todo
    if not db.query(Todo).first():
        todos = [
            Todo(name="Complete Q3 Performance Reviews", title="Complete Q3 Performance Reviews", is_complete=False),
            Todo(name="Verify Tax Exemption Proofs", title="Verify Tax Exemption Proofs", is_complete=False),
            Todo(name="Update Onboarding Documents", title="Update Onboarding Documents", is_complete=True),
        ]
        db.add_all(todos)

    db.commit()

    print("Database seeded successfully.")

if __name__ == "__main__":
    from database import SessionLocal, Base, engine
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    seed_database(db)
    db.close()
