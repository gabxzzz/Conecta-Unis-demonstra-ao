import type { Application, ApplicationStatus, Company, OpportunityStatus, User } from './types';

export function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(' ');
}

export function formatDate(value?: string | null) {
  if (!value) return '—';
  const date = new Date(value.length === 10 ? `${value}T12:00:00` : value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function formatShortDate(value?: string | null) {
  if (!value) return '—';
  const date = new Date(value.length === 10 ? `${value}T12:00:00` : value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}

export function timeAgo(value: string) {
  const date = new Date(value);
  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'agora';
  if (minutes < 60) return `há ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `há ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'ontem';
  if (days < 30) return `há ${days} dias`;
  const months = Math.floor(days / 30);
  return `há ${months} ${months === 1 ? 'mês' : 'meses'}`;
}

export function daysUntil(value: string) {
  const target = new Date(`${value}T23:59:59`);
  return Math.ceil((target.getTime() - Date.now()) / 86400000);
}

export function initials(name?: string) {
  if (!name) return 'CU';
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

export function avatarStyle(color?: string) {
  const base = color || '#1f63e0';
  return {
    background: `linear-gradient(135deg, ${base}, ${base}cc)`,
    color: '#fff'
  };
}

export const applicationStatus: Record<
  ApplicationStatus,
  { label: string; tone: 'info' | 'success' | 'warning' | 'danger' | 'neutral' }
> = {
  enviada: { label: 'Enviada', tone: 'info' },
  em_analise: { label: 'Em análise', tone: 'warning' },
  entrevista: { label: 'Entrevista', tone: 'warning' },
  aprovada: { label: 'Aprovada', tone: 'success' },
  recusada: { label: 'Recusada', tone: 'danger' },
  encerrada: { label: 'Encerrada', tone: 'neutral' }
};

export const opportunityStatus: Record<
  OpportunityStatus,
  { label: string; tone: 'info' | 'success' | 'warning' | 'danger' | 'neutral' }
> = {
  publicada: { label: 'Publicada', tone: 'success' },
  aguardando: { label: 'Aguardando', tone: 'warning' },
  encerrada: { label: 'Encerrada', tone: 'neutral' },
  rascunho: { label: 'Rascunho', tone: 'neutral' },
  rejeitada: { label: 'Rejeitada', tone: 'danger' }
};

export const companyStatus = {
  aprovada: { label: 'Aprovada', tone: 'success' as const },
  pendente: { label: 'Pendente', tone: 'warning' as const },
  suspensa: { label: 'Suspensa', tone: 'danger' as const }
};

export const userStatus = {
  ativo: { label: 'Ativo', tone: 'success' as const },
  pendente: { label: 'Pendente', tone: 'warning' as const },
  suspenso: { label: 'Suspenso', tone: 'danger' as const }
};

export const roleLabel = {
  student: 'Estudante',
  company: 'Empresa',
  admin: 'Administração'
};

export function studentCompletion(user: User | null) {
  if (!user) return { percent: 0, missing: [] as string[] };
  const checks: Array<[boolean, string]> = [
    [Boolean(user.name), 'nome'],
    [Boolean(user.bio), 'sobre você'],
    [Boolean(user.phone), 'telefone'],
    [Boolean(user.university), 'universidade'],
    [Boolean(user.course), 'curso'],
    [Boolean(user.period), 'período'],
    [Boolean(user.city), 'cidade'],
    [Boolean(user.skills?.length), 'habilidades'],
    [Boolean(user.linkedin), 'LinkedIn'],
    [Boolean(user.resumeName), 'currículo']
  ];
  const done = checks.filter(([value]) => value).length;
  return {
    percent: Math.round((done / checks.length) * 100),
    missing: checks.filter(([value]) => !value).map(([, label]) => label)
  };
}

export function companyCompletion(company: Company | null) {
  if (!company) return { percent: 0, missing: [] as string[] };
  const checks: Array<[boolean, string]> = [
    [Boolean(company.name), 'nome'],
    [Boolean(company.sector), 'área de atuação'],
    [Boolean(company.city), 'cidade'],
    [Boolean(company.description), 'descrição'],
    [Boolean(company.website), 'site'],
    [Boolean(company.contactEmail), 'e-mail de contato'],
    [Boolean(company.phone), 'telefone'],
    [Boolean(company.cnpj), 'CNPJ'],
    [Boolean(company.size), 'tamanho do time'],
    [company.status === 'aprovada', 'verificação']
  ];
  const done = checks.filter(([value]) => value).length;
  return {
    percent: Math.round((done / checks.length) * 100),
    missing: checks.filter(([value]) => !value).map(([, label]) => label)
  };
}

export interface TimelineStep {
  label: string;
  description: string;
  date?: string | null;
  state: 'done' | 'current' | 'future';
}

export function buildTimeline(application: Application): TimelineStep[] {
  const steps: TimelineStep[] = [];
  const created = application.createdAt;
  const updated = application.updatedAt;
  const status = application.status;
  const company = application.company?.name || 'A empresa';
  const hasInterview = Boolean(application.interview);
  const rejected = status === 'recusada' || status === 'encerrada';

  const order: ApplicationStatus[] = ['enviada', 'em_analise', 'entrevista', 'aprovada'];
  const rank = order.indexOf(status);

  steps.push({
    label: 'Candidatura enviada',
    description: 'Seu currículo e suas informações foram enviados para a empresa.',
    date: created,
    state: 'done'
  });
  steps.push({
    label: 'Candidatura recebida',
    description: `${company} confirmou o recebimento da sua candidatura.`,
    date: created,
    state: 'done'
  });
  steps.push({
    label: 'Em análise pelo recrutador',
    description: 'Seu perfil está sendo avaliado pelo time de recrutamento.',
    date: rank >= 1 || rejected ? updated : null,
    state: rank > 1 || rejected ? 'done' : rank === 1 ? 'current' : 'future'
  });
  steps.push({
    label: 'Entrevista',
    description: hasInterview
      ? `Conversa com ${company}${application.interview?.format ? ` • ${application.interview.format}` : ''}.`
      : 'Aguardando convite da empresa.',
    date: hasInterview
      ? `${application.interview?.date}T${application.interview?.time || '12:00'}:00`
      : null,
    state:
      status === 'entrevista'
        ? 'current'
        : hasInterview || rank > 2 || rejected
          ? 'done'
          : 'future'
  });

  if (status === 'aprovada') {
    steps.push({
      label: 'Decisão final: aprovado(a)',
      description: 'Parabéns! Você avançou no processo seletivo.',
      date: updated,
      state: 'current'
    });
  } else if (status === 'recusada') {
    steps.push({
      label: 'Processo encerrado',
      description: 'A empresa seguiu com outros perfis desta vez. Continue explorando novas oportunidades.',
      date: updated,
      state: 'current'
    });
  } else if (status === 'encerrada') {
    steps.push({
      label: 'Oportunidade encerrada',
      description: 'Esta oportunidade não está mais recebendo candidaturas.',
      date: updated,
      state: 'current'
    });
  } else {
    steps.push({
      label: 'Decisão final',
      description: 'Resultado final do processo seletivo.',
      date: null,
      state: 'future'
    });
  }

  return steps;
}

export function pluralize(count: number, singular: string, plural: string) {
  return `${count} ${count === 1 ? singular : plural}`;
}
