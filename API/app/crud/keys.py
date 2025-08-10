from sqlalchemy.orm import Session
from sqlalchemy import select, func
from .. import models, schemas
import random, string

def _chunk(n: int, size: int, alphabet: str):
    return [''.join(random.choices(alphabet, k=size)) for _ in range(n)]

def generate_code(prefix: str, chunks: int, chunk_size: int, sep: str):
    alphabet = string.ascii_uppercase + string.digits
    parts = [prefix] + _chunk(chunks, chunk_size, alphabet) if prefix else _chunk(chunks, chunk_size, alphabet)
    return sep.join(parts)

def create_keys(db: Session, data: schemas.KeyCreate):
    keygen = db.get(models.Keygen, data.keygen_id)
    if not keygen:
        raise ValueError("Keygen não encontrado")
    if not keygen.enabled:
        raise ValueError("Keygen desabilitado")
    product = keygen.product
    created: list[models.LicenseKey] = []
    for _ in range(data.count):
        code = generate_code(keygen.prefix, keygen.chunks, keygen.chunk_size, keygen.separator)
        lk = models.LicenseKey(
            code=code,
            status=models.KeyStatus.ACTIVE,
            product_id=product.id,
            keygen_id=keygen.id,
            max_servers=product.max_servers,
        )
        db.add(lk)
        created.append(lk)
    db.commit()
    for lk in created:
        db.refresh(lk)
    return created


def list_keys(db: Session, page: int, size: int, status: str | None, keygen_id: int | None, q: str | None):
    stmt = select(models.LicenseKey)
    if status:
        try:
            st = models.KeyStatus(status)
            stmt = stmt.where(models.LicenseKey.status == st)
        except Exception:
            pass
    if keygen_id:
        stmt = stmt.where(models.LicenseKey.keygen_id == keygen_id)
    if q:
        like = f"%{q.upper()}%"
        stmt = stmt.where(func.upper(models.LicenseKey.code).like(like))
    total = db.execute(select(func.count()).select_from(stmt.subquery())).scalar_one()
    stmt = stmt.order_by(models.LicenseKey.created_at.desc()).offset((page-1)*size).limit(size)
    items = db.execute(stmt).scalars().all()
    return items, total

def get_key(db: Session, id: int):
    return db.get(models.LicenseKey, id)

def set_status(db: Session, lk: models.LicenseKey, new_status: models.KeyStatus):
    lk.status = new_status
    db.add(lk); db.commit(); db.refresh(lk)
    return lk

def delete_key(db: Session, lk: models.LicenseKey):
    db.delete(lk); db.commit()

from typing import Iterable
from sqlalchemy import delete

def bulk_set_status(db: Session, ids: Iterable[int], new_status: models.KeyStatus) -> list[models.LicenseKey]:
    items = db.query(models.LicenseKey).filter(models.LicenseKey.id.in_(list(ids))).all()
    for lk in items:
        lk.status = new_status
    db.commit()
    for lk in items: db.refresh(lk)
    return items

def bulk_reset(db: Session, ids: Iterable[int]) -> list[models.LicenseKey]:
    items = db.query(models.LicenseKey).filter(models.LicenseKey.id.in_(list(ids))).all()
    for lk in items:
        lk.last_ip = None
        lk.status = models.KeyStatus.ACTIVE
    db.commit()
    for lk in items: db.refresh(lk)
    return items

def bulk_delete(db: Session, ids: Iterable[int]) -> int:
    q = db.query(models.LicenseKey).filter(models.LicenseKey.id.in_(list(ids)))
    count = q.count()
    q.delete(synchronize_session=False)
    db.commit()
    return count

def reset_key(db: Session, key_id: int):
    lk = db.get(models.LicenseKey, key_id)
    if not lk:
        raise ValueError("Key não encontrada")
    try:
        db.query(models.ServerBind).filter(models.ServerBind.license_key_id == key_id).delete()
    except Exception:
        pass
    if hasattr(lk, "last_ip"):
        lk.last_ip = None
    if hasattr(lk, "last_check_at"):
        lk.last_check_at = None
    db.add(lk)
    db.commit()
    db.refresh(lk)
    return lk
