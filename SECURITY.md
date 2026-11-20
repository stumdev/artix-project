# Política de Segurança

O Artix controla licenças de software, então levamos segurança a sério.

## Reportando uma vulnerabilidade

Se encontrou uma falha de segurança, **não abra uma issue pública**. Use o recurso [Report a vulnerability](https://github.com/stumdev/artix-project/security/advisories/new) do GitHub e descreva o problema com o máximo de detalhes possível (sem incluir chaves reais de ninguém).

## O que já protege o sistema

- **Rotas administrativas** só com o header `X-Admin-Token`.
- **Respostas do `handshake` assinadas** com HMAC-SHA256 (`PLUGIN_HMAC_SECRET`), para o plugin conferir que vieram da sua API.
- **Auditoria** de todas as ações administrativas.

## Boas práticas ao rodar o seu servidor

- Troque `ADMIN_TOKEN` e `PLUGIN_HMAC_SECRET` por valores longos e aleatórios antes de ir para produção.
- O token do painel fica visível no navegador (`NEXT_PUBLIC_ADMIN_TOKEN`): exponha o painel só em rede privada ou atrás de autenticação.
- Use HTTPS (Cloudflare Tunnel, Caddy ou nginx) na frente da API.
- Nunca versione `.env` nem o banco (o `.gitignore` já cobre).
