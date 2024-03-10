import sqlite from 'better-sqlite3'

export const db = sqlite(':memory:')

db.exec(`CREATE TABLE IF NOT EXISTS user (
    id TEXT NOT NULL PRIMARY KEY
)`)

db.exec(`CREATE TABLE IF NOT EXISTS session (
    id TEXT NOT NULL PRIMARY KEY,
    expires_at INTEGER NOT NULL,
    user_id TEXT NOT NULL,
    access_token TEXT NOT NULL,
    access_token_expires_at INTEGER NOT NULL,
    id_token TEXT NOT NULL,
    refresh_token TEXT,
    refresh_token_expires_at INTEGER,
    FOREIGN KEY (user_id) REFERENCES user(id)
)`)

export interface DatabaseSession {
  id: string
  expires_at: number
  user_id: string
  access_token: string
  access_token_expires_at: number
  id_token: string
  refresh_token?: string
  refresh_token_expires_at?: number
}

export interface DatabaseUser {
  id: string
  name: string
}
