import { Router } from 'express';
import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { db } from '../db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const uploadsDir = path.join(__dirname, '..', '..', 'uploads');

const SLOT_ID_RE = /^[a-z0-9-]{1,64}$/;

const getPhoto = db.prepare('SELECT * FROM photos WHERE slot_id = ?');
const upsertPhoto = db.prepare(`
  INSERT INTO photos (slot_id, filename, updated_at) VALUES (?, ?, ?)
  ON CONFLICT(slot_id) DO UPDATE SET filename = excluded.filename, updated_at = excluded.updated_at
`);
const deletePhotoRow = db.prepare('DELETE FROM photos WHERE slot_id = ?');
const allPhotos = db.prepare('SELECT * FROM photos');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    cb(null, `${req.params.slotId}-${Date.now()}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (req, file, cb) => cb(null, file.mimetype.startsWith('image/'))
});

function removeFileIfExists(filename) {
  const filePath = path.join(uploadsDir, filename);
  fs.unlink(filePath, () => {});
}

const router = Router();

router.get('/', (req, res) => {
  const map = {};
  for (const row of allPhotos.all()) map[row.slot_id] = `/uploads/${row.filename}`;
  res.json(map);
});

router.post('/:slotId', (req, res, next) => {
  if (!SLOT_ID_RE.test(req.params.slotId)) return res.status(400).json({ error: 'invalid_slot' });
  next();
}, upload.single('photo'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'invalid_file' });
  const existing = getPhoto.get(req.params.slotId);
  upsertPhoto.run(req.params.slotId, req.file.filename, Date.now());
  if (existing) removeFileIfExists(existing.filename);
  res.status(201).json({ slotId: req.params.slotId, url: `/uploads/${req.file.filename}` });
});

router.delete('/:slotId', (req, res) => {
  if (!SLOT_ID_RE.test(req.params.slotId)) return res.status(400).json({ error: 'invalid_slot' });
  const existing = getPhoto.get(req.params.slotId);
  if (existing) {
    deletePhotoRow.run(req.params.slotId);
    removeFileIfExists(existing.filename);
  }
  res.status(204).end();
});

export default router;
