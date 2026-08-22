"""Payroll PDF generation — professional payslip download."""

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from io import BytesIO
from datetime import datetime

from database import get_db
from models.user import User
from models.employee import Employee
from models.payroll import Payslip
from services.auth_service import get_current_user

router = APIRouter(prefix="/api/payroll", tags=["payroll"])


def _generate_payslip_pdf(slip, employee) -> BytesIO:
    """Generate a professional payslip PDF using pure Python (no external dependency)."""
    buffer = BytesIO()

    # We'll generate a styled HTML and convert to a simple text-based PDF
    # Using a minimal PDF generator to avoid heavy dependencies
    company_name = "DayFlow Technologies Pvt. Ltd."
    company_address = "123 Innovation Park, Bengaluru, Karnataka 560001"
    company_phone = "+91 80-1234-5678"

    period_display = slip.period
    try:
        parts = slip.period.split("-")
        if len(parts) == 2:
            months = ["", "January", "February", "March", "April", "May", "June",
                       "July", "August", "September", "October", "November", "December"]
            period_display = f"{months[int(parts[1])]} {parts[0]}"
    except:
        pass

    gross_earnings = slip.basic + slip.hra + slip.other_allowances
    emp_name = employee.full_name if employee else "Employee"
    emp_code = employee.employee_code if employee else "N/A"
    emp_dept = employee.department_name if employee else "N/A"
    emp_title = employee.job_title if employee else "N/A"
    emp_email = employee.email if employee else "N/A"
    gen_date = slip.generated_at.strftime("%d %b %Y") if slip.generated_at else datetime.now().strftime("%d %b %Y")

    # Build a minimal valid PDF manually (no reportlab needed)
    pdf_lines = []
    pdf_lines.append("%PDF-1.4")

    # We use a simple approach: embed the payslip as nicely formatted text
    content_lines = [
        f"{'=' * 72}",
        f"",
        f"{'PAYSLIP':^72}",
        f"{'=' * 72}",
        f"",
        f"  {company_name}",
        f"  {company_address}",
        f"  Phone: {company_phone}",
        f"",
        f"  {'_' * 66}",
        f"",
        f"  PAY PERIOD: {period_display:<30} DATE: {gen_date}",
        f"  {'_' * 66}",
        f"",
        f"  EMPLOYEE DETAILS",
        f"  {'-' * 66}",
        f"  Name          : {emp_name}",
        f"  Employee Code  : {emp_code}",
        f"  Department     : {emp_dept}",
        f"  Designation    : {emp_title}",
        f"  Email          : {emp_email}",
        f"",
        f"  {'_' * 66}",
        f"",
        f"  EARNINGS",
        f"  {'-' * 66}",
        f"  {'Component':<40} {'Amount (INR)':>24}",
        f"  {'-' * 66}",
        f"  {'Basic Salary':<40} {'Rs. ' + f'{slip.basic:,}':>24}",
        f"  {'House Rent Allowance (HRA)':<40} {'Rs. ' + f'{slip.hra:,}':>24}",
        f"  {'Other Allowances':<40} {'Rs. ' + f'{slip.other_allowances:,}':>24}",
        f"  {'-' * 66}",
        f"  {'GROSS EARNINGS':<40} {'Rs. ' + f'{gross_earnings:,}':>24}",
        f"",
        f"  DEDUCTIONS",
        f"  {'-' * 66}",
        f"  {'Component':<40} {'Amount (INR)':>24}",
        f"  {'-' * 66}",
        f"  {'Provident Fund':<40} {'Rs. ' + f'{int(slip.deductions * 0.4):,}':>24}",
        f"  {'Professional Tax':<40} {'Rs. ' + f'{int(slip.deductions * 0.1):,}':>24}",
        f"  {'Income Tax (TDS)':<40} {'Rs. ' + f'{int(slip.deductions * 0.4):,}':>24}",
        f"  {'Other Deductions':<40} {'Rs. ' + f'{int(slip.deductions * 0.1):,}':>24}",
        f"  {'-' * 66}",
        f"  {'TOTAL DEDUCTIONS':<40} {'Rs. ' + f'{slip.deductions:,}':>24}",
        f"",
        f"  {'=' * 66}",
        f"  {'NET PAY':<40} {'Rs. ' + f'{slip.net_pay:,}':>24}",
        f"  {'=' * 66}",
        f"",
        f"  Net Pay in Words: {_num_to_words(slip.net_pay)} Rupees Only",
        f"",
        f"  {'_' * 66}",
        f"",
        f"  Payment Mode    : Bank Transfer",
        f"  Payment Status  : {slip.status.upper()}",
        f"",
        f"  {'_' * 66}",
        f"",
        f"  This is a computer-generated payslip and does not require a signature.",
        f"  For any discrepancies, please contact HR at hr@dayflow.com",
        f"",
        f"{'=' * 72}",
    ]

    text_content = "\n".join(content_lines)

    # Build minimal PDF structure
    objects = []

    # Object 1: Catalog
    objects.append("1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj")

    # Object 2: Pages
    objects.append("2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj")

    # Object 4: Font
    objects.append("4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Courier >>\nendobj")

    # Object 5: Stream content
    stream_lines = []
    stream_lines.append("BT")
    stream_lines.append("/F1 9 Tf")  # Courier 9pt for monospace alignment
    y = 780
    for line in content_lines:
        escaped = line.replace("\\", "\\\\").replace("(", "\\(").replace(")", "\\)")
        stream_lines.append(f"1 0 0 1 36 {y} Tm")
        stream_lines.append(f"({escaped}) Tj")
        y -= 12
        if y < 40:
            break
    stream_lines.append("ET")
    stream_content = "\n".join(stream_lines)

    objects.append(f"5 0 obj\n<< /Length {len(stream_content)} >>\nstream\n{stream_content}\nendstream\nendobj")

    # Object 3: Page
    objects.append("3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 842] /Contents 5 0 R /Resources << /Font << /F1 4 0 R >> >> >>\nendobj")

    # Build PDF
    pdf_output = "%PDF-1.4\n"
    offsets = []
    for obj in objects:
        offsets.append(len(pdf_output.encode('latin-1')))
        pdf_output += obj + "\n"

    xref_offset = len(pdf_output.encode('latin-1'))
    pdf_output += "xref\n"
    pdf_output += f"0 {len(objects) + 1}\n"
    pdf_output += "0000000000 65535 f \n"

    obj_ids = [1, 2, 4, 5, 3]  # order we added them
    offset_map = {}
    for i, oid in enumerate(obj_ids):
        offset_map[oid] = offsets[i]

    for oid in range(1, len(objects) + 1):
        pdf_output += f"{offset_map.get(oid, 0):010d} 00000 n \n"

    pdf_output += "trailer\n"
    pdf_output += f"<< /Size {len(objects) + 1} /Root 1 0 R >>\n"
    pdf_output += "startxref\n"
    pdf_output += f"{xref_offset}\n"
    pdf_output += "%%EOF"

    buffer.write(pdf_output.encode('latin-1'))
    buffer.seek(0)
    return buffer


def _num_to_words(num):
    """Convert number to Indian English words (simplified)."""
    if num == 0:
        return "Zero"

    ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
            "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
            "Seventeen", "Eighteen", "Nineteen"]
    tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"]

    def two_digits(n):
        if n < 20:
            return ones[n]
        return tens[n // 10] + (" " + ones[n % 10] if n % 10 else "")

    def three_digits(n):
        if n >= 100:
            return ones[n // 100] + " Hundred" + (" and " + two_digits(n % 100) if n % 100 else "")
        return two_digits(n)

    if num >= 10000000:
        return three_digits(num // 10000000) + " Crore " + _num_to_words(num % 10000000)
    if num >= 100000:
        return two_digits(num // 100000) + " Lakh " + _num_to_words(num % 100000)
    if num >= 1000:
        return two_digits(num // 1000) + " Thousand " + _num_to_words(num % 1000)

    return three_digits(num)


@router.get("/slip/{slip_id}/download")
def download_payslip(
    slip_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    slip = db.query(Payslip).filter(Payslip.id == slip_id).first()
    if not slip:
        raise HTTPException(status_code=404, detail="Payslip not found")

    # Authorization: employees can only download their own slips
    if current_user.role != "hr_officer" and slip.employee_id != current_user.employee_id:
        raise HTTPException(status_code=403, detail="Not authorized to download this payslip")

    employee = db.query(Employee).filter(Employee.id == slip.employee_id).first()

    pdf_buffer = _generate_payslip_pdf(slip, employee)

    filename = f"Payslip_{employee.employee_code if employee else 'EMP'}_{slip.period}.pdf"

    return StreamingResponse(
        pdf_buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename={filename}"},
    )
