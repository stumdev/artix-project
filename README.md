# Artix Project

> API e painel administrativo do Artix para gerenciar produtos, keygens e licenças.

| Campo | Valor |
| --- | --- |
| API | Python, FastAPI e SQLAlchemy |
| Painel | Next.js 14, React 18 e Tailwind |
| Banco | SQLite em desenvolvimento, PostgreSQL via `DATABASE_URL` |
| Mantido por | stumdev |
| Licença | Não especificada |

## Projetos

| Pasta | Conteúdo |
| --- | --- |
| [`API/`](API) | API FastAPI com rotas administrativas e rotas para plugins |
| [`Painel-ADMIN/`](Painel-ADMIN) | Painel web escuro, com tabelas, filtros e ações em massa |

## API

```bash
cd API
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
```

Rotas administrativas (cabeçalho `X-Admin-Token`, definido por `ADMIN_TOKEN` no `.env`):

- `/admin/products`: produtos
- `/admin/keygens`: keygens
- `/admin/keys`: keys (filtros, criação em lote, `ban`, `unban`, `reset` e `revoke`)

Rotas para plugins: `POST /plugin/handshake` e `POST /plugin/check`.

## Painel

```bash
cd Painel-ADMIN
npm install
cp .env.example .env
npm run dev
```

O painel abre em `http://localhost:3001` e se conecta à API pelas variáveis `NEXT_PUBLIC_API_URL` e `NEXT_PUBLIC_ADMIN_TOKEN`.

## Documentação relacionada

O guia de integração para desenvolvedores de plugins está em [artix-license-validation](https://github.com/stumdev/artix-license-validation).
