from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from .models import KeyStatus

class ProductBase(BaseModel):
    slug: str
    name: str
    description: Optional[str] = None
    price_cents: int
    currency: str = "BRL"
    is_active: bool = True
    max_servers: Optional[int] = None

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    slug: Optional[str] = None
    name: Optional[str] = None
    description: Optional[str] = None
    price_cents: Optional[int] = None
    currency: Optional[str] = None
    is_active: Optional[bool] = None
    max_servers: Optional[int] = None

class ProductOut(ProductBase):
    id: int
    created_at: datetime
    updated_at: datetime
    class Config:
        from_attributes = True

class KeygenBase(BaseModel):
    name: str
    prefix: str = "ARTIX"
    chunks: int = 5
    chunk_size: int = 5
    separator: str = "-"
    enabled: bool = True
    product_id: int

class KeygenCreate(KeygenBase):
    pass

class KeygenUpdate(BaseModel):
    name: Optional[str] = None
    prefix: Optional[str] = None
    chunks: Optional[int] = None
    chunk_size: Optional[int] = None
    separator: Optional[str] = None
    enabled: Optional[bool] = None
    product_id: Optional[int] = None

class KeygenOut(KeygenBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

class KeyOut(BaseModel):
    id: int
    code: str
    status: KeyStatus
    product_id: int
    keygen_id: Optional[int] = None
    user_email: Optional[str] = None
    last_ip: Optional[str] = None
    max_servers: Optional[int] = None
    expires_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    class Config:
        from_attributes = True

class KeyCreate(BaseModel):
    keygen_id: int
    count: int = Field(1, ge=1, le=100)

class KeysList(BaseModel):
    items: List[KeyOut]
    page: int
    size: int
    total: int
    items: List[KeyOut]
    page: int
    size: int
    total: int
