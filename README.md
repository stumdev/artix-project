<div align="center">

<img src="docs/banner.svg" alt="Artix" width="100%">

<br>

[![License: MIT](https://img.shields.io/badge/license-MIT-66E1F5.svg)](LICENSE)
![Python](https://img.shields.io/badge/Python-3.10%2B-3776AB?logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?logo=fastapi&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-14-000000?logo=nextdotjs&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwindcss&logoColor=white)
![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-2-D71F00)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-66E1F5.svg)](CONTRIBUTING.md)

**API e painel administrativo do Artix para gerenciar produtos, keygens e licenças.**

[Instalação](#instalação) · [API](#referência-da-api) · [Painel](#painel) · [Contribuir](CONTRIBUTING.md) · [Changelog](CHANGELOG.md)

</div>

---

## Sobre

O Artix é um sistema de licenças para quem vende plugins e softwares. Você cadastra os **produtos**, cria **keygens** (o formato das chaves de cada produto), gera **licenças** em lote e acompanha tudo num painel: banir, reativar, revogar, resetar o IP vinculado e excluir.

Os plugins dos seus clientes consultam a API para saber se a licença é válida. O guia de integração para quem desenvolve plugins está em [artix-license-validation](https://github.com/stumdev/artix-license-validation).

## Destaques

- 🗂️ **Produtos, keygens e licenças** com relacionamento completo: cada keygen gera chaves num formato próprio (prefixo, blocos e separador).
- ⚡ **Ações em massa** no painel: banir, desbanir e revogar várias licenças de uma vez.
- 🔁 **Reset de IP** para quando o servidor do cliente muda de endereço.
- 🧾 **Auditoria**: toda ação administrativa fica registrada com autor, alvo e detalhes.
- 🔌 **Rotas para plugins**: `check` simples por chave e `handshake` com resposta assinada por HMAC.
- 🌙 **Painel escuro** em Next.js e Tailwind, com filtros, busca, cópia rápida das chaves e uma tela para testar a validação.
- 🐘 **SQLite para começar, PostgreSQL em produção**: basta trocar a `DATABASE_URL`.

---

## Sumário

- [Instalação](#instalação)
- [Configuração](#configuração)
- [Referência da API](#referência-da-api)
- [Painel](#painel)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Limitações](#limitações)
- [Roadmap](#roadmap)
- [Contribuindo](#contribuindo)
- [Licença](#licença)

## Instalação

Requisitos: **Python 3.10+** e **Node.js 18+**.

```bash
git clone https://github.com/stumdev/artix-project.git
cd artix-project

# API (http://localhost:8000)
cd API
python -m venv .venv && source .venv/bin/activate   # no Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload

# painel (http://localhost:3001), em outro terminal
cd Painel-ADMIN
npm install
cp .env.example .env
npm run dev
```

A documentação interativa da API fica em `http://localhost:8000/docs`.

## Configuração

### API (`API/.env`)

| Variável | Para quê | Padrão |
|---|---|---|
| `DATABASE_URL` | banco de dados (SQLite ou `postgresql+psycopg://...`) | `sqlite:///./artix.db` |
| `ADMIN_TOKEN` | token das rotas administrativas (header `X-Admin-Token`) | `changeme-admin` |
| `PLUGIN_HMAC_SECRET` | segredo que assina a resposta do `handshake` | `changeme-plugin` |

> Troque `ADMIN_TOKEN` e `PLUGIN_HMAC_SECRET` antes de colocar no ar.

### Painel (`Painel-ADMIN/.env`)

| Variável | Para quê |
|---|---|
| `NEXT_PUBLIC_API_URL` | endereço da API |
| `NEXT_PUBLIC_ADMIN_TOKEN` | o mesmo `ADMIN_TOKEN` da API |

## Referência da API

Rotas administrativas exigem o header `X-Admin-Token`.

| Método | Rota | Descrição |
|---|---|---|
| `GET` `POST` | `/admin/products` | lista e cria produtos |
| `PATCH` `DELETE` | `/admin/products/{id}` | edita e remove um produto |
| `GET` `POST` | `/admin/keygens` | lista e cria keygens |
| `PATCH` `DELETE` | `/admin/keygens/{id}` | edita e remove um keygen |
| `GET` | `/admin/keys` | lista licenças, com filtros |
| `POST` | `/admin/keys` | gera licenças em lote |
| `POST` | `/admin/keys/{id}/ban`, `/unban`, `/revoke`, `/reset` | muda o status ou reseta o IP |
| `DELETE` | `/admin/keys/{id}` | remove uma licença |
| `POST` | `/admin/keys/bulk` | ação em massa (`ban`, `unban`, `revoke`) |
| `POST` | `/plugin/check` | `{ "key": "..." }` → `{ valid, status, keygen, product_id, key_id }` |
| `POST` | `/plugin/handshake` | valida a chave e devolve a política (intervalo, carência, servidores) assinada com HMAC |

Status de uma licença: `ACTIVE`, `SUSPENDED`, `REVOKED`, `EXPIRED` e `BANNED`.

## Painel

| Página | O que faz |
|---|---|
| Produtos | cadastro com preço, moeda, descrição e limite de servidores |
| Keygens | formato das chaves por produto (prefixo, blocos, tamanho e separador) |
| Licenças | geração em lote, filtros, cópia rápida e ações individuais ou em massa |
| Validar | testa uma chave contra a API, como um plugin faria |

## Estrutura do projeto

```
artix-project/
├── API/                    # FastAPI + SQLAlchemy
│   └── app/
│       ├── main.py         # app e registro das rotas
│       ├── models.py       # produtos, keygens, licenças e auditoria
│       ├── routers/        # admin_products, admin_keygens, admin_keys, plugin
│       ├── crud/           # acesso ao banco
│       └── utils/audit.py  # registro de auditoria
├── Painel-ADMIN/           # Next.js 14 + Tailwind
│   ├── app/admin/          # products, keygens, keys, validate
│   ├── components/         # barra de ações em massa, badges, navegação
│   └── lib/api.ts          # cliente da API
└── docs/                   # banner
```

## Limitações

- O token do painel vai em `NEXT_PUBLIC_ADMIN_TOKEN`, ou seja, fica visível no navegador. Rode o painel só em rede privada ou atrás de autenticação (por exemplo, Cloudflare Access).
- Ainda não há login com usuários e permissões no painel: quem tem o token tem acesso total.
- Não há migrações de banco: as tabelas são criadas na inicialização.

## Roadmap

- [x] Produtos, keygens e licenças com painel
- [x] Ações em massa, reset de IP e auditoria
- [ ] Login de administradores no painel (sem token no navegador)
- [ ] Migrações com Alembic
- [ ] Webhooks de venda para gerar licenças automaticamente

Tem uma ideia? [Abra uma issue](https://github.com/stumdev/artix-project/issues/new/choose).

## Contribuindo

Contribuições são bem-vindas! Leia o [guia de contribuição](CONTRIBUTING.md) e o [código de conduta](CODE_OF_CONDUCT.md). Para falhas de segurança, veja a [política de segurança](SECURITY.md).

## Licença

Distribuído sob a licença [MIT](LICENSE).
