--psql scrawny-starfish < schema.sql

DROP TABLE IF EXISTS list_items;

CREATE TABLE list_items
(
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  todo VARCHAR(255) NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  checked BOOLEAN DEFAULT FALSE,
  list_order INTEGER NOT NULL
);

DROP TABLE IF EXISTS users;

CREATE TABLE users
(
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL
);
