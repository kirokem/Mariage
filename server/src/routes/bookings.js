import { Router } from 'express';
import { db } from '../db.js';
import { ROOM_IDS, FORFAIT } from '../rooms-data.js';

const router = Router();
const insertBooking = db.prepare(
  'INSERT INTO bookings (room_id, nom, email, guests, total, created_at) VALUES (?, ?, ?, ?, ?, ?)'
);
const findBooking = db.prepare('SELECT room_id FROM bookings WHERE room_id = ?');

router.post('/', (req, res) => {
  const { roomId, guests, nom, email } = req.body || {};

  if (!ROOM_IDS.has(roomId)) return res.status(400).json({ error: 'invalid_room' });
  const guestCount = Number(guests);
  if (!Number.isInteger(guestCount) || guestCount < 1 || guestCount > 6) {
    return res.status(400).json({ error: 'invalid_guests' });
  }
  if (!String(nom || '').trim() || !String(email || '').trim()) {
    return res.status(400).json({ error: 'missing_fields' });
  }
  if (findBooking.get(roomId)) {
    return res.status(409).json({ error: 'room_taken' });
  }

  const total = guestCount * FORFAIT;
  insertBooking.run(roomId, nom.trim(), email.trim(), guestCount, total, Date.now());
  res.status(201).json({ roomId, guests: guestCount, total, nom: nom.trim(), email: email.trim() });
});

export default router;
