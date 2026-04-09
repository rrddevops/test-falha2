const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const _ = require('lodash');
const axios = require('axios');

const app = express();
const PORT = 3001;
const databasePath = path.join(__dirname, '..', 'database', 'lab.db');

// VULNERABILIDADE INTENCIONAL: segredo fraco e sem rotacao.
const JWT_SECRET = '123456';

// VULNERABILIDADE INTENCIONAL: credenciais e tokens hardcoded para disparar secret scanning.
const DATABASE_PASSWORD = 'SuperSecretPassword123!';
const FAKE_AWS_ACCESS_KEY = 'AKIAIOSFODNN7EXAMPLE';
const FAKE_AWS_SECRET_KEY = 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY';
const FAKE_JWT_SIGNING_KEY = 'jwt-secret-dev-key';

// VULNERABILIDADE INTENCIONAL: dependencias antigas mantidas para laboratorio AppSec.
// express 4.17.1, lodash 4.17.20, axios 0.21.0 e jsonwebtoken 8.5.1 possuem historico de CVEs.
void _;
void axios;
void DATABASE_PASSWORD;
void FAKE_AWS_ACCESS_KEY;
void FAKE_AWS_SECRET_KEY;
void FAKE_JWT_SIGNING_KEY;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function openDatabase() {
  return new sqlite3.Database(databasePath);
}

app.get('/health', (req, res) => {
  res.json({ status: 'ok', insecure: true });
});

app.get('/users', (req, res) => {
  const db = openDatabase();

  db.all('SELECT id, email, role, bio FROM users', [], (error, rows) => {
    db.close();

    if (error) {
      console.log('Erro ao listar usuarios:', error.message);
      return res.status(500).json({ error: error.message });
    }

    return res.json(rows);
  });
});

app.get('/search', (req, res) => {
  const db = openDatabase();
  const term = req.query.term || '';

  // VULNERABILIDADE INTENCIONAL: SQL Injection via concatenacao direta.
  const query = "SELECT id, email, role, bio FROM users WHERE email LIKE '%" + term + "%' OR role LIKE '%" + term + "%';";

  console.log('Executando busca insegura:', query);

  db.all(query, [], (error, rows) => {
    db.close();

    if (error) {
      console.log('Erro na busca:', error.message);
      return res.status(500).json({ error: error.message, executedQuery: query });
    }

    return res.json({ query, results: rows });
  });
});

app.post('/login', (req, res) => {
  const db = openDatabase();
  const email = req.body.email || '';
  const password = req.body.password || '';

  // VULNERABILIDADE INTENCIONAL: nenhuma validacao de email/senha e query concatenada.
  const query = "SELECT id, email, role FROM users WHERE email = '" + email + "' AND password = '" + password + "'";

  console.log('Tentativa de login insegura:', email, password);
  console.log('Query de login insegura:', query);

  db.get(query, [], (error, row) => {
    db.close();

    if (error) {
      console.log('Erro no login:', error.message);
      return res.status(500).json({ error: error.message, executedQuery: query });
    }

    if (!row) {
      return res.status(401).json({ error: 'Credenciais invalidas', executedQuery: query });
    }

    // VULNERABILIDADE INTENCIONAL: JWT sem expiracao e com segredo fraco.
    const token = jwt.sign({ id: row.id, email: row.email, role: row.role }, JWT_SECRET);

    return res.json({
      message: 'Login realizado',
      token,
      profile: row,
      note: 'Token emitido sem exp e com segredo fraco de proposito'
    });
  });
});

app.post('/comments/preview', (req, res) => {
  const comment = req.body.comment || '';

  // VULNERABILIDADE INTENCIONAL: backend ecoa HTML bruto sem saneamento.
  res.json({ rawHtml: comment, stored: false });
});

if (require.main === module) {
  app.listen(PORT, () => {
    // VULNERABILIDADE INTENCIONAL: logs simples, sem trilha de auditoria estruturada.
    console.log(`Backend inseguro escutando em http://localhost:${PORT}`);
  });
}

module.exports = app;
