const Database = require("better-sqlite3");
const path = require("path");
const bcrypt = require("bcryptjs");

const dbPath = path.join(__dirname, "corporate.db");
const db = new Database(dbPath);

db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    phone TEXT DEFAULT '',
    role TEXT DEFAULT 'operator',
    active INTEGER DEFAULT 1,
    departmentId INTEGER DEFAULT NULL,
    createdAt TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS departments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT DEFAULT '',
    parentId INTEGER DEFAULT NULL,
    responsibleId INTEGER DEFAULT NULL,
    createdAt TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (parentId) REFERENCES departments(id) ON DELETE SET NULL
  );

  CREATE TABLE IF NOT EXISTS visitors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT DEFAULT '',
    document TEXT DEFAULT '',
    company TEXT DEFAULT '',
    photo TEXT DEFAULT NULL,
    isDisposable INTEGER DEFAULT 0,
    departmentId INTEGER DEFAULT NULL,
    responsibleId INTEGER DEFAULT NULL,
    status TEXT DEFAULT 'scheduled',
    purpose TEXT DEFAULT '',
    scheduledAt TEXT DEFAULT (datetime('now')),
    checkinAt TEXT DEFAULT NULL,
    checkoutAt TEXT DEFAULT NULL,
    createdAt TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (departmentId) REFERENCES departments(id) ON DELETE SET NULL
  );

  CREATE TABLE IF NOT EXISTS timeline_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    visitorId INTEGER NOT NULL,
    type TEXT NOT NULL,
    description TEXT NOT NULL,
    author TEXT DEFAULT '',
    timestamp TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (visitorId) REFERENCES visitors(id) ON DELETE CASCADE
  );
`);

try { db.exec("ALTER TABLE visitors ADD COLUMN isDisposable INTEGER DEFAULT 0"); } catch (e) {}

const existing = db.prepare("SELECT id FROM users WHERE email = ?").get("admin.admin@admin.com");

if (!existing) {
  const hash = bcrypt.hashSync("admin@123", 10);
  db.prepare(
    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)"
  ).run("Admin Principal", "admin.admin@admin.com", hash, "admin");
  console.log("✓ Usuário admin criado: admin.admin@admin.com");
}

module.exports = db;
