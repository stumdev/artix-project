from sqlalchemy.orm import Session
from .. import models, schemas

def list_products(db: Session):
    return db.query(models.Product).order_by(models.Product.created_at.desc()).all()

def create_product(db: Session, data: schemas.ProductCreate):
    p = models.Product(**data.model_dump())
    db.add(p); db.commit(); db.refresh(p)
    return p

def get_product(db: Session, id: int):
    return db.get(models.Product, id)

def update_product(db: Session, p: models.Product, data: schemas.ProductUpdate):
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(p, k, v)
    db.add(p); db.commit(); db.refresh(p)
    return p

def delete_product(db: Session, p: models.Product):
    db.delete(p); db.commit()
