from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime, timezone
from database import get_db
from models.user import User
from models.alert import Alert
from schemas.alert import AlertListResponse
from middleware.rbac import require_hr_officer
from services.alert_service import generate_alerts

router = APIRouter(prefix="/api/alerts", tags=["alerts"])

@router.get("", response_model=AlertListResponse)
def get_alerts(status: str = None, current_user: User = Depends(require_hr_officer), db: Session = Depends(get_db)):
    # Optionally trigger a fresh scan before returning
    # In a real app this would be a background task (cron)
    generate_alerts(db)
    
    query = db.query(Alert)
    if status:
        query = query.filter(Alert.status == status)
        
    alerts = query.order_by(
        # Custom order by severity: critical -> warning -> info -> success
        Alert.severity.desc(), 
        Alert.created_at.desc()
    ).all()
    
    # Sort them nicely in Python since SQLite custom sorting can be annoying
    severity_order = {"critical": 0, "warning": 1, "info": 2, "success": 3}
    alerts.sort(key=lambda x: (severity_order.get(x.severity, 99), getattr(x, 'created_at', datetime.min) or datetime.min))
    
    return {"alerts": alerts, "total": len(alerts)}

@router.put("/{alert_id}/resolve")
def resolve_alert(alert_id: int, current_user: User = Depends(require_hr_officer), db: Session = Depends(get_db)):
    alert = db.query(Alert).filter(Alert.id == alert_id).first()
    if alert:
        alert.status = "resolved"
        alert.resolved_at = datetime.now(timezone.utc)
        db.commit()
    return alert
