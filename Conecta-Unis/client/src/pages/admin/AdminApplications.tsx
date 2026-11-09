import { useState } from 'react';
import { CalendarCheck2, CheckCircle2, FileText, Search } from 'lucide-react';
import { useApi } from '../../hooks';
import {
  Avatar,
  EmptyState,
  ErrorBanner,
  PageHeader,
  Select,
  Skeleton,
  StatCard,
  StatusBadge
} from '../../components/ui';
import { formatShortDate } from '../../utils';
import type { Application } from '../../types';

export function AdminApplications() {
  const { data, loading, error } = useApi<Application[]>('/admin/applications');
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('Todos');

  const applications = data || [];
  const filtered = applications.filter((application) => {
    const term = query.toLowerCase();
    const matchesQuery =
      !term ||
      [application.student?.name, application.opportunity?.title, application.company?.name]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(term));
    const matchesStatus = status === 'Todos' || application.status === status;
    return matchesQuery && matchesStatus;
  });

  return (
    <div className="page">
      <PageHeader
        eyebrow="Administração"
        title="Candidaturas"
        subtitle={`Visão operacional de ${applications.length} candidaturas na plataforma.`}
      />

      <div className="stat-grid stat-grid-3">
        <StatCard
          icon={<FileText size={20} />}
          label="Candidaturas"
          value={applications.length}
          hint="total registrado"
          tone="blue"
        />
        <StatCard
          icon={<Search size={20} />}
          label="Em análise"
          value={applications.filter((item) => item.status === 'em_analise').length}
          hint="em avaliação"
          tone="amber"
        />
        <StatCard
          icon={<CalendarCheck2 size={20} />}
          label="Entrevistas"
          value={applications.filter((item) => item.status === 'entrevista').length}
          hint="agendadas"
          tone="green"
        />
        <StatCard
          icon={<CheckCircle2 size={20} />}
          label="Aprovadas"
          value={applications.filter((item) => item.status === 'aprovada').length}
          hint="selecionadas"
          tone="violet"
        />
      </div>

      <section className="filter-panel filter-panel-inline">
        <div className="search-input">
          <Search size={18} />
          <input
            type="search"
            placeholder="Buscar candidato, empresa ou oportunidade"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <div className="filter-field filter-field-inline">
          <span>Status</span>
          <Select value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="Todos">Todos</option>
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
        {loading ? (
          <Skeleton lines={8} />
        ) : filtered.length ? (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Candidato</th>
                  <th>Oportunidade</th>
                  <th>Empresa</th>
                  <th>Data</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((application) => (
                  <tr key={application.id}>
                    <td>
                      <div className="table-user">
                        <Avatar
                          name={application.student?.name}
                          color={application.student?.avatarColor}
                          size="sm"
                        />
                        <div>
                          <strong>{application.student?.name || '—'}</strong>
                          <span>{application.student?.course || '—'}</span>
                        </div>
                      </div>
                    </td>
                    <td>{application.opportunity?.title || '—'}</td>
                    <td>{application.company?.name || '—'}</td>
                    <td>{formatShortDate(application.createdAt)}</td>
                    <td>
                      <StatusBadge kind="application" status={application.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon={<Search size={26} />}
            title="Nenhuma candidatura encontrada"
            description="Ajuste os filtros de busca."
          />
        )}
      </section>
    </div>
  );
}
