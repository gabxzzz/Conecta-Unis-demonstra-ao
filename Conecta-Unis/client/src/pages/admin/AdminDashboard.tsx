import { Link } from 'react-router-dom';
import {
  Activity,
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CalendarCheck2,
  CheckCircle2,
  Clock3,
  ShieldCheck,
  Users
} from 'lucide-react';
import { useApi } from '../../hooks';
import {
  Badge,
  EmptyState,
  PageHeader,
  Skeleton,
  StatCard
} from '../../components/ui';
import type { AdminStats, ModerationQueue } from '../../types';
import { timeAgo } from '../../utils';

export function AdminDashboard() {
  const stats = useApi<AdminStats>('/admin/stats');
  const moderation = useApi<ModerationQueue>('/admin/moderation');
  const data = stats.data;
  const maxSeries = Math.max(1, ...(data?.series || []).map((item) => item.count));
  const totalStatus = Math.max(1, (data?.statusBreakdown || []).reduce((sum, item) => sum + item.count, 0));
  const pendingTotal =
    (moderation.data?.companies.length || 0) + (moderation.data?.opportunities.length || 0);

  return (
    <div className="page">
      <PageHeader
        eyebrow="Acesso restrito"
        title="Visão geral"
        subtitle="Dados consolidados da plataforma. Atualizado agora."
        actions={
          <span className="live-badge">
            <span className="live-dot" /> Ambiente seguro
          </span>
        }
      />

      {stats.loading ? (
        <div className="card">
          <Skeleton lines={6} />
        </div>
      ) : (
        <>
          <div className="stat-grid">
            <StatCard
              icon={<Users size={20} />}
              label="Estudantes"
              value={(data?.students || 0).toLocaleString('pt-BR')}
              hint="perfis cadastrados"
              tone="blue"
            />
            <StatCard
              icon={<Building2 size={20} />}
              label="Empresas"
              value={(data?.companies || 0).toLocaleString('pt-BR')}
              hint={`${data?.activeCompanies || 0} aprovadas`}
              tone="violet"
            />
            <StatCard
              icon={<BriefcaseBusiness size={20} />}
              label="Oportunidades ativas"
              value={(data?.opportunities || 0).toLocaleString('pt-BR')}
              hint={`${data?.pendingOpportunities || 0} aguardando revisão`}
              tone="amber"
            />
            <StatCard
              icon={<CalendarCheck2 size={20} />}
              label="Candidaturas"
              value={(data?.applications || 0).toLocaleString('pt-BR')}
              hint={`${data?.interviews || 0} entrevistas`}
              tone="green"
            />
          </div>

          <div className="admin-chart-grid">
            <section className="card">
              <div className="card-head">
                <div>
                  <span className="eyebrow">Crescimento</span>
                  <h2>Candidaturas por mês</h2>
                </div>
                <Badge tone="info">Últimos 6 meses</Badge>
              </div>
              <div className="bar-chart">
                {(data?.series || []).map((item) => (
                  <div className="bar-chart-item" key={item.key}>
                    <span className="bar-value">{item.count}</span>
                    <div className="bar-track">
                      <span
                        className="bar-fill"
                        style={{ height: `${Math.max(6, (item.count / maxSeries) * 100)}%` }}
                      />
                    </div>
                    <span className="bar-label">{item.label}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="card">
              <div className="card-head">
                <div>
                  <span className="eyebrow">Funil</span>
                  <h2>Status das candidaturas</h2>
                </div>
              </div>
              <div className="breakdown-list">
                {(data?.statusBreakdown || []).map((item) => (
                  <div className="breakdown-row" key={item.status}>
                    <div>
                      <span>{item.label}</span>
                      <strong>{item.count}</strong>
                    </div>
                    <div className="breakdown-track">
                      <span
                        className={`breakdown-fill fill-${item.status}`}
                        style={{ width: `${(item.count / totalStatus) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="dashboard-grid">
            <section className="card">
              <div className="card-head">
                <div>
                  <span className="eyebrow">Moderação</span>
                  <h2>Fila de análise</h2>
                </div>
                <Badge tone={pendingTotal ? 'warning' : 'success'} dot>
                  {pendingTotal} pendentes
                </Badge>
              </div>

              {moderation.loading ? (
                <Skeleton lines={4} />
              ) : pendingTotal ? (
                <div className="moderation-preview">
                  {moderation.data?.companies.slice(0, 2).map((company) => (
                    <div className="moderation-row" key={company.id}>
                      <span className="moderation-icon">
                        <Building2 size={17} />
                      </span>
                      <div>
                        <strong>{company.name}</strong>
                        <span>Cadastro de empresa • {timeAgo(company.createdAt)}</span>
                      </div>
                      <Badge tone="warning">Empresa</Badge>
                    </div>
                  ))}
                  {moderation.data?.opportunities.slice(0, 2).map((opportunity) => (
                    <div className="moderation-row" key={opportunity.id}>
                      <span className="moderation-icon">
                        <BriefcaseBusiness size={17} />
                      </span>
                      <div>
                        <strong>{opportunity.title}</strong>
                        <span>
                          {opportunity.company?.name} • {timeAgo(opportunity.createdAt)}
                        </span>
                      </div>
                      <Badge tone="warning">Oportunidade</Badge>
                    </div>
                  ))}
                  <Link to="/admin/moderacao" className="btn btn-secondary btn-block btn-sm">
                    Abrir fila de moderação <ArrowRight size={15} />
                  </Link>
                </div>
              ) : (
                <EmptyState
                  icon={<CheckCircle2 size={26} />}
                  title="Fila em dia"
                  description="Nenhum item pendente de análise no momento."
                />
              )}
            </section>

            <section className="card">
              <div className="card-head">
                <div>
                  <span className="eyebrow">Distribuição</span>
                  <h2>Oportunidades por área</h2>
                </div>
              </div>
              <div className="area-list">
                {(data?.areaBreakdown || []).map((item) => {
                  const maxArea = Math.max(1, ...(data?.areaBreakdown || []).map((area) => area.count));
                  return (
                    <div className="area-row" key={item.area}>
                      <span>{item.area}</span>
                      <div className="area-track">
                        <i style={{ width: `${(item.count / maxArea) * 100}%` }} />
                      </div>
                      <strong>{item.count}</strong>
                    </div>
                  );
                })}
              </div>
              <div className="platform-health">
                <span className="health-icon">
                  <Activity size={18} />
                </span>
                <div>
                  <strong>Saúde da plataforma</strong>
                  <span>Todos os serviços essenciais estão operando normalmente.</span>
                </div>
                <Badge tone="success" dot>
                  Online
                </Badge>
              </div>
            </section>
          </div>

          <section className="card quick-links-card">
            <div>
              <span className="eyebrow">Atalhos</span>
              <h2>Gestão da plataforma</h2>
            </div>
            <div className="quick-links">
              <Link to="/admin/usuarios" className="quick-link">
                <Users size={18} /> Gerenciar usuários <ArrowRight size={15} />
              </Link>
              <Link to="/admin/empresas" className="quick-link">
                <Building2 size={18} /> Empresas <ArrowRight size={15} />
              </Link>
              <Link to="/admin/oportunidades" className="quick-link">
                <BriefcaseBusiness size={18} /> Oportunidades <ArrowRight size={15} />
              </Link>
              <Link to="/admin/moderacao" className="quick-link">
                <ShieldCheck size={18} /> Moderação <ArrowRight size={15} />
              </Link>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
