from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..deps import admin_auth
from .. import schemas
from ..crud import products as crud

router = APIRouter(dependencies=[Depends(admin_auth)])

@router.get("", response_model=list[schemas.ProductOut])
def list_products(db: Session = Depends(get_db)):
    return crud.list_products(db)

@router.post("", response_model=schemas.ProductOut, status_code=201)
def create_product(payload: schemas.ProductCreate, db: Session = Depends(get_db)):
    return crud.create_product(db, payload)

@router.patch("/{id}", response_model=schemas.ProductOut)
def update_product(id: int, payload: schemas.ProductUpdate, db: Session = Depends(get_db)):
    p = crud.get_product(db, id)
    if not p: raise HTTPException(404, "Produto não encontrado")
    return crud.update_product(db, p, payload)

@router.delete("/{id}", status_code=204)
def delete_product(id: int, db: Session = Depends(get_db)):
    p = crud.get_product(db, id)
    if not p: raise HTTPException(404, "Produto não encontrado")
    crud.delete_product(db, p)
    return
