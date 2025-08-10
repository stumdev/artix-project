from sqlalchemy.orm import Session
from ..models import AuditLog

def log(db: Session, *, actor: str | None, action: str, target: str | None = None, details: str | None = None):
    entry = AuditLog(actor=actor, action=action, target=target, details=details)
    db.add(entry)
    db.commit()
    return entry
