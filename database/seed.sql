DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL,
  secret_hash TEXT NOT NULL,
  role TEXT NOT NULL,
  bio TEXT
);

INSERT INTO users (email, secret_hash, role, bio) VALUES
  ('admin@example.com', '__ADMIN_PASSWORD_HASH__', 'admin', 'Administrador com acesso total.'),
  ('user@example.com', '__USER_PASSWORD_HASH__', 'user', 'Usuario comum do laboratorio.'),
  ('analyst@example.com', '__ANALYST_PASSWORD_HASH__', 'analyst', 'Perfil usado para testes de busca.'),
  ('xss@example.com', '__XSS_PASSWORD_HASH__', 'user', 'Perfil de demonstracao com bio segura.');
