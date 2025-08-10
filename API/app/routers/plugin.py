from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from ..database import get_db, get_settings
from .. import models
import hmac, hashlib, base64, json, time

router = APIRouter()

class HandshakeIn(BaseModel):
    key: str
    serverFingerprint: str
    discordId: str | None = None
    pluginVersion: str | None = None

@router.post("/handshake")
def handshake(payload: HandshakeIn, db: Session = Depends(get_db)):
    key = db.query(models.LicenseKey).filter(models.LicenseKey.code == payload.key).first()
    if not key or key.status != models.KeyStatus.ACTIVE:
        return {"ok": False, "reason": "INVALID_OR_INACTIVE"}
    product = key.product
    policy = {"intervalSec": 900, "graceSec": 3600, "maxServers": product.max_servers}
    body = {"ok": True, "product": {"id": product.id, "slug": product.slug}, "policy": policy, "ts": int(time.time())}
    secret = get_settings().PLUGIN_HMAC_SECRET.encode()
    sig = hmac.new(secret, json.dumps(body, separators=(',',':')).encode(), hashlib.sha256).digest()
    signature = base64.b64encode(sig).decode()
    return {**body, "signature": signature}

# === Simple check by key (no product/slug/ip required) ===
from sqlalchemy import func
from pydantic import BaseModel as _BaseModel

class CheckIn(_BaseModel):
    key: str

class CheckOut(_BaseModel):
    valid: bool
    status: str | None = None
    keygen: dict | None = None
    product_id: int | None = None
    key_id: int | None = None

@router.post("/check", response_model=CheckOut)
def check(payload: CheckIn, db: Session = Depends(get_db)):
    lk = db.query(models.LicenseKey).filter(func.upper(models.LicenseKey.code) == payload.key.upper()).first()
    if not lk:
        return {"valid": False, "status": None, "keygen": None, "product_id": None, "key_id": None}
    kg_ok = (lk.keygen.enabled if lk.keygen is not None else True)
    is_valid = (lk.status == models.KeyStatus.ACTIVE) and kg_ok
    return {
        "valid": is_valid,
        "status": lk.status.value,
        "keygen": ({"id": lk.keygen.id, "name": lk.keygen.name} if lk.keygen else None),
        "product_id": lk.product_id,
        "key_id": lk.id,
    }
