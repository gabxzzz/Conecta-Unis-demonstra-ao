import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CalendarCheck2,
  ClipboardList,
  Clock3,
  MapPin,
  Sparkles,
  Video
} from 'lucide-react';
import { useAuth } from '../../auth';
import { useApi } from '../../hooks';
import {
  Badge,
  Button,
  EmptyState,
  PageHeader,
  Progress,
  Skeleton,
  StatCard,
  StatusBadge
} from '../../components/ui';
import { OpportunityCard } from '../../components/OpportunityCard';
import {
  formatShortDate,
  studentCompletion,
  applicationStatus,
  pluralize
} from '../../utils';
import type { Application, Opportunity } from '../../types';

export function StudentDashboard() {
  const { user } = useAuth();
  const applications = useApi<Application[]>('/applications/mine');
  const opportunities = useApi<Opportunity[]>('/opportunities');

  const apps = applications.data || [];
  const interview = apps
    .filter((app) => app.status === 'entrevista' && app.interview)
    .sort((a, b) => `${a.interview?.date}${a.interview?.time}`.localeCompare(`${b.interview?.date}${b.interview?.time}`))[0];
  const recommended = (opportunities.data || []).filter((item) => !item.hasApplied).slice(0, 3);
  const inAnalysis = apps.filter((app) => app.status === 'em_analise').length;
  const interviews = apps.filter((app) => app.status === 'entrevista').length;
  const completion = studentCompletion(user);
  const firstName = user?.name?.split(' ')[0] || 'estudante';
  const today = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long'
  });

  return (
    <div className="page">
      <PageHeader
        eyebrow={today}
        title={`Olá, ${firstName}.`}
        subtitle="Acompanhe sua jornada profissional e encontre sua próxima oportunidade."
        actions={
          <Link to="/app/oportunidades" className="btn btn-primary">
            Explorar oportunidades <ArrowRight size={17} />
          </Link>
        }
      />

      <div className="stat-grid">
        <StatCard
          icon={<ClipboardList size={20} />}
          label="Candidaturas"
          value={apps.length}
          hint={pluralize(inAnalysis, 'em análise', 'em análise')}
          tone="blue"
        />
        <StatCard
          icon={<Clock3 size={20} />}
          label="Em análise"
          value={inAnalysis}
          hint="aguardando retorno"
          tone="amber"
        />
        <StatCard
          icon={<CalendarCheck2 size={20} />}
          label="Entrevistas"
          value={interviews}
          hint={interview ? `próxima ${formatShortDate(interview.interview?.date)}` : 'nenhuma agendada'}
          tone="green"
        />
        <StatCard
          icon={<Sparkles size={20} />}
          label="Recomendadas"
          value={opportunities.data?.length || 0}
          hint="com base no seu perfil"
          tone="violet"
        />
      </div>

      <div className="dashboard-grid">
        <section className="card">
          <div className="card-head">
            <div>
              <span className="eyebrow">Próximo passo</span>
              <h2>Sua próxima entrevista</h2>
            </div>
            <Badge tone={interview ? 'success' : 'neutral'} dot>
              {interview ? 'Confirmada' : 'Sem agenda'}
            </Badge>
          </div>

          {interview ? (
            <div className="interview-card">
              <div className="interview-date">
                <span>{formatShortDate(interview.interview?.date)}</span>
                <strong>{interview.interview?.time}</strong>
              </div>
              <div className="interview-info">
                <strong>{interview.opportunity?.title}</strong>
                <span>
                  {interview.company?.name} <i>•</i> {interview.interview?.format || 'Videoconferência'}
                </span>
                <div className="interview-actions">
                  {interview.interview?.link && (
                    <a
                      href={interview.interview.link}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-primary btn-sm"
                    >
                      <Video size={16} /> Acessar entrevista
                    </a>
                  )}
                  <Link
                    to={`/app/candidaturas/${interview.id}`}
                    className="btn btn-ghost btn-sm"
                  >
                    Ver detalhes <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <EmptyState
              icon={<CalendarCheck2 size={26} />}
              title="Nenhuma entrevista agendada"
              description="Continue se candidatando. Quando uma empresa agendar, você será avisado por aqui."
              action={
                <Link to="/app/oportunidades" className="btn btn-secondary btn-sm">
                  Ver oportunidades
                </Link>
              }
            />
          )}
        </section>

        <section className="card profile-completion-card">
          <div className="card-head">
            <div>
              <span className="eyebrow">Seu perfil</span>
              <h2>Visibilidade para empresas</h2>
            </div>
            <Badge tone={completion.percent === 100 ? 'success' : 'warning'}>
              {completion.percent}%
            </Badge>
          </div>
          <Progress value={completion.percent} />
          <p className="muted">
            {completion.percent === 100
              ? 'Seu perfil está completo. Continue atualizando suas experiências.'
              : `Complete seu perfil para aumentar suas chances. Falta: ${completion.missing
                  .slice(0, 3)
                  .join(', ')}.`}
          </p>
          <Link to="/app/perfil" className="btn btn-secondary btn-block btn-sm">
            Completar perfil <ArrowRight size={15} />
          </Link>
        </section>
      </div>

      <section className="section-inner">
        <div className="section-head-row">
          <div>
            <span className="eyebrow">Recomendadas para você</span>
            <h2>Oportunidades que combinam com seu perfil</h2>
          </div>
          <Link to="/app/oportunidades" className="text-link">
            Ver todas <ArrowRight size={16} />
          </Link>
        </div>

        {opportunities.loading ? (
          <div className="opp-grid">
            <Skeleton lines={4} />
            <Skeleton lines={4} />
            <Skeleton lines={4} />
          </div>
        ) : recommended.length ? (
          <div className="opp-grid">
            {recommended.map((opportunity) => (
              <OpportunityCard key={opportunity.id} opportunity={opportunity} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Nenhuma recomendação nova"
            description="Você já se candidatou às oportunidades disponíveis. Novas vagas aparecerão aqui."
          />
        )}
      </section>

      <section className="card">
        <div className="card-head">
          <div>
            <span className="eyebrow">Acompanhamento</span>
            <h2>Candidaturas recentes</h2>
          </div>
          <Link to="/app/candidaturas" className="text-link">
            Ver todas <ArrowRight size={16} />
          </Link>
        </div>

        {applications.loading ? (
          <Skeleton lines={4} />
        ) : apps.length ? (
          <div className="application-list">
            {apps.slice(0, 4).map((application) => (
              <Link
                to={`/app/candidaturas/${application.id}`}
                key={application.id}
                className="application-row"
              >
                <span
                  className="company-logo company-logo-sm"
                  style={{ background: application.company?.logoColor || '#1f63e0' }}
                >
                  {application.company?.name?.slice(0, 2).toUpperCase() || 'CU'}
                </span>
                <div className="application-row-main">
                  <strong>{application.opportunity?.title}</strong>
                  <span>
                    {application.company?.name} <i>•</i> {formatShortDate(application.createdAt)}
                  </span>
                </div>
                <StatusBadge kind="application" status={application.status} />
                <ArrowRight size={16} className="row-arrow" />
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<ClipboardList size={26} />}
            title="Você ainda não se candidatou"
            description="Explore as oportunidades e dê o primeiro passo para sua próxima experiência."
            action={
              <Link to="/app/oportunidades" className="btn btn-primary btn-sm">
                Encontrar oportunidades
              </Link>
            }
          />
        )}
      </section>
    </div>
  );
}
