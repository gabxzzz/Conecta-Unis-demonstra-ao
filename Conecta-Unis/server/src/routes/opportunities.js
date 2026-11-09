import { Router } from 'express';
import { randomUUID } from 'node:crypto';
import { mutate, readDb } from '../db.js';
import { authRequired, optionalAuth, requireRole } from '../auth.js';
import { enrichOpportunity, sortNewest } from '../utils.js';

const router = Router();

function cleanList(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }
  if (typeof value === 'string') {
    return value
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

function normalizePayload(body) {
  return {
    title: String(body.title || '').trim(),
    area: String(body.area || '').trim(),
    type: String(body.type || '').trim(),
    modality: String(body.modality || '').trim(),
    city: String(body.city || '').trim(),
    salary: String(body.salary || '').trim(),
    deadline: String(body.deadline || '').trim(),
    description: String(body.description || '').trim(),
    responsibilities: cleanList(body.responsibilities),
    requirements: cleanList(body.requirements),
    benefits: cleanList(body.benefits)
  };
}

router.get('/', optionalAuth, (req, res) => {
  const db = readDb();
  const { q, area, modality, type, city } = req.query;

  let list = db.opportunities.filter((o) => o.status === 'publicada');

  if (q) {
    const term = String(q).toLowerCase();
    list = list.filter((o) => {
      const company = db.companies.find((c) => c.id === o.companyId);
      return [o.title, o.description, o.area, o.city, company?.name]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(term));
    });
  }
  if (area && area !== 'Todas') list = list.filter((o) => o.area === area);
  if (modality && modality !== 'Todas') list = list.filter((o) => o.modality === modality);
  if (type && type !== 'Todos') list = list.filter((o) => o.type === type);
  if (city && city !== 'Todas') list = list.filter((o) => o.city === city);

  const enriched = list
    .map((o) => enrichOpportunity(db, o, req.user))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  res.json(enriched);
});

router.get('/:id', optionalAuth, (req, res) => {
  const db = readDb();
  const opportunity = db.opportunities.find((o) => o.id === req.params.id);
  if (!opportunity) return res.status(404).json({ message: 'Oportunidade não encontrada.' });

  const isOwner = req.user && req.user.role === 'company' && req.user.companyId === opportunity.companyId;
  const isAdmin = req.user && req.user.role === 'admin';
  if (opportunity.status !== 'publicada' && !isOwner && !isAdmin) {
    return res.status(404).json({ message: 'Oportunidade não encontrada.' });
  }

  res.json(enrichOpportunity(db, opportunity, req.user));
});

router.post('/', authRequired, requireRole('company'), (req, res) => {
  const data = normalizePayload(req.body || {});
  if (!data.title) return res.status(400).json({ message: 'Informe o título da oportunidade.' });
  if (!data.area) return res.status(400).json({ message: 'Informe a área de atuação.' });
  if (!data.description) return res.status(400).json({ message: 'Informe uma descrição.' });
  if (!data.deadline) return res.status(400).json({ message: 'Informe o prazo de inscrição.' });

  const company = req.company;
  if (!company) return res.status(404).json({ message: 'Perfil da empresa não encontrado.' });

  const now = new Date().toISOString();
  const opportunity = {
    id: `opp_${randomUUID()}`,
    companyId: company.id,
    ...data,
    status: company.status === 'aprovada' ? 'publicada' : 'aguardando',
    createdAt: now,
    updatedAt: now
  };

  mutate((db) => {
    db.opportunities.push(opportunity);
  });

  const db = readDb();
  res.status(201).json(enrichOpportunity(db, opportunity, req.user));
});

router.put('/:id', authRequired, requireRole('company', 'admin'), (req, res) => {
  const data = normalizePayload(req.body || {});
  if (!data.title) return res.status(400).json({ message: 'Informe o título da oportunidade.' });
  if (!data.area) return res.status(400).json({ message: 'Informe a área de atuação.' });
  if (!data.description) return res.status(400).json({ message: 'Informe uma descrição.' });
  if (!data.deadline) return res.status(400).json({ message: 'Informe o prazo de inscrição.' });

  const db = readDb();
  const existing = db.opportunities.find((o) => o.id === req.params.id);
  if (!existing) return res.status(404).json({ message: 'Oportunidade não encontrada.' });

  if (req.user.role === 'company' && existing.companyId !== req.user.companyId) {
    return res.status(403).json({ message: 'Você não pode editar esta oportunidade.' });
  }

  const updated = mutate((draft) => {
    const target = draft.opportunities.find((o) => o.id === req.params.id);
    Object.assign(target, data, { updatedAt: new Date().toISOString() });
    return target;
  });

  res.json(enrichOpportunity(readDb(), updated, req.user));
});

router.patch('/:id/status', authRequired, requireRole('company', 'admin'), (req, res) => {
  const status = String(req.body?.status || '');
  const allowed = ['publicada', 'aguardando', 'encerrada', 'rascunho'];
  if (!allowed.includes(status)) {
    return res.status(400).json({ message: 'Status inválido.' });
  }

  const db = readDb();
  const existing = db.opportunities.find((o) => o.id === req.params.id);
  if (!existing) return res.status(404).json({ message: 'Oportunidade não encontrada.' });

  if (req.user.role === 'company' && existing.companyId !== req.user.companyId) {
    return res.status(403).json({ message: 'Você não pode alterar esta oportunidade.' });
  }

  const updated = mutate((draft) => {
    const target = draft.opportunities.find((o) => o.id === req.params.id);
    target.status = status;
    target.updatedAt = new Date().toISOString();
    return target;
  });

  res.json(enrichOpportunity(readDb(), updated, req.user));
});

router.get('/company/mine', authRequired, requireRole('company'), (req, res) => {
  const db = readDb();
  const list = db.opportunities
    .filter((o) => o.companyId === req.user.companyId)
    .map((o) => enrichOpportunity(db, o, req.user));
  res.json(sortNewest(list));
});

export default router;
