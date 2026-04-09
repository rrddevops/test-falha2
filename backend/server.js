const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const helmet = require('helmet');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = 3001;
const databasePath = path.join(__dirname, '..', 'database', 'lab.db');
const jwtSecret = process.env.JWT_SECRET || crypto.randomBytes(32).toString('hex');
const allowedOrigin = process.env.ALLOWED_ORIGIN || 'http://localhost:5173';

app.disable('x-powered-by');
app.use(helmet());
app.use(cors({ origin: allowedOrigin }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function openDatabase() {
  return new sqlite3.Database(databasePath);
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

app.get('/health', (req, res) => {
  res.json({ status: 'ok', insecure: false });
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
  const term = typeof req.query.term === 'string' ? req.query.term.trim() : '';

  if (term.length > 100) {
    db.close();
    return res.status(400).json({ error: 'Parametro de busca invalido' });
  }

  const query = 'SELECT id, email, role, bio FROM users WHERE email LIKE ? OR role LIKE ?';
  const likeTerm = `%${term}%`;

  db.all(query, [likeTerm, likeTerm], (error, rows) => {
    db.close();

    if (error) {
      console.error('Erro na busca:', error.message);
      return res.status(500).json({ error: 'Falha ao executar busca' });
    }

    return res.json({ results: rows });
  });
});

app.post('/login', (req, res) => {
  const db = openDatabase();
  const email = typeof req.body.email === 'string' ? req.body.email.trim() : '';
  const password = typeof req.body.password === 'string' ? req.body.password : '';

  if (!validateEmail(email) || password.length < 8 || password.length > 128) {
    db.close();
    return res.status(400).json({ error: 'Credenciais invalidas' });
  }

  db.get('SELECT id, email, password, role FROM users WHERE email = ?', [email], (error, row) => {
    db.close();

    if (error) {
      console.error('Erro no login:', error.message);
      return res.status(500).json({ error: 'Falha ao processar login' });
    }

    if (!row || !bcrypt.compareSync(password, row.password)) {
      return res.status(401).json({ error: 'Credenciais invalidas' });
    }

    const token = jwt.sign(
      { id: row.id, email: row.email, role: row.role },
      jwtSecret,
      { expiresIn: '1h', issuer: 'appsec-lab' }
    );

    return res.json({
      message: 'Login realizado',
      token,
      profile: { id: row.id, email: row.email, role: row.role }
    });
  });
});

app.post('/comments/preview', (req, res) => {
  const comment = typeof req.body.comment === 'string' ? req.body.comment : '';

  if (comment.length > 1000) {
    return res.status(400).json({ error: 'Comentario excede o tamanho permitido' });
  }

  res.json({ previewText: escapeHtml(comment), stored: false });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Backend protegido escutando em http://localhost:${PORT}`);
  });
}

module.exports = app;
