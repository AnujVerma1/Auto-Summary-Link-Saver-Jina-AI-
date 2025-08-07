CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE,
  password_hash TEXT,
  google_id TEXT
);

CREATE TABLE IF NOT EXISTS bookmarks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  url TEXT,
  title TEXT,
  favicon_url TEXT,  
  summary TEXT,
  tags TEXT,
  order_index INTEGER DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
