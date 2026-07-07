import { db } from '../db.js';

const SESSION_COOKIE = 'cj_session';
const SESSION_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 180; // 180 days — guests shouldn't have to re-enter the password often

const getSession = db.prepare('SELECT * FROM sessions WHERE id = ?');

export function requireAuth(req, res, next) {
  const sid = req.cookies?.[SESSION_COOKIE];
  const session = sid ? getSession.get(sid) : null;
  if (!session || Date.now() - session.created_at > SESSION_MAX_AGE_MS) {
    return res.status(401).json({ error: 'unauthorized' });
  }
  next();
}

export function isAuthenticated(req) {
  const sid = req.cookies?.[SESSION_COOKIE];
  const session = sid ? getSession.get(sid) : null;
  return Boolean(session && Date.now() - session.created_at <= SESSION_MAX_AGE_MS);
}

export { SESSION_COOKIE, SESSION_MAX_AGE_MS };
