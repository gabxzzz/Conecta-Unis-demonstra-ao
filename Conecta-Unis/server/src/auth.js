import jwt from 'jsonwebtoken';
import { readDb } from './db.js';
import { companyForUser, publicUser } from './utils.js';

export const JWT_SECRET = process.env.JWT_SECRET || 'conecta-unis-dev-secret';

export function createToken(user) {
  return jwt.sign({ sub: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
}

export function optionalAuth(req, _res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (token) {
    try {
      const payload = jwt.verify(token, JWT_SECRET);
      const db = readDb();
      const user = db.users.find((u) => u.id === payload.sub);
      if (user && user.status !== 'suspenso') {
        req.user = user;
        req.company = companyForUser(db, user);
      }
    } catch {
      req.user = null;
    }
  }
  next();
}

export function authRequired(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'Você precisa entrar para continuar.' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const db = readDb();
    const user = db.users.find((u) => u.id === payload.sub);
    if (!user) {
      return res.status(401).json({ message: 'Sessão inválida. Entre novamente.' });
    }
    if (user.status === 'suspenso') {
      return res.status(403).json({ message: 'Esta conta está suspensa.' });
    }
    req.user = user;
    req.company = companyForUser(db, user);
    next();
  } catch {
    return res.status(401).json({ message: 'Sessão expirada. Entre novamente.' });
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Acesso não permitido para este perfil.' });
    }
    next();
  };
}

export function meResponse(user, company) {
  return { user: publicUser(user), company: company || null };
}
