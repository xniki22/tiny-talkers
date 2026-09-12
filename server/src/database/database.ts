import Database from "better-sqlite3";

export const db =
  new Database("tiny-talkers.db");

db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    user_id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS sessions (
    session_id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    created_at TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    FOREIGN KEY (user_id)
      REFERENCES users(user_id)
      ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS children (
    child_id TEXT PRIMARY KEY,
    user_id TEXT,
    display_name TEXT NOT NULL,
    avatar TEXT NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY (user_id)
      REFERENCES users(user_id)
      ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS child_progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    child_id TEXT NOT NULL,
    level_id TEXT NOT NULL,
    completed INTEGER NOT NULL DEFAULT 0,
    completed_at TEXT,
    UNIQUE(child_id, level_id)
  );

  CREATE TABLE IF NOT EXISTS child_item_progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    child_id TEXT NOT NULL,
    level_id TEXT NOT NULL,
    item_id TEXT NOT NULL,
    completed INTEGER NOT NULL DEFAULT 0,
    completed_at TEXT,
    UNIQUE(child_id, level_id, item_id)
  );
`);

interface TableColumnRow {
  name: string;
}

const childColumns =
  db
    .prepare(`
      PRAGMA table_info(children)
    `)
    .all() as TableColumnRow[];

const hasUserIdColumn =
  childColumns.some(
    (column) =>
      column.name === "user_id"
  );

if (!hasUserIdColumn) {
  db.exec(`
    ALTER TABLE children
    ADD COLUMN user_id TEXT;
  `);
}

db.exec(`
  CREATE INDEX IF NOT EXISTS
    idx_children_user_id
  ON children(user_id);
`);