from fastapi import Header, HTTPException
from .database import get_settings

def admin_auth(x_admin_token: str | None = Header(default=None)):
    settings = get_settings()
    if not x_admin_token or x_admin_token != settings.ADMIN_TOKEN:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return True

def admin_actor(x_admin_actor: str | None = Header(default=None)) -> str:
    return x_admin_actor or "admin"
