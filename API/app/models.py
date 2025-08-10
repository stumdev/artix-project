from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Integer, Boolean, DateTime, ForeignKey, Enum, Text
from datetime import datetime
import enum
from .database import Base

class KeyStatus(str, enum.Enum):
    ACTIVE = "ACTIVE"
    SUSPENDED = "SUSPENDED"
    REVOKED = "REVOKED"
    EXPIRED = "EXPIRED"
    BANNED = "BANNED"

class Product(Base):
    __tablename__ = "products"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    slug: Mapped[str] = mapped_column(String(120), unique=True)
    name: Mapped[str] = mapped_column(String(200))
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    price_cents: Mapped[int] = mapped_column(Integer)
    currency: Mapped[str] = mapped_column(String(8), default="BRL")
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    max_servers: Mapped[int | None] = mapped_column(Integer, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    keygens: Mapped[list["Keygen"]] = relationship(back_populates="product")
    keys: Mapped[list["LicenseKey"]] = relationship(back_populates="product")

class Keygen(Base):
    __tablename__ = "keygens"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(120), unique=True)  # ex: ARTICOS_PRACTICE
    prefix: Mapped[str] = mapped_column(String(16))
    chunks: Mapped[int] = mapped_column(Integer, default=3)
    chunk_size: Mapped[int] = mapped_column(Integer, default=5)
    separator: Mapped[str] = mapped_column(String(2), default='-')
    enabled: Mapped[bool] = mapped_column(Boolean, default=True)
    product_id: Mapped[int] = mapped_column(ForeignKey("products.id"))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    product: Mapped["Product"] = relationship(back_populates="keygens")
    keys: Mapped[list["LicenseKey"]] = relationship(back_populates="keygen")

class LicenseKey(Base):
    __tablename__ = "license_keys"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    code: Mapped[str] = mapped_column(String(128), unique=True, index=True)
    status: Mapped[KeyStatus] = mapped_column(Enum(KeyStatus), default=KeyStatus.ACTIVE)
    product_id: Mapped[int] = mapped_column(ForeignKey("products.id"))
    keygen_id: Mapped[int | None] = mapped_column(ForeignKey("keygens.id"), nullable=True)
    user_email: Mapped[str | None] = mapped_column(String(200), nullable=True)
    last_ip: Mapped[str | None] = mapped_column(String(64), nullable=True)
    max_servers: Mapped[int | None] = mapped_column(Integer, nullable=True)
    expires_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    product: Mapped["Product"] = relationship(back_populates="keys")
    keygen: Mapped["Keygen"] = relationship(back_populates="keys")

class AuditLog(Base):
    __tablename__ = "audit_logs"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    actor: Mapped[str | None] = mapped_column(String(120), nullable=True)  # ex: 'admin:bruno'
    action: Mapped[str] = mapped_column(String(120))
    target: Mapped[str | None] = mapped_column(String(120), nullable=True)
    details: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
