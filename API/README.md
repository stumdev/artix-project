# Artix Store API (Python, FastAPI)

API para gerenciar produtos, keygens e keys (licenças) com banco de dados via SQLAlchemy.
Pensada para integrar com um painel admin em Next.js e com plugins/bot futuramente.

## Rodar em dev

```bash
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt

# copiar .env.example -> .env e ajustar
cp .env.example .env

# iniciar
uvicorn app.main:app --reload
```

Por padrão usa SQLite para dev (arquivo `artix.db`). Para Postgres, ajuste `DATABASE_URL` no `.env`.

## Rotas principais (admin)
- `GET/POST /admin/products`
- `PATCH/DELETE /admin/products/{id}`
- `GET/POST /admin/keygens`
- `PATCH/DELETE /admin/keygens/{id}`
- `GET /admin/keys` (filtros: status, keygen_id, q, page/size)
- `POST /admin/keys` (criar 1..N)
- `POST /admin/keys/{id}/ban|unban|reset|revoke`
- `DELETE /admin/keys/{id}`

Headers administrativos: `X-Admin-Token: <seu_token>`
Configure em `.env` via `ADMIN_TOKEN`.
