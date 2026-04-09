# Projeto fullstack para reteste AppSec

Este branch contem uma versao corrigida do laboratorio, preparada para reteste das validacoes AppSec.

O branch principal vulneravel continua sendo a referencia para testes negativos. Esta branch aplica mitigacoes para validar reducao dos findings em ferramentas de:

- SAST
- DAST
- SCA
- Secret scanning

## Aviso de uso

Use apenas em ambiente controlado, laboratorio local ou ambiente isolado.

## Correções aplicadas neste branch

- Remocao de `dangerouslySetInnerHTML` e renderizacao segura no frontend
- Parametrizacao de queries SQLite para eliminar SQL Injection
- Remocao de segredos hardcoded do codigo
- JWT com expiracao e segredo obtido por ambiente
- Headers de hardening via `helmet`
- Atualizacao de dependencias vulneraveis no backend
- Validacao basica de email, senha e parametro de busca
- Hash de senha com `bcryptjs` no seed e no login

## Estrutura

- `/frontend`: aplicacao React com renderizacao segura
- `/backend`: API Express com consultas parametrizadas e headers de protecao
- `/database`: seed SQL com hashes de senha gerados em runtime

## Como rodar localmente

### Opcao 1: npm

1. Instale dependencias do backend:
   - `cd backend`
   - `npm install`
2. Opcionalmente defina variaveis de ambiente em `backend/.env`:
   - `JWT_SECRET=defina-um-segredo-forte`
   - `ALLOWED_ORIGIN=http://localhost:5173`
3. Gere a base SQLite com dados de teste:
   - `npm run seed`
4. Inicie o backend:
   - `npm run dev`
5. Em outro terminal, instale dependencias do frontend:
   - `cd frontend`
   - `npm install`
6. Inicie o frontend:
   - `npm run dev`
7. Acesse:
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

- admin@example.com / AdminPass!2026
- user@example.com / UserPass!2026
- analyst@example.com / AnalystPass!2026

## Observacoes

- O branch principal continua sendo o ambiente inseguro de referencia.
- Esta branch existe para reteste das correcoes com a esteira AppSec.
