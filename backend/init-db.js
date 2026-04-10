const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

const databaseDir = path.join(__dirname, '..', 'database');
const databasePath = path.join(databaseDir, 'lab.db');
const seedPath = path.join(databaseDir, 'seed.sql');

if (!fs.existsSync(databaseDir)) {
  fs.mkdirSync(databaseDir, { recursive: true });
}

const seedTemplate = fs.readFileSync(seedPath, 'utf8');
const seedSql = seedTemplate
  .replaceAll('__ADMIN_PASSWORD_HASH__', bcrypt.hashSync('AdminPass!2026', 10))
  .replaceAll('__USER_PASSWORD_HASH__', bcrypt.hashSync('UserPass!2026', 10))
  .replaceAll('__ANALYST_PASSWORD_HASH__', bcrypt.hashSync('AnalystPass!2026', 10))
  .replaceAll('__XSS_PASSWORD_HASH__', bcrypt.hashSync('XssPass!2026', 10));
const db = new sqlite3.Database(databasePath);

console.log('Inicializando banco inseguro em:', databasePath);

db.exec(seedSql, (error) => {
  if (error) {
    console.error('Erro ao aplicar seed:', error.message);
    process.exitCode = 1;
  } else {
    console.log('Seed aplicada com sucesso.');
  }

  db.close();
});
