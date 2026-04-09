# Projeto propositalmente vulneravel

Projeto inseguro para fins educacionais/teste.

Este repositorio contem uma aplicacao fullstack React + Express + SQLite criada intencionalmente com falhas de seguranca para validar ferramentas de:

- SAST
- DAST
- SCA
- Secret scanning

## Aviso de uso

Projeto propositalmente vulneravel. Use apenas em ambiente controlado, laboratorio local ou ambiente isolado. Nao publique em producao e nao exponha a internet.

## Vulnerabilidades incluidas

- XSS no frontend usando `dangerouslySetInnerHTML` sem sanitizacao
- SQL Injection no backend com concatenacao direta em query SQL
- Dependencias antigas com CVEs conhecidos:
  - express 4.17.1
  - lodash 4.17.20
  - axios 0.21.0
  - jsonwebtoken 8.5.1
- Credenciais expostas no codigo
- JWT com segredo fraco e sem expiracao
- Falta de validacao de input
- Ausencia de protecao CSRF
- Logs simples sem auditoria
- Cobertura de testes quase inexistente

## Estrutura

- `/frontend`: aplicacao React vulneravel a XSS
- `/backend`: API Express vulneravel a SQL Injection e configuracoes inseguras
- `/database`: seed SQL e banco SQLite gerado localmente

## Como rodar localmente

### Opcao 1: npm

1. Instale dependencias do backend:
   - `cd backend`
   - `npm install`
2. Gere a base SQLite com dados de teste:
   - `npm run seed`
3. Inicie o backend:
   - `npm run dev`
4. Em outro terminal, instale dependencias do frontend:
   - `cd frontend`
   - `npm install`
5. Inicie o frontend:
   - `npm run dev`
6. Acesse:
   - Frontend: http://localhost:5173
   - Backend: http://localhost:3001

### Opcao 2: Docker Compose

1. Na raiz do projeto execute:
   - `docker compose up --build`
2. Acesse:
   - Frontend: http://localhost:5173
   - Backend: http://localhost:3001

## Dados de teste

A seed cria usuarios de laboratorio, por exemplo:

- admin@example.com / admin123
- user@example.com / password
- analyst@example.com / qwerty

## Observacoes

- O backend mantem comentarios no codigo indicando que as falhas sao intencionais.
- O frontend expoe HTML injetado sem qualquer sanitizacao.
- O projeto inclui apenas um teste basico para manter a cobertura baixa de forma intencional.
