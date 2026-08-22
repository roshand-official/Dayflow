from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.user import User
from models.employee import Employee
from models.payroll import Payslip
from schemas.payroll import PayslipListResponse, SalaryUpdate
from services.auth_service import get_current_user
from middleware.rbac import require_hr_officer

router = APIRouter(prefix="/api/payroll", tags=["payroll"])

@router.get("/my-slips", response_model=PayslipListResponse)
def get_my_slips(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not current_user.employee_id:
        return {"payslips": [], "total": 0}
        
    payslips = db.query(Payslip).filter(Payslip.employee_id == current_user.employee_id).order_by(Payslip.period.desc()).all()
    
    res = []
    for p in payslips:
        res.append({
            "id": p.id,
            "employee_id": p.employee_id,
            "employee_name": p.employee.full_name if p.employee else None,
            "period": p.period,
            "basic": p.basic,
            "hra": p.hra,
            "other_allowances": p.other_allowances,
            "deductions": p.deductions,
            "net_pay": p.net_pay,
            "status": p.status,
            "generated_at": p.generated_at
        })
        
    return {"payslips": res, "total": len(res)}

@router.get("/all", response_model=PayslipListResponse)
def get_all_slips(period: str = None, current_user: User = Depends(require_hr_officer), db: Session = Depends(get_db)):
    query = db.query(Payslip)
    if period:
        query = query.filter(Payslip.period == period)
        
    payslips = query.order_by(Payslip.period.desc()).all()
    
    res = []
    total_net = 0
    for p in payslips:
        total_net += p.net_pay
        res.append({
            "id": p.id,
            "employee_id": p.employee_id,
            "employee_name": p.employee.full_name if p.employee else None,
            "period": p.period,
            "basic": p.basic,
            "hra": p.hra,
            "other_allowances": p.other_allowances,
            "deductions": p.deductions,
            "net_pay": p.net_pay,
            "status": p.status,
            "generated_at": p.generated_at
        })
        
    summary = {
        "total_payroll": total_net,
        "total_employees": len(set(p.employee_id for p in payslips)),
        "processed_count": len(payslips),
        "pending_count": 0,
        "average_salary": int(total_net / len(payslips)) if payslips else 0
    }
        
    return {"payslips": res, "summary": summary, "total": len(res)}


@router.post("/run")
def run_payroll(
    period: str = None,
    current_user: User = Depends(require_hr_officer),
    db: Session = Depends(get_db),
):
    from datetime import datetime, timezone
    from models.notification import Notification
    
    if not period:
        period = datetime.now().strftime("%Y-%m")

    employees = db.query(Employee).filter(Employee.status == "active").all()
    created_count = 0
    updated_count = 0

    for emp in employees:
        existing = (
            db.query(Payslip)
            .filter(Payslip.employee_id == emp.id, Payslip.period == period)
            .first()
        )
        
        basic = emp.basic_salary or 50000
        hra = emp.hra or int(basic * 0.4)
        allowances = emp.other_allowances or int(basic * 0.1)
        deductions = emp.deductions or int(basic * 0.05)
        net_pay = basic + hra + allowances - deductions

        if existing:
            existing.basic = basic
            existing.hra = hra
            existing.other_allowances = allowances
            existing.deductions = deductions
            existing.net_pay = net_pay
            existing.status = "paid"
            existing.generated_at = datetime.now(timezone.utc)
            updated_count += 1
        else:
            payslip = Payslip(
                employee_id=emp.id,
                period=period,
                basic=basic,
                hra=hra,
                other_allowances=allowances,
                deductions=deductions,
                net_pay=net_pay,
                status="paid",
                generated_at=datetime.now(timezone.utc),
            )
            db.add(payslip)
            created_count += 1

            # Notify user if they have an associated account
            if emp.user:
                db.add(
                    Notification(
                        user_id=emp.user.id,
                        title="Payslip Processed",
                        message=f"Your payslip for {period} has been generated.",
                        type="system",
                        link="/payroll",
                    )
                )

    db.commit()

    return {
        "message": f"Payroll processed successfully for {period}.",
        "period": period,
        "created": created_count,
        "updated": updated_count,
        "total_employees": len(employees),
    }

