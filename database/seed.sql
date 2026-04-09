DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL,
  bio TEXT
);

INSERT INTO users (email, password, role, bio) VALUES
  ('admin@example.com', 'admin123', 'admin', 'Administrador com acesso total.'),
  ('user@example.com', 'password', 'user', 'Usuario comum do laboratorio.'),
  ('analyst@example.com', 'qwerty', 'analyst', 'Perfil usado para testes de busca.'),
  ('xss@example.com', '123456', 'user', '<img src=x onerror="alert(''seed-xss'')">');
