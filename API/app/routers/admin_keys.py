from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from ..database import get_db
from ..deps import admin_auth, admin_actor
from .. import schemas, models
from ..crud import keys as crud
from ..utils import audit
from fastapi import Body

router = APIRouter(dependencies=[Depends(admin_auth)])

@router.get("", response_model=schemas.KeysList)
def list_keys(
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=200),
    status: str | None = None,
    keygen_id: int | None = None,
    q: str | None = None,
):
    items, total = crud.list_keys(db, page, size, status, keygen_id, q)
    return {"items": items, "page": page, "size": size, "total": total}

@router.post("", response_model=list[schemas.KeyOut], status_code=201)
def create_keys(payload: schemas.KeyCreate, db: Session = Depends(get_db)):
    try:
        created = crud.create_keys(db, payload)
        return created
    except ValueError as e:
        raise HTTPException(400, str(e))

def _set_status(db: Session, id: int, new_status: models.KeyStatus):
    lk = crud.get_key(db, id)
    if not lk: raise HTTPException(404, "Key não encontrada")
    return crud.set_status(db, lk, new_status)

@router.post("/{id}/ban", response_model=schemas.KeyOut)
def ban_key(id: int, db: Session = Depends(get_db), actor: str = Depends(admin_actor)):
    item = _set_status(db, id, models.KeyStatus.BANNED)
    audit.log(db, actor=actor, action="keys.ban", target=str(id))
    return item

@router.post("/{id}/unban", response_model=schemas.KeyOut)
def unban_key(id: int, db: Session = Depends(get_db), actor: str = Depends(admin_actor)):
    item = _set_status(db, id, models.KeyStatus.ACTIVE)
    audit.log(db, actor=actor, action="keys.unban", target=str(id))
    return item

@router.post("/{id}/revoke", response_model=schemas.KeyOut)
def revoke_key(id: int, db: Session = Depends(get_db), actor: str = Depends(admin_actor)):
    item = _set_status(db, id, models.KeyStatus.REVOKED)
    audit.log(db, actor=actor, action="keys.revoke", target=str(id))
    return item

@router.post("/{id}/reset", response_model=schemas.KeyOut)
def reset_key(id: int, db: Session = Depends(get_db), actor: str = Depends(admin_actor)):
    # Por enquanto só retorna ACTIVE; no futuro limpa binds/IPs
    lk = crud.get_key(db, id)
    if not lk: raise HTTPException(404, "Key não encontrada")
    lk.last_ip = None
    item = crud.set_status(db, lk, models.KeyStatus.ACTIVE)
    audit.log(db, actor=actor, action="keys.reset", target=str(id))
    return item

@router.delete("/{id}", status_code=204)
def delete_key(id: int, db: Session = Depends(get_db), actor: str = Depends(admin_actor)):
    lk = crud.get_key(db, id)
    if not lk: raise HTTPException(404, "Key não encontrada")
    crud.delete_key(db, lk)
    audit.log(db, actor=actor, action="keys.delete", target=str(id))
    return

from pydantic import BaseModel

class BulkIn(BaseModel):
    ids: list[int]
    action: str  # 'ban' | 'unban' | 'reset' | 'revoke' | 'delete'

@router.post("/bulk")
def bulk_actions(
    payload: BulkIn,
    db: Session = Depends(get_db),
    actor: str = Depends(admin_actor),
):
    action = payload.action.lower()
    ids = payload.ids
    if not ids:
        raise HTTPException(400, "Lista de ids vazia")

    if action == "ban":
        items = crud.bulk_set_status(db, ids, models.KeyStatus.BANNED)
        audit.log(db, actor=actor, action="keys.bulk_ban", target=str(ids), details=f"{len(items)} items")
        return {"ok": True, "updated": [i.id for i in items]}

    if action == "unban":
        items = crud.bulk_set_status(db, ids, models.KeyStatus.ACTIVE)
        audit.log(db, actor=actor, action="keys.bulk_unban", target=str(ids), details=f"{len(items)} items")
        return {"ok": True, "updated": [i.id for i in items]}

    if action == "revoke":
        items = crud.bulk_set_status(db, ids, models.KeyStatus.REVOKED)
        audit.log(db, actor=actor, action="keys.bulk_revoke", target=str(ids), details=f"{len(items)} items")
        return {"ok": True, "updated": [i.id for i in items]}

    if action == "reset":
        items = crud.bulk_reset(db, ids)
        audit.log(db, actor=actor, action="keys.bulk_reset", target=str(ids), details=f"{len(items)} items")
        return {"ok": True, "updated": [i.id for i in items]}

    if action == "delete":
        count = crud.bulk_delete(db, ids)
        audit.log(db, actor=actor, action="keys.bulk_delete", target=str(ids), details=f"{count} items")
        return {"ok": True, "deleted": count}

    raise HTTPException(400, "Ação inválida. Use: ban | unban | reset | revoke | delete")
