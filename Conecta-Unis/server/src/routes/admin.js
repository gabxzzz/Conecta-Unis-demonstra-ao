import { Router } from 'express';
import { mutate, readDb } from '../db.js';
import { authRequired, requireRole } from '../auth.js';
import {
  addNotification,
  enrichApplication,
  enrichOpportunity,
  publicUser,
  sortNewest
} from '../utils.js';

const router = Router();
router.use(authRequired, requireRole('admin'));

router.get('/stats', (_req, res) => {
  const db = readDb();
  const students = db.users.filter((u) => u.role === 'student');
  const companies = db.companies;
  const opportunities = db.opportunities;
  const applications = db.applications;

  const months = [];
  const now = new Date();
  for (let i = 5; i >= 0; i -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      key: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
      label: new Intl.DateTimeFormat('pt-BR', { month: 'short' })
        .format(date)
        .replace('.', '')
        .replace(/^./, (char) => char.toUpperCase()),
      count: 0
    });
  }
  for (const application of applications) {
    const date = new Date(application.createdAt);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const month = months.find((m) => m.key === key);
    if (month) month.count += 1;
  }

  const statusConfig = [
    ['enviada', 'Enviadas'],
    ['em_analise', 'Em análise'],
    ['entrevista', 'Entrevistas'],
    ['aprovada', 'Aprovadas'],
    ['recusada', 'Recusadas'],
    ['encerrada', 'Encerradas']
  ];
  const statusBreakdown = statusConfig.map(([status, label]) => ({
    status,
    label,
    count: applications.filter((a) => a.status === status).length
  }));

  const areaMap = new Map();
  for (const opportunity of opportunities.filter((o) => o.status === 'publicada')) {
    areaMap.set(opportunity.area, (areaMap.get(opportunity.area) || 0) + 1);
  }
  const areaBreakdown = [...areaMap.entries()]
    .map(([area, count]) => ({ area, count }))
    .sort((a, b) => b.count - a.count);

  res.json({
    students: students.length,
    companies: companies.length,
    activeCompanies: companies.filter((c) => c.status === 'aprovada').length,
    pendingCompanies: companies.filter((c) => c.status === 'pendente').length,
    opportunities: opportunities.filter((o) => o.status === 'publicada').length,
    pendingOpportunities: opportunities.filter((o) => o.status === 'aguardando').length,
    applications: applications.length,
    interviews: applications.filter((a) => a.status === 'entrevista').length,
    approved: applications.filter((a) => a.status === 'aprovada').length,
    series: months,
    statusBreakdown,
    areaBreakdown
  });
});

router.get('/users', (req, res) => {
  const db = readDb();
  const { q } = req.query;
  let users = db.users.map((u) => {
    const company = u.companyId ? db.companies.find((c) => c.id === u.companyId) : null;
    return { ...publicUser(u), companyName: company?.name || null };
  });
  if (q) {
    const term = String(q).toLowerCase();
    users = users.filter((u) =>
      [u.name, u.email, u.university, u.companyName]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(term))
    );
  }
  users.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(users);
});

router.patch('/users/:id/status', (req, res) => {
  const status = String(req.body?.status || '');
  if (!['ativo', 'suspenso'].includes(status)) {
    return res.status(400).json({ message: 'Status inválido.' });
  }
  if (req.params.id === req.user.id) {
    return res.status(400).json({ message: 'Você não pode suspender a própria conta.' });
  }

  const updated = mutate((db) => {
    const user = db.users.find((u) => u.id === req.params.id);
    if (!user) return null;
    user.status = status;
    return user;
  });
  if (!updated) return res.status(404).json({ message: 'Usuário não encontrado.' });
  res.json(publicUser(updated));
});

router.get('/companies', (_req, res) => {
  const db = readDb();
  const companies = db.companies.map((company) => {
    const opportunities = db.opportunities.filter((o) => o.companyId === company.id);
    const applications = db.applications.filter((a) => a.companyId === company.id);
    return {
      ...company,
      opportunitiesCount: opportunities.filter((o) => o.status === 'publicada').length,
      applicationsCount: applications.length
    };
  });
  companies.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(companies);
});

router.patch('/companies/:id/status', (req, res) => {
  const status = String(req.body?.status || '');
  if (!['aprovada', 'pendente', 'suspensa'].includes(status)) {
    return res.status(400).json({ message: 'Status inválido.' });
  }

  const updated = mutate((db) => {
    const company = db.companies.find((c) => c.id === req.params.id);
    if (!company) return null;
    company.status = status;
    company.verified = status === 'aprovada';
    company.updatedAt = new Date().toISOString();

    if (company.userId) {
      addNotification(db, company.userId, {
        title:
          status === 'aprovada'
            ? 'Empresa aprovada!'
            : status === 'suspensa'
              ? 'Cadastro suspenso'
              : 'Cadastro em análise',
        body:
          status === 'aprovada'
            ? 'Seu perfil foi verificado. Agora suas oportunidades podem ser publicadas na plataforma.'
            : status === 'suspensa'
              ? 'Seu cadastro foi suspenso. Entre em contato com o suporte para mais informações.'
              : 'Seu cadastro voltou para a fila de análise da equipe Conecta Unis.',
        type: 'empresa',
        link: '/empresa/perfil'
      });
    }

    return company;
  });

  if (!updated) return res.status(404).json({ message: 'Empresa não encontrada.' });
  res.json(updated);
});

router.get('/opportunities', (_req, res) => {
  const db = readDb();
  const list = sortNewest(
    db.opportunities.map((o) => enrichOpportunity(db, o))
  );
  res.json(list);
});

router.patch('/opportunities/:id/moderate', (req, res) => {
  const action = String(req.body?.action || '');
  if (!['aprovar', 'rejeitar'].includes(action)) {
    return res.status(400).json({ message: 'Ação inválida.' });
  }

  const updated = mutate((db) => {
    const opportunity = db.opportunities.find((o) => o.id === req.params.id);
    if (!opportunity) return null;

    opportunity.status = action === 'aprovar' ? 'publicada' : 'rejeitada';
    opportunity.moderatedAt = new Date().toISOString();
    opportunity.updatedAt = opportunity.moderatedAt;
    opportunity.moderationNote = String(req.body?.reason || '').trim();

    const company = db.companies.find((c) => c.id === opportunity.companyId);
    if (company?.userId) {
      addNotification(db, company.userId, {
        title: action === 'aprovar' ? 'Oportunidade aprovada' : 'Oportunidade precisa de ajustes',
        body:
          action === 'aprovar'
            ? `A oportunidade "${opportunity.title}" foi aprovada e já está visível para estudantes.`
            : `A oportunidade "${opportunity.title}" foi rejeitada. ${
                opportunity.moderationNote || 'Revise as informações e envie novamente.'
              }`,
        type: 'moderacao',
        link: '/empresa/oportunidades'
      });
    }

    return opportunity;
  });

  if (!updated) return res.status(404).json({ message: 'Oportunidade não encontrada.' });
  res.json(enrichOpportunity(readDb(), updated));
});

router.get('/applications', (_req, res) => {
  const db = readDb();
  res.json(sortNewest(db.applications.map((a) => enrichApplication(db, a))));
});

router.get('/moderation', (_req, res) => {
  const db = readDb();
  const companies = db.companies
    .filter((c) => c.status === 'pendente')
    .map((company) => ({
      ...company,
      opportunitiesCount: db.opportunities.filter((o) => o.companyId === company.id).length
    }))
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  const opportunities = db.opportunities
    .filter((o) => o.status === 'aguardando')
    .map((o) => enrichOpportunity(db, o))
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  res.json({ companies, opportunities });
});

export default router;
