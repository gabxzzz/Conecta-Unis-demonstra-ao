import { Router } from 'express';
import { randomUUID } from 'node:crypto';
import { mutate, readDb } from '../db.js';
import { authRequired, requireRole } from '../auth.js';
import {
  addNotification,
  enrichApplication,
  isExpired,
  sortNewest
} from '../utils.js';

const router = Router();

const statusLabels = {
  enviada: 'Candidatura enviada',
  em_analise: 'Candidatura em análise',
  entrevista: 'Convite para entrevista',
  aprovada: 'Você foi aprovado(a)!',
  recusada: 'Atualização do processo',
  encerrada: 'Processo encerrado'
};

router.post('/', authRequired, requireRole('student'), (req, res) => {
  const opportunityId = String(req.body?.opportunityId || '');
  const message = String(req.body?.message || '').trim();
  const db = readDb();

  const opportunity = db.opportunities.find((o) => o.id === opportunityId);
  if (!opportunity) return res.status(404).json({ message: 'Oportunidade não encontrada.' });
  if (opportunity.status !== 'publicada') {
    return res.status(400).json({ message: 'Esta oportunidade não está mais disponível.' });
  }
  if (isExpired(opportunity)) {
    return res.status(400).json({ message: 'O prazo de inscrição desta oportunidade encerrou.' });
  }
  if (db.applications.some((a) => a.opportunityId === opportunityId && a.studentId === req.user.id)) {
    return res.status(409).json({ message: 'Você já se candidatou a esta oportunidade.' });
  }

  const now = new Date().toISOString();
  const application = {
    id: `app_${randomUUID()}`,
    opportunityId,
    studentId: req.user.id,
    companyId: opportunity.companyId,
    status: 'enviada',
    message,
    interview: null,
    createdAt: now,
    updatedAt: now
  };

  mutate((draft) => {
    draft.applications.push(application);
  });

  res.status(201).json(enrichApplication(readDb(), application));
});

router.get('/mine', authRequired, requireRole('student'), (req, res) => {
  const db = readDb();
  const list = db.applications
    .filter((a) => a.studentId === req.user.id)
    .map((a) => enrichApplication(db, a));
  res.json(sortNewest(list));
});

router.get('/company', authRequired, requireRole('company'), (req, res) => {
  const db = readDb();
  const list = db.applications
    .filter((a) => a.companyId === req.user.companyId)
    .map((a) => enrichApplication(db, a));
  res.json(sortNewest(list));
});

router.get('/:id', authRequired, (req, res) => {
  const db = readDb();
  const application = db.applications.find((a) => a.id === req.params.id);
  if (!application) return res.status(404).json({ message: 'Candidatura não encontrada.' });

  const isStudent = req.user.role === 'student' && application.studentId === req.user.id;
  const isCompany = req.user.role === 'company' && application.companyId === req.user.companyId;
  const isAdmin = req.user.role === 'admin';
  if (!isStudent && !isCompany && !isAdmin) {
    return res.status(403).json({ message: 'Você não tem acesso a esta candidatura.' });
  }

  res.json(enrichApplication(db, application));
});

router.patch('/:id/status', authRequired, requireRole('company', 'admin'), (req, res) => {
  const status = String(req.body?.status || '');
  const allowed = ['em_analise', 'entrevista', 'aprovada', 'recusada', 'encerrada'];
  if (!allowed.includes(status)) {
    return res.status(400).json({ message: 'Status inválido.' });
  }

  const db = readDb();
  const existing = db.applications.find((a) => a.id === req.params.id);
  if (!existing) return res.status(404).json({ message: 'Candidatura não encontrada.' });

  if (req.user.role === 'company' && existing.companyId !== req.user.companyId) {
    return res.status(403).json({ message: 'Você não pode alterar esta candidatura.' });
  }

  let interview = existing.interview;
  if (status === 'entrevista') {
    const date = String(req.body?.interview?.date || '').trim();
    const time = String(req.body?.interview?.time || '').trim();
    if (!date || !time) {
      return res.status(400).json({ message: 'Informe a data e o horário da entrevista.' });
    }
    interview = {
      date,
      time,
      link: String(req.body?.interview?.link || '').trim(),
      format: String(req.body?.interview?.format || 'Videoconferência').trim()
    };
  }

  const now = new Date().toISOString();
  const updated = mutate((draft) => {
    const target = draft.applications.find((a) => a.id === req.params.id);
    target.status = status;
    target.interview = interview;
    target.updatedAt = now;

    const opportunity = draft.opportunities.find((o) => o.id === target.opportunityId);
    const company = draft.companies.find((c) => c.id === target.companyId);
    addNotification(draft, target.studentId, {
      title: statusLabels[status],
      body:
        status === 'entrevista'
          ? `${company?.name || 'A empresa'} agendou uma entrevista para ${new Date(
              `${interview.date}T12:00:00`
            ).toLocaleDateString('pt-BR')} às ${interview.time}.`
          : `Sua candidatura para ${opportunity?.title || 'a oportunidade'} foi atualizada para: ${
              statusLabels[status]
            }.`,
      type: status === 'entrevista' ? 'entrevista' : 'processo',
      link: `/app/candidaturas/${target.id}`
    });

    return target;
  });

  res.json(enrichApplication(readDb(), updated));
});

export default router;
