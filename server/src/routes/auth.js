import { Router } from 'express';
import { nanoid } from 'nanoid';
import { db } from '../db.js';
import { isAuthenticated, SESSION_COOKIE, SESSION_MAX_AGE_MS } from '../middleware/auth.js';

const router = Router();
const insertSession = db.prepare('INSERT INTO sessions (id, created_at) VALUES (?, ?)');
const deleteSession = db.prepare('DELETE FROM sessions WHERE id = ?');

const SITE_PASSWORD = process.env.SITE_PASSWORD || 'provence2027';

router.get('/session', (req, res) => {
  res.json({ authenticated: isAuthenticated(req) });
});

router.post('/login', (req, res) => {
  const password = String(req.body?.password || '').trim().toLowerCase();
  if (password !== SITE_PASSWORD.toLowerCase()) {
    return res.status(401).json({ error: 'invalid_password' });
  }
  const sid = nanoid(32);
  insertSession.run(sid, Date.now());
  res.cookie(SESSION_COOKIE, sid, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE_MS
  });
  res.json({ authenticated: true });
});

router.post('/logout', (req, res) => {
  const sid = req.cookies?.[SESSION_COOKIE];
  if (sid) deleteSession.run(sid);
  res.clearCookie(SESSION_COOKIE);
  res.json({ authenticated: false });
});

export default router;
