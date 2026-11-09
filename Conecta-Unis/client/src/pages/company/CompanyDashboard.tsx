import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarCheck2,
  CheckCircle2,
  Plus,
  Users
} from 'lucide-react';
import { useAuth } from '../../auth';
import { useApi } from '../../hooks';
import {
  Avatar,
  Badge,
  Button,
  EmptyState,
  PageHeader,
  Progress,
  Skeleton,
  StatCard,
  StatusBadge
} from '../../components/ui';
import { companyCompletion, formatDate, formatShortDate } from '../../utils';
import type { Application, Opportunity } from '../../types';

export function CompanyDashboard() {
  const { company } = useAuth();
  const opportunities = useApi<Opportunity[]>('/opportunities/company/mine');
  const applications = useApi<Application[]>('/applications/company');

  const jobs = opportunities.data || [];
  const candidates = applications.data || [];
  const open = jobs.filter((job) => job.status === 'publicada').length;
  const closed = jobs.filter((job) => job.status === 'encerrada').length;
  const interviews = candidates.filter((item) => item.status === 'entrevista').length;
  const completion = companyCompletion(company);
  const firstName = company?.name?.split(' ')[0] || 'empresa';

  return (
    <div className="page">
      <PageHeader
        eyebrow="Área da empresa"
        title={`Olá, ${company?.name || firstName}.`}
        subtitle="Acompanhe o desempenho das suas oportunidades e candidatos."
        actions={
          <Link to="/empresa/oportunidades?novo=1" className="btn btn-primary">
            <Plus size={17} /> Criar oportunidade
          </Link>
        }
      />

      {company?.status === 'pendente' && (
        <div className="alert alert-warning">
          <CheckCircle2 size={18} />
          <span>
            Seu cadastro está em análise. Você já pode criar oportunidades, mas elas serão
            publicadas após a aprovação da equipe Conecta Unis.
          </span>
        </div>
      )}

      <div className="stat-grid">
        <StatCard
          icon={<BriefcaseBusiness size={20} />}
          label="Oportunidades abertas"
          value={open}
          hint={`${closed} encerradas`}
          tone="blue"
        />
        <StatCard
          icon={<Users size={20} />}
          label="Candidatos"
          value={candidates.length}
          hint="em todos os processos"
          tone="violet"
        />
        <StatCard
          icon={<CalendarCheck2 size={20} />}
          label="Entrevistas"
          value={interviews}
          hint="agendadas"
          tone="green"
        />
        <StatCard
          icon={<CheckCircle2 size={20} />}
          label="Aprovações"
          value={candidates.filter((item) => item.status === 'aprovada').length}
          hint="candidatos aprovados"
          tone="amber"
        />
      </div>

      <div className="dashboard-grid">
        <section className="card">
          <div className="card-head">
            <div>
              <span className="eyebrow">Suas oportunidades</span>
              <h2>Oportunidades recentes</h2>
            </div>
            <Link to="/empresa/oportunidades" className="text-link">
              Ver todas <ArrowRight size={16} />
            </Link>
          </div>

          {opportunities.loading ? (
            <Skeleton lines={4} />
          ) : jobs.length ? (
            <div className="company-job-list">
              {jobs.slice(0, 4).map((job) => (
                <Link
                  key={job.id}
                  to="/empresa/oportunidades"
                  className="company-job-row"
                >
                  <div>
                    <strong>{job.title}</strong>
                    <span>
                      {job.city} <i>•</i> {job.type} <i>•</i> {formatShortDate(job.deadline)}
                    </span>
                  </div>
                  <span className="company-job-candidates">
                    <Users size={15} /> {job.applicationsCount}
                  </span>
                  <StatusBadge kind="opportunity" status={job.status} />
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<BriefcaseBusiness size={26} />}
              title="Nenhuma oportunidade criada"
              description="Publique sua primeira vaga e comece a receber candidaturas."
              action={
                <Link to="/empresa/oportunidades?novo=1" className="btn btn-primary btn-sm">
                  <Plus size={16} /> Criar oportunidade
                </Link>
              }
            />
          )}
        </section>

        <section className="card profile-completion-card">
          <div className="card-head">
            <div>
              <span className="eyebrow">Sua empresa</span>
              <h2>Qualidade do perfil</h2>
            </div>
            <Badge tone={completion.percent === 100 ? 'success' : 'warning'}>
              {completion.percent}%
            </Badge>
          </div>
          <Progress value={completion.percent} />
          <p className="muted">
            {completion.percent === 100
              ? 'Perfil completo. Continue mantendo os dados atualizados.'
              : `Complete as informações para transmitir mais confiança. Falta: ${completion.missing
                  .slice(0, 3)
                  .join(', ')}.`}
          </p>
          <Link to="/empresa/perfil" className="btn btn-secondary btn-block btn-sm">
            Completar perfil <ArrowRight size={15} />
          </Link>
          <p className="muted small">Cadastrada em {formatDate(company?.createdAt)}</p>
        </section>
      </div>

      <section className="card">
        <div className="card-head">
          <div>
            <span className="eyebrow">Candidaturas</span>
            <h2>Candidatos recentes</h2>
          </div>
          <Link to="/empresa/candidatos" className="text-link">
            Ver todos <ArrowRight size={16} />
          </Link>
        </div>

        {applications.loading ? (
          <Skeleton lines={4} />
        ) : candidates.length ? (
          <div className="application-list">
            {candidates.slice(0, 5).map((application) => (
              <Link
                key={application.id}
                to="/empresa/candidatos"
                className="application-row"
              >
                <Avatar
                  name={application.student?.name}
                  color={application.student?.avatarColor}
                  size="sm"
                />
                <div className="application-row-main">
                  <strong>{application.student?.name}</strong>
                  <span>
                    {application.opportunity?.title} <i>•</i> {application.student?.course}
                  </span>
                </div>
                <StatusBadge kind="application" status={application.status} />
                <ArrowRight size={16} className="row-arrow" />
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Users size={26} />}
            title="Nenhum candidato ainda"
            description="Quando alguém se candidatar às suas oportunidades, aparecerá aqui."
          />
        )}
      </section>

      <section className="card company-tip">
        <div>
          <span className="eyebrow">Dica</span>
          <h2>Oportunidades completas atraem mais candidatos.</h2>
          <p className="muted">
            Descreva responsabilidades, requisitos e benefícios com clareza. Perfis completos
            recebem até 30% mais interesse.
          </p>
        </div>
        <Link to="/empresa/oportunidades?novo=1" className="btn btn-secondary">
          Publicar oportunidade <ArrowRight size={16} />
        </Link>
      </section>
    </div>
  );
}
