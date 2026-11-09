import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CalendarCheck2,
  CheckCircle2,
  ClipboardList,
  Clock3,
  Search
} from 'lucide-react';
import { useApi } from '../../hooks';
import {
  EmptyState,
  ErrorBanner,
  PageHeader,
  Select,
  Skeleton,
  StatCard,
  StatusBadge
} from '../../components/ui';
import { formatShortDate, pluralize } from '../../utils';
import type { Application } from '../../types';

export function StudentApplications() {
  const { data, loading, error } = useApi<Application[]>('/applications/mine');
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('Todos');

  const applications = data || [];
  const filtered = applications.filter((application) => {
    const matchesStatus = status === 'Todos' || application.status === status;
    const term = query.toLowerCase();
    const matchesQuery =
      !term ||
      [application.opportunity?.title, application.company?.name]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(term));
    return matchesStatus && matchesQuery;
  });

  const interviews = applications.filter((item) => item.status === 'entrevista').length;
  const inProgress = applications.filter((item) =>
    ['em_analise', 'entrevista'].includes(item.status)
  ).length;
  const approved = applications.filter((item) => item.status === 'aprovada').length;

  return (
    <div className="page">
      <PageHeader
        eyebrow="Portal do estudante"
        title="Minhas candidaturas"
        subtitle="Acompanhe o andamento de todos os seus processos seletivos."
        actions={
          <Link to="/app/oportunidades" className="btn btn-primary">
            Explorar oportunidades <ArrowRight size={17} />
          </Link>
        }
      />

      <div className="stat-grid stat-grid-3">
        <StatCard
          icon={<ClipboardList size={20} />}
          label="Candidaturas"
          value={applications.length}
          hint="no total"
          tone="blue"
        />
        <StatCard
          icon={<Clock3 size={20} />}
          label="Em andamento"
          value={inProgress}
          hint="análise e entrevistas"
          tone="amber"
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
          value={approved}
          hint="parabéns!"
          tone="violet"
        />
      </div>

      <section className="filter-panel filter-panel-inline">
        <div className="search-input">
          <Search size={18} />
          <input
            type="search"
            placeholder="Oportunidade ou empresa"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <div className="filter-field filter-field-inline">
          <span>Status</span>
          <Select value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="Todos">Todos os status</option>
            <option value="enviada">Enviada</option>
            <option value="em_analise">Em análise</option>
            <option value="entrevista">Entrevista</option>
            <option value="aprovada">Aprovada</option>
            <option value="recusada">Recusada</option>
            <option value="encerrada">Encerrada</option>
          </Select>
        </div>
      </section>

      {error && <ErrorBanner message={error} />}

      <section className="card">
        <div className="card-head">
          <div>
            <h2>Seus processos</h2>
            <p className="muted">
              {pluralize(filtered.length, 'candidatura listada', 'candidaturas listadas')}
            </p>
          </div>
        </div>

        {loading ? (
          <Skeleton lines={6} />
        ) : filtered.length ? (
          <div className="application-list application-list-detailed">
            {filtered.map((application) => (
              <Link
                key={application.id}
                to={`/app/candidaturas/${application.id}`}
                className="application-row application-row-detailed"
              >
                <span
                  className="company-logo"
                  style={{ background: application.company?.logoColor || '#1f63e0' }}
                >
                  {application.company?.name?.slice(0, 2).toUpperCase() || 'CU'}
                </span>
                <div className="application-row-main">
                  <strong>{application.opportunity?.title}</strong>
                  <span>
                    {application.company?.name} <i>•</i> {application.opportunity?.city}
                  </span>
                </div>
                <div className="application-row-meta">
                  <small>Enviada em</small>
                  <strong>{formatShortDate(application.createdAt)}</strong>
                </div>
                <StatusBadge kind="application" status={application.status} />
                <ArrowRight size={17} className="row-arrow" />
              </Link>
            ))}
          </div>
        ) : applications.length ? (
          <EmptyState
            icon={<Search size={26} />}
            title="Nenhuma candidatura encontrada"
            description="Tente ajustar a busca ou selecionar outro status."
            action={
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  setQuery('');
                  setStatus('Todos');
                }}
              >
                Limpar filtros
              </button>
            }
          />
        ) : (
          <EmptyState
            icon={<ClipboardList size={28} />}
            title="Você ainda não se candidatou"
            description="Encontre uma oportunidade com o seu perfil e comece sua jornada."
            action={
              <Link to="/app/oportunidades" className="btn btn-primary btn-sm">
                Explorar oportunidades
              </Link>
            }
          />
        )}
      </section>
    </div>
  );
}
