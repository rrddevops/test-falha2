const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const databaseDir = path.join(__dirname, '..', 'database');
const databasePath = path.join(databaseDir, 'lab.db');
const seedPath = path.join(databaseDir, 'seed.sql');

if (!fs.existsSync(databaseDir)) {
  fs.mkdirSync(databaseDir, { recursive: true });
}

const seedSql = fs.readFileSync(seedPath, 'utf8');
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
