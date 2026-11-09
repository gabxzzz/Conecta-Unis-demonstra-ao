import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'node:crypto';
import { readDb, mutate } from '../db.js';
import { JWT_SECRET, authRequired, createToken, meResponse } from '../auth.js';
import { companyForUser, publicCompany, publicUser } from '../utils.js';

const router = Router();
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post('/register', (req, res) => {
  const body = req.body || {};
  const role = body.role === 'company' ? 'company' : 'student';
  const name = String(body.name || '').trim();
  const email = String(body.email || '').trim().toLowerCase();
  const password = String(body.password || '');

  if (!name) return res.status(400).json({ message: 'Informe seu nome.' });
  if (!emailRegex.test(email)) return res.status(400).json({ message: 'Informe um e-mail válido.' });
  if (password.length < 6) {
    return res.status(400).json({ message: 'A senha deve ter pelo menos 6 caracteres.' });
  }

  if (role === 'company' && !String(body.companyName || '').trim()) {
    return res.status(400).json({ message: 'Informe o nome da empresa.' });
  }

  const db = readDb();
  if (db.users.some((u) => u.email === email)) {
    return res.status(409).json({ message: 'Já existe uma conta com este e-mail.' });
  }

  const userId = `usr_${randomUUID()}`;
  const createdAt = new Date().toISOString();
  const colors = ['#1f63e0', '#7c3aed', '#0f9f6e', '#e07a1f', '#d64545', '#0f4c81'];
  const avatarColor = colors[Math.floor(Math.random() * colors.length)];

  const user = {
    id: userId,
    name: role === 'company' ? String(body.companyName).trim() : name,
    email,
    passwordHash: bcrypt.hashSync(password, 10),
    role,
    status: 'ativo',
    avatarColor,
    createdAt
  };

  let company = null;

  db.users.push(user);

  if (role === 'company') {
    const companyId = `cmp_${randomUUID()}`;
    company = {
      id: companyId,
      userId,
      name: String(body.companyName).trim(),
      sector: String(body.sector || '').trim(),
      city: String(body.city || '').trim(),
      description: String(body.description || '').trim(),
      website: String(body.website || '').trim(),
      contactEmail: email,
      phone: String(body.phone || '').trim(),
      cnpj: String(body.cnpj || '').trim(),
      size: String(body.size || '11-50 colaboradores').trim(),
      status: 'pendente',
      verified: false,
      logoColor: avatarColor,
      createdAt
    };
    user.companyId = companyId;
    db.companies.push(company);
  } else {
    user.phone = String(body.phone || '').trim();
    user.university = String(body.university || '').trim();
    user.course = String(body.course || '').trim();
    user.period = String(body.period || '').trim();
    user.city = String(body.city || '').trim();
    user.bio = '';
    user.skills = [];
    user.linkedin = '';
    user.resumeName = '';
  }

  mutate((draft) => {
    draft.users.push(user);
    if (company) draft.companies.push(company);
  });

  return res.status(201).json({
    token: createToken(user),
    ...meResponse(user, publicCompany(company))
  });
});

router.post('/login', (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase();
  const password = String(req.body?.password || '');
  const db = readDb();
  const user = db.users.find((u) => u.email === email);

  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    return res.status(401).json({ message: 'E-mail ou senha incorretos.' });
  }
  if (user.status === 'suspenso') {
    return res.status(403).json({ message: 'Esta conta está suspensa. Fale com o suporte.' });
  }

  return res.json({
    token: createToken(user),
    ...meResponse(user, companyForUser(db, user))
  });
});

router.get('/me', authRequired, (req, res) => {
  res.json(meResponse(req.user, req.company));
});

router.post('/forgot', (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase();
  const db = readDb();
  const user = db.users.find((u) => u.email === email);
  let devToken = null;

  if (user) {
    const token = randomUUID();
    db.resets = db.resets.filter((r) => r.userId !== user.id);
    db.resets.push({
      token,
      userId: user.id,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString()
    });
    mutate((draft) => {
      draft.resets = db.resets;
    });
    devToken = token;
  }

  res.json({
    message:
      'Se este e-mail estiver cadastrado, enviaremos as instruções para redefinir a senha.',
    devToken,
    devLink: devToken ? `/redefinir-senha?token=${devToken}` : null
  });
});

router.post('/reset', (req, res) => {
  const token = String(req.body?.token || '');
  const password = String(req.body?.password || '');
  if (password.length < 8) {
    return res.status(400).json({ message: 'A nova senha deve ter pelo menos 8 caracteres.' });
  }

  const db = readDb();
  const reset = db.resets.find((r) => r.token === token);
  if (!reset || new Date(reset.expiresAt).getTime() < Date.now()) {
    return res.status(400).json({ message: 'Link inválido ou expirado. Solicite um novo.' });
  }

  const user = db.users.find((u) => u.id === reset.userId);
  if (!user) return res.status(400).json({ message: 'Usuário não encontrado.' });

  mutate((draft) => {
    const target = draft.users.find((u) => u.id === reset.userId);
    target.passwordHash = bcrypt.hashSync(password, 10);
    draft.resets = draft.resets.filter((r) => r.token !== token);
  });

  res.json({ message: 'Senha redefinida com sucesso. Você já pode entrar.' });
});

export { JWT_SECRET };
export default router;
