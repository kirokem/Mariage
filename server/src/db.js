import Database from 'better-sqlite3';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ROOMS, SEED_RESERVED_ROOM_IDS, FORFAIT } from './rooms-data.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '..', 'data', 'wedding.sqlite');

export const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    created_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    room_id TEXT NOT NULL UNIQUE,
    nom TEXT NOT NULL,
    email TEXT NOT NULL,
    guests INTEGER NOT NULL,
    total INTEGER NOT NULL,
    created_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS photos (
    slot_id TEXT PRIMARY KEY,
    filename TEXT NOT NULL,
    updated_at INTEGER NOT NULL
  );
`);

const roomById = new Map(ROOMS.map((r) => [r.id, r]));
const seedExisting = db.prepare('SELECT room_id FROM bookings WHERE room_id = ?');
const insertSeed = db.prepare(
  'INSERT INTO bookings (room_id, nom, email, guests, total, created_at) VALUES (?, ?, ?, ?, ?, ?)'
);

const seedRooms = db.transaction(() => {
  for (const roomId of SEED_RESERVED_ROOM_IDS) {
    if (seedExisting.get(roomId)) continue;
    const room = roomById.get(roomId);
    if (!room) continue;
    insertSeed.run(roomId, 'Invités', 'reserve@charlene-et-julien.fr', 2, FORFAIT * 2, Date.now());
  }
});
seedRooms();
