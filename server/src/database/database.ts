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

  CREATE TABLE IF NOT EXISTS custom_levels (
    custom_level_id TEXT PRIMARY KEY,
    child_id TEXT NOT NULL,
    title TEXT NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY (child_id)
      REFERENCES children(child_id)
      ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS custom_level_items (
    item_id TEXT PRIMARY KEY,
    custom_level_id TEXT NOT NULL,
    text TEXT NOT NULL,
    item_type TEXT NOT NULL,
    order_number INTEGER NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY (custom_level_id)
      REFERENCES custom_levels(custom_level_id)
      ON DELETE CASCADE
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

  CREATE INDEX IF NOT EXISTS
    idx_custom_levels_child_id
  ON custom_levels(child_id);

  CREATE INDEX IF NOT EXISTS
    idx_custom_level_items_level_id
  ON custom_level_items(
    custom_level_id
  );
`);