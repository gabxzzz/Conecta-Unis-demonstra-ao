import { useState } from 'react';
import { BriefcaseBusiness, CheckCircle2, Search, XCircle } from 'lucide-react';
import { useApi } from '../../hooks';
import { api } from '../../api';
import {
  Button,
  EmptyState,
  ErrorBanner,
  PageHeader,
  Select,
  Skeleton,
  StatCard,
  StatusBadge
} from '../../components/ui';
import { RejectModal } from '../../components/RejectModal';
import { useToast } from '../../toast';
import { formatShortDate } from '../../utils';
import type { Opportunity } from '../../types';

export function AdminOpportunities() {
  const { data, loading, error, reload } = useApi<Opportunity[]>('/admin/opportunities');
  const toast = useToast();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('Todas');
  const [rejecting, setRejecting] = useState<Opportunity | null>(null);
  const [rejectingLoading, setRejectingLoading] = useState(false);

  const opportunities = data || [];
  const filtered = opportunities.filter((opportunity) => {
    const term = query.toLowerCase();
    const matchesQuery =
      !term ||
      [opportunity.title, opportunity.company?.name, opportunity.area, opportunity.city]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(term));
    const matchesStatus = status === 'Todas' || opportunity.status === status;
    return matchesQuery && matchesStatus;
  });

  const approve = async (opportunity: Opportunity) => {
    try {
      await api.patch(`/admin/opportunities/${opportunity.id}/moderate`, { action: 'aprovar' });
      toast('Oportunidade aprovada e publicada.');
      await reload();
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Não foi possível aprovar.', 'error');
    }
  };

  const reject = async (reason: string) => {
    if (!rejecting) return;
    setRejectingLoading(true);
    try {
      await api.patch(`/admin/opportunities/${rejecting.id}/moderate`, {
        action: 'rejeitar',
        reason
      });
      toast('Oportunidade rejeitada. A empresa foi notificada.');
      setRejecting(null);
      await reload();
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Não foi possível rejeitar.', 'error');
    } finally {
      setRejectingLoading(false);
    }
  };

  const close = async (opportunity: Opportunity) => {
    try {
      await api.patch(`/opportunities/${opportunity.id}/status`, { status: 'encerrada' });
      toast('Oportunidade encerrada.');
      await reload();
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Não foi possível encerrar.', 'error');
    }
  };

  return (
    <div className="page">
      <PageHeader
        eyebrow="Administração"
        title="Oportunidades"
        subtitle={`${opportunities.filter((item) => item.status === 'publicada').length} publicadas • ${
          opportunities.filter((item) => item.status === 'aguardando').length
        } aguardando moderação.`}
      />

      <div className="stat-grid stat-grid-3">
        <StatCard
          icon={<BriefcaseBusiness size={20} />}
          label="Oportunidades"
          value={opportunities.length}
          hint="em toda a plataforma"
          tone="blue"
        />
        <StatCard
          icon={<CheckCircle2 size={20} />}
          label="Publicadas"
          value={opportunities.filter((item) => item.status === 'publicada').length}
          hint="visíveis aos estudantes"
          tone="green"
        />
        <StatCard
          icon={<XCircle size={20} />}
          label="Aguardando"
          value={opportunities.filter((item) => item.status === 'aguardando').length}
          hint="precisam de revisão"
          tone="amber"
        />
        <StatCard
          icon={<XCircle size={20} />}
          label="Encerradas"
          value={opportunities.filter((item) => item.status === 'encerrada').length}
          hint="fora do ar"
          tone="violet"
        />
      </div>

      <section className="filter-panel filter-panel-inline">
        <div className="search-input">
          <Search size={18} />
          <input
            type="search"
            placeholder="Buscar oportunidade ou empresa"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <div className="filter-field filter-field-inline">
          <span>Status</span>
          <Select value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="Todas">Todas</option>
            <option value="publicada">Publicada</option>
            <option value="aguardando">Aguardando</option>
            <option value="encerrada">Encerrada</option>
            <option value="rascunho">Rascunho</option>
            <option value="rejeitada">Rejeitada</option>
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
                  <th>Oportunidade</th>
                  <th>Empresa</th>
                  <th>Área</th>
                  <th>Status</th>
                  <th>Candidaturas</th>
                  <th>Prazo</th>
                  <th aria-label="Ações" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((opportunity) => (
                  <tr key={opportunity.id}>
                    <td>
                      <div className="table-title">
                        <strong>{opportunity.title}</strong>
                        <span>
                          {opportunity.type} • {opportunity.modality} • {opportunity.city}
                        </span>
                      </div>
                    </td>
                    <td>{opportunity.company?.name || '—'}</td>
                    <td>{opportunity.area}</td>
                    <td>
                      <StatusBadge kind="opportunity" status={opportunity.status} />
                    </td>
                    <td>{opportunity.applicationsCount}</td>
                    <td>{formatShortDate(opportunity.deadline)}</td>
                    <td>
                      <div className="table-actions">
                        {opportunity.status === 'aguardando' && (
                          <>
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => approve(opportunity)}
                            >
                              <CheckCircle2 size={15} /> Aprovar
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => setRejecting(opportunity)}>
                              <XCircle size={15} /> Rejeitar
                            </Button>
                          </>
                        )}
                        {opportunity.status === 'publicada' && (
                          <Button variant="ghost" size="sm" onClick={() => close(opportunity)}>
                            Encerrar
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon={<Search size={26} />}
            title="Nenhuma oportunidade encontrada"
            description="Tente ajustar os filtros de busca."
          />
        )}
      </section>

      <RejectModal
        open={Boolean(rejecting)}
        title="Rejeitar oportunidade"
        subtitle={rejecting?.title}
        onClose={() => setRejecting(null)}
        onConfirm={reject}
        loading={rejectingLoading}
      />
    </div>
  );
}
