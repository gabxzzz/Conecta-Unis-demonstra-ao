import { useState } from 'react';
import {
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  Clock3,
  ShieldCheck,
  XCircle
} from 'lucide-react';
import { useApi } from '../../hooks';
import { api } from '../../api';
import {
  Badge,
  Button,
  EmptyState,
  ErrorBanner,
  PageHeader,
  Skeleton,
  StatCard
} from '../../components/ui';
import { RejectModal } from '../../components/RejectModal';
import { useToast } from '../../toast';
import { formatShortDate, timeAgo } from '../../utils';
import type { ModerationQueue, Opportunity } from '../../types';

export function AdminModeration() {
  const { data, loading, error, reload } = useApi<ModerationQueue>('/admin/moderation');
  const toast = useToast();
  const [rejecting, setRejecting] = useState<Opportunity | null>(null);
  const [rejectingLoading, setRejectingLoading] = useState(false);

  const companies = data?.companies || [];
  const opportunities = data?.opportunities || [];
  const total = companies.length + opportunities.length;

  const approveCompany = async (id: string) => {
    try {
      await api.patch(`/admin/companies/${id}/status`, { status: 'aprovada' });
      toast('Empresa aprovada. O responsável foi notificado.');
      await reload();
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Não foi possível aprovar a empresa.', 'error');
    }
  };

  const rejectCompany = async (id: string) => {
    try {
      await api.patch(`/admin/companies/${id}/status`, { status: 'suspensa' });
      toast('Empresa rejeitada. O responsável foi notificado.', 'info');
      await reload();
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Não foi possível rejeitar a empresa.', 'error');
    }
  };

  const approveOpportunity = async (opportunity: Opportunity) => {
    try {
      await api.patch(`/admin/opportunities/${opportunity.id}/moderate`, { action: 'aprovar' });
      toast('Oportunidade aprovada e publicada.');
      await reload();
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Não foi possível aprovar.', 'error');
    }
  };

  const rejectOpportunity = async (reason: string) => {
    if (!rejecting) return;
    setRejectingLoading(true);
    try {
      await api.patch(`/admin/opportunities/${rejecting.id}/moderate`, {
        action: 'rejeitar',
        reason
      });
      toast('Oportunidade rejeitada e empresa notificada.');
      setRejecting(null);
      await reload();
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Não foi possível rejeitar.', 'error');
    } finally {
      setRejectingLoading(false);
    }
  };

  return (
    <div className="page">
      <PageHeader
        eyebrow="Administração"
        title="Fila de moderação"
        subtitle={`${total} itens pendentes • tempo médio de análise: 3h 18min.`}
        actions={
          <span className="live-badge">
            <span className="live-dot" /> Acesso restrito
          </span>
        }
      />

      <div className="stat-grid stat-grid-3">
        <StatCard
          icon={<ShieldCheck size={20} />}
          label="Pendentes"
          value={total}
          hint="itens na fila"
          tone="amber"
        />
        <StatCard
          icon={<Building2 size={20} />}
          label="Empresas"
          value={companies.length}
          hint="aguardando aprovação"
          tone="blue"
        />
        <StatCard
          icon={<BriefcaseBusiness size={20} />}
          label="Oportunidades"
          value={opportunities.length}
          hint="aguardando revisão"
          tone="violet"
        />
        <StatCard
          icon={<Clock3 size={20} />}
          label="SLA"
          value="94%"
          hint="analisados em até 8 horas"
          tone="green"
        />
      </div>

      {error && <ErrorBanner message={error} />}

      {loading ? (
        <div className="card">
          <Skeleton lines={8} />
        </div>
      ) : total === 0 ? (
        <div className="card">
          <EmptyState
            icon={<CheckCircle2 size={28} />}
            title="Fila em dia"
            description="Todas as solicitações foram analisadas. Novos itens aparecerão aqui."
          />
        </div>
      ) : (
        <div className="moderation-grid">
          <section className="card">
            <div className="card-head">
              <div>
                <span className="eyebrow">Cadastros</span>
                <h2>Empresas pendentes</h2>
              </div>
              <Badge tone={companies.length ? 'warning' : 'success'}>{companies.length}</Badge>
            </div>

            {companies.length ? (
              <div className="moderation-list">
                {companies.map((company) => (
                  <article className="moderation-card" key={company.id}>
                    <div className="moderation-card-head">
                      <span
                        className="company-logo"
                        style={{ background: company.logoColor }}
                      >
                        {company.name.slice(0, 2).toUpperCase()}
                      </span>
                      <div>
                        <strong>{company.name}</strong>
                        <span>
                          {company.sector || 'Setor não informado'} • {company.city || 'Cidade não informada'}
                        </span>
                      </div>
                      <Badge tone="warning" dot>
                        Pendente
                      </Badge>
                    </div>
                    <p>{company.description || 'Sem descrição informada.'}</p>
                    <div className="moderation-meta">
                      <span>CNPJ: {company.cnpj || 'não informado'}</span>
                      <span>Cadastro: {formatShortDate(company.createdAt)}</span>
                      <span>{timeAgo(company.createdAt)}</span>
                    </div>
                    <div className="moderation-actions">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => approveCompany(company.id)}
                      >
                        <CheckCircle2 size={15} /> Aprovar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => rejectCompany(company.id)}
                      >
                        <XCircle size={15} /> Rejeitar
                      </Button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <EmptyState title="Nenhuma empresa pendente" />
            )}
          </section>

          <section className="card">
            <div className="card-head">
              <div>
                <span className="eyebrow">Conteúdo</span>
                <h2>Oportunidades pendentes</h2>
              </div>
              <Badge tone={opportunities.length ? 'warning' : 'success'}>
                {opportunities.length}
              </Badge>
            </div>

            {opportunities.length ? (
              <div className="moderation-list">
                {opportunities.map((opportunity) => (
                  <article className="moderation-card" key={opportunity.id}>
                    <div className="moderation-card-head">
                      <span className="moderation-icon">
                        <BriefcaseBusiness size={18} />
                      </span>
                      <div>
                        <strong>{opportunity.title}</strong>
                        <span>
                          {opportunity.company?.name} • {opportunity.area} • {opportunity.city}
                        </span>
                      </div>
                      <Badge tone="warning" dot>
                        Pendente
                      </Badge>
                    </div>
                    <p>{opportunity.description}</p>
                    <div className="moderation-meta">
                      <span>{opportunity.type} • {opportunity.modality}</span>
                      <span>Prazo: {formatShortDate(opportunity.deadline)}</span>
                      <span>{timeAgo(opportunity.createdAt)}</span>
                    </div>
                    <div className="moderation-actions">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => approveOpportunity(opportunity)}
                      >
                        <CheckCircle2 size={15} /> Aprovar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setRejecting(opportunity)}
                      >
                        <XCircle size={15} /> Rejeitar
                      </Button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <EmptyState title="Nenhuma oportunidade pendente" />
            )}
          </section>
        </div>
      )}

      <RejectModal
        open={Boolean(rejecting)}
        title="Rejeitar oportunidade"
        subtitle={rejecting?.title}
        onClose={() => setRejecting(null)}
        onConfirm={rejectOpportunity}
        loading={rejectingLoading}
      />
    </div>
  );
}
