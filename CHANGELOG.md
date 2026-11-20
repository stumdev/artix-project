# Changelog

Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e versionamento [SemVer](https://semver.org/lang/pt-BR/).

## [1.0.0] - 2026-11-20

### Adicionado
- **API** em FastAPI com produtos, keygens e licenças, ações em massa, reset de IP e auditoria das ações administrativas.
- **Rotas para plugins**: `POST /plugin/check` e `POST /plugin/handshake` com resposta assinada por HMAC.
- **Painel administrativo** em Next.js 14 e Tailwind, com filtros, cópia rápida, ações em massa e tela de validação.
- Suporte a SQLite (desenvolvimento) e PostgreSQL (`DATABASE_URL`).
- README, licença MIT e padronização do repositório.
