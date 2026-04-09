# Matriz de Validacao AppSec

Projeto inseguro para fins educacionais/teste. Use apenas em ambiente controlado.

## Objetivo

Esta matriz serve para comparar o que foi implementado no laboratorio com o que a esteira AppSec efetivamente detectou.

## Resultado observado ate agora

- Detectado: lodash vulneravel via SCA
- Detectado: ausencia de hardening headers via DAST
- Nao detectado ate agora: SQL Injection, XSS, segredos expostos, JWT inseguro e outras dependencias vulneraveis

## Matriz

| ID | Vulnerabilidade implementada | Local principal | Ferramenta que deveria sinalizar | Status observado | Observacao |
| --- | --- | --- | --- | --- | --- |
| 1 | Lodash vulneravel 4.17.20 | [backend/package.json](backend/package.json#L16) | SCA | Detectado | Finding SCA-NPM-LODASH-001 coerente com o laboratorio |
| 2 | Axios vulneravel 0.21.0 | [backend/package.json](backend/package.json#L12) | SCA | Nao detectado | Vale revisar cobertura do banco de CVEs ou politica SCA |
| 3 | Express antigo 4.17.1 | [backend/package.json](backend/package.json#L14) | SCA | Nao detectado | Esperado ao menos como componente desatualizado dependendo da base de CVEs |
| 4 | JsonWebToken antigo 8.5.1 | [backend/package.json](backend/package.json#L15) | SCA | Nao detectado | Pode indicar lacuna de inteligencia SCA ou regra desabilitada |
| 5 | SQL Injection em busca | [backend/server.js](backend/server.js#L58) | SAST e DAST | Nao detectado | Query concatenada com parametro de usuario deveria aparecer |
| 6 | SQL Injection em login | [backend/server.js](backend/server.js#L79) | SAST e DAST | Nao detectado | Endpoint sensivel e bom candidato para payloads de autenticacao |
| 7 | XSS DOM via dangerouslySetInnerHTML | [frontend/src/App.jsx](frontend/src/App.jsx#L93) | SAST e DAST | Nao detectado | Pode indicar que a varredura nao cobriu a SPA ou nao executou DOM XSS |
| 8 | XSS armazenado/refletido por bio renderizada | [frontend/src/App.jsx](frontend/src/App.jsx#L127) | SAST e DAST | Nao detectado | Bom ponto para validar scanner com dado vindo da API |
| 9 | JWT com segredo fraco | [backend/server.js](backend/server.js#L14) | SAST e Secret scanning | Nao detectado | Segredo literal fraco e sem gestao segura |
| 10 | JWT sem expiracao | [backend/server.js](backend/server.js#L103) | SAST | Nao detectado | Regra comum para bibliotecas JWT |
| 11 | Credenciais expostas no codigo | [backend/server.js](backend/server.js#L17) | Secret scanning | Nao detectado | Inclui senha hardcoded e chaves fake com padrao reconhecivel |
| 12 | Falta de validacao de input | [backend/server.js](backend/server.js#L81) | SAST | Nao detectado | Nem sempre vira finding isolado, mas reforca SQLi |
| 13 | Ausencia de protecao CSRF | [backend/server.js](backend/server.js#L79) | DAST e SAST | Nao detectado | Algumas ferramentas nao marcam APIs JSON simples sem sessao/cookie |
| 14 | Hardening headers ausentes | [backend/server.js](backend/server.js#L28) | DAST | Detectado | Finding DAST-HTTP-HEADERS-001 coerente com o laboratorio |
| 15 | Baixa cobertura de testes | [backend/tests/basic.test.js](backend/tests/basic.test.js#L1) | Fora do escopo AppSec classico | Nao aplicavel | Mais util para governanca/qualidade do que para AppSec |
| 16 | Logs sem auditoria | [backend/server.js](backend/server.js#L124) | SAST ou checklist manual | Nao detectado | Nem toda suite AppSec cobre maturidade de logging |

## Leitura recomendada dos gaps

- Se SCA so encontrou lodash, revise o feed de vulnerabilidades, severidade minima e escopo de manifestos analisados.
- Se DAST nao encontrou SQL Injection e XSS, confirme autenticacao, crawling da SPA React, payloads ativos e cobertura dos endpoints [backend/server.js](backend/server.js#L58) e [backend/server.js](backend/server.js#L79).
- Se secret scanning nao encontrou os hardcoded, valide se o modulo estava habilitado e se ele ignora credenciais de exemplo conhecidas.
- Se SAST nao encontrou JWT inseguro, SQL concatenado e dangerouslySetInnerHTML, revise regras para JavaScript/Node.js/React e escopo das pastas frontend/backend.

## Checklist rapido para repetir a validacao

- Confirmar que frontend e backend foram ambos incluidos no scan.
- Confirmar que o scanner DAST navega a SPA e executa JavaScript.
- Confirmar que o DAST exercita POST em /login e GET em /search.
- Confirmar que SAST esta analisando [backend/server.js](backend/server.js) e [frontend/src/App.jsx](frontend/src/App.jsx).
- Confirmar que secret scanning esta ativo para codigo fonte e nao apenas para historico Git remoto.
- Confirmar que SCA esta lendo [backend/package.json](backend/package.json) inteiro e nao apenas lockfile ausente/parcial.

## Conclusao

Com base no laboratorio implementado, os dois findings recebidos fazem sentido, mas a deteccao parece parcial. O principal ponto de observacao e a ausencia de alertas para SQL Injection, XSS, segredos expostos e parte das dependencias vulneraveis.