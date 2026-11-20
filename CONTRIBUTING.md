# Contribuindo com o Artix

Obrigado por querer ajudar! Qualquer contribuição é bem-vinda: bugs, ideias, documentação e código.

## Preparando o ambiente

Você vai precisar de **Python 3.10+** e **Node.js 18+**.

```bash
git clone https://github.com/stumdev/artix-project.git
cd artix-project

cd API && python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt && cp .env.example .env
uvicorn app.main:app --reload            # http://localhost:8000/docs

cd ../Painel-ADMIN && npm install && cp .env.example .env
npm run dev                              # http://localhost:3001
```

## Fluxo

1. Faça um fork e crie uma branch: `git checkout -b minha-mudanca`.
2. Faça a mudança e confira que a API sobe e o painel compila (`npm run build` em `Painel-ADMIN/`).
3. Abra um Pull Request explicando o que mudou e por quê.

Use [Conventional Commits](https://www.conventionalcommits.org/pt-br/) nas mensagens (`feat:`, `fix:`, `docs:`, `chore:`).

## Boas práticas

- Textos do painel e documentação em português do Brasil.
- Toda ação administrativa nova deve gerar um registro de auditoria (`utils/audit.py`).
- **Nunca commite** `.env`, bancos `.db`, tokens nem chaves de licença reais.
