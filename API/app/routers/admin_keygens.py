from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..deps import admin_auth
from .. import schemas
from ..crud import keygens as crud

router = APIRouter(dependencies=[Depends(admin_auth)])

@router.get("", response_model=list[schemas.KeygenOut])
def list_keygens(db: Session = Depends(get_db)):
    return crud.list_keygens(db)

@router.post("", response_model=schemas.KeygenOut, status_code=201)
def create_keygen(payload: schemas.KeygenCreate, db: Session = Depends(get_db)):
    return crud.create_keygen(db, payload)

@router.patch("/{id}", response_model=schemas.KeygenOut)
def update_keygen(id: int, payload: schemas.KeygenUpdate, db: Session = Depends(get_db)):
    kg = crud.get_keygen(db, id)
    if not kg: raise HTTPException(404, "Keygen não encontrado")
    return crud.update_keygen(db, kg, payload)

@router.delete("/{id}", status_code=204)
def delete_keygen(id: int, db: Session = Depends(get_db)):
    kg = crud.get_keygen(db, id)
    if not kg: raise HTTPException(404, "Keygen não encontrado")
    crud.delete_keygen(db, kg)
    return
