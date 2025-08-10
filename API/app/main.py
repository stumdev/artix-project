from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import Base, engine
from .routers import admin_products, admin_keygens, admin_keys, plugin

# cria tabelas (dev). Em produção use Alembic.
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Artix Store API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(admin_products.router, prefix="/admin/products", tags=["admin:products"])
app.include_router(admin_keygens.router, prefix="/admin/keygens", tags=["admin:keygens"])
app.include_router(admin_keys.router, prefix="/admin/keys", tags=["admin:keys"])
app.include_router(plugin.router, prefix="/plugin", tags=["plugin"])

@app.get("/health")
def health():
    return {"ok": True}
