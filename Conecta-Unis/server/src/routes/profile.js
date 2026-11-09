import { Router } from 'express';
import { mutate, readDb } from '../db.js';
import { authRequired } from '../auth.js';
import { publicCompany, publicUser } from '../utils.js';

const router = Router();

router.put('/profile', authRequired, (req, res) => {
  const allowed = [
    'name',
    'phone',
    'bio',
    'university',
    'course',
    'period',
    'city',
    'linkedin',
    'resumeName'
  ];
  const body = req.body || {};

  const updated = mutate((db) => {
    const user = db.users.find((u) => u.id === req.user.id);
    if (!user) return null;
    for (const key of allowed) {
      if (body[key] !== undefined) {
        user[key] = typeof body[key] === 'string' ? body[key].trim() : body[key];
      }
    }
    if (Array.isArray(body.skills)) {
      user.skills = body.skills
        .map((skill) => String(skill).trim())
        .filter(Boolean)
        .slice(0, 30);
    }
    return user;
  });

  if (!updated) return res.status(404).json({ message: 'Perfil não encontrado.' });
  res.json({ user: publicUser(updated) });
});

router.put('/company/profile', authRequired, (req, res) => {
  if (req.user.role !== 'company' || !req.user.companyId) {
    return res.status(403).json({ message: 'Acesso exclusivo para empresas.' });
  }

  const allowed = [
    'name',
    'sector',
    'city',
    'description',
    'website',
    'contactEmail',
    'phone',
    'cnpj',
    'size'
  ];
  const body = req.body || {};

  const updated = mutate((db) => {
    const company = db.companies.find((c) => c.id === req.user.companyId);
    if (!company) return null;
    for (const key of allowed) {
      if (body[key] !== undefined) {
        company[key] = String(body[key]).trim();
      }
    }
    const user = db.users.find((u) => u.id === req.user.id);
    if (user && body.name) user.name = company.name;
    return company;
  });

  if (!updated) return res.status(404).json({ message: 'Empresa não encontrada.' });
  res.json({ company: publicCompany(updated) });
});

router.get('/companies/:id', (req, res) => {
  const db = readDb();
  const company = db.companies.find((c) => c.id === req.params.id);
  if (!company) return res.status(404).json({ message: 'Empresa não encontrada.' });

  const opportunities = db.opportunities.filter(
    (o) => o.companyId === company.id && o.status === 'publicada'
  );

  res.json({ company: publicCompany(company), openOpportunities: opportunities.length });
});

export default router;
