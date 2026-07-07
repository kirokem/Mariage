import { Router } from 'express';
import { db } from '../db.js';
import { ROOMS, FORFAIT } from '../rooms-data.js';

const router = Router();
const allBookings = db.prepare('SELECT room_id FROM bookings');

router.get('/', (req, res) => {
  const reservedIds = new Set(allBookings.all().map((b) => b.room_id));
  res.json({
    forfait: FORFAIT,
    rooms: ROOMS.map((room) => ({ ...room, reserved: reservedIds.has(room.id) }))
  });
});

export default router;
