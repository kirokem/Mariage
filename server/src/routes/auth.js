import { Router } from 'express';
import { nanoid } from 'nanoid';
import { db } from '../db.js';
import { isAuthenticated, SESSION_COOKIE, SESSION_MAX_AGE_MS } from '../middleware/auth.js';

const router = Router();
const insertSession = db.prepare('INSERT INTO sessions (id, created_at) VALUES (?, ?)');
const deleteSession = db.prepare('DELETE FROM sessions WHERE id = ?');

const SITE_PASSWORD = process.env.SITE_PASSWORD || 'provence2027';

// In production the frontend (GitHub Pages) and backend (Render) are on
// different origins, so the session cookie must be SameSite=None + Secure to
// survive cross-site requests. Locally both run on http://localhost, where
// Secure cookies are rejected, so dev stays Lax + non-Secure.
const isProduction = process.env.NODE_ENV === 'production';
const cookieOptions = {
  httpOnly: true,
  sameSite: isProduction ? 'none' : 'lax',
  secure: isProduction,
  maxAge: SESSION_MAX_AGE_MS
};

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
  res.cookie(SESSION_COOKIE, sid, cookieOptions);
  res.json({ authenticated: true });
});

router.post('/logout', (req, res) => {
  const sid = req.cookies?.[SESSION_COOKIE];
  if (sid) deleteSession.run(sid);
  res.clearCookie(SESSION_COOKIE, cookieOptions);
  res.json({ authenticated: false });
});

export default router;
