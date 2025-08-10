from sqlalchemy.orm import Session
from .. import models, schemas

def list_keygens(db: Session):
    return db.query(models.Keygen).order_by(models.Keygen.created_at.desc()).all()

def create_keygen(db: Session, data: schemas.KeygenCreate):
    kg = models.Keygen(**data.model_dump())
    db.add(kg); db.commit(); db.refresh(kg)
    return kg

def get_keygen(db: Session, id: int):
    return db.get(models.Keygen, id)

def update_keygen(db: Session, kg: models.Keygen, data: schemas.KeygenUpdate):
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(kg, k, v)
    db.add(kg); db.commit(); db.refresh(kg)
    return kg

def delete_keygen(db: Session, kg: models.Keygen):
    db.delete(kg); db.commit()
