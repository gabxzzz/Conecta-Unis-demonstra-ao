import { useState } from 'react';
import { Building2, CheckCircle2, Search, ShieldBan, ShieldCheck } from 'lucide-react';
import { useApi } from '../../hooks';
import { api } from '../../api';
import {
  Badge,
  Button,
  EmptyState,
  ErrorBanner,
  PageHeader,
  Select,
  Skeleton,
  StatCard,
  StatusBadge
} from '../../components/ui';
import { useToast } from '../../toast';
import { formatShortDate } from '../../utils';
import type { Company } from '../../types';

export function AdminCompanies() {
  const { data, loading, error, reload } = useApi<Company[]>('/admin/companies');
  const toast = useToast();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('Todas');

  const companies = data || [];
  const filtered = companies.filter((company) => {
    const term = query.toLowerCase();
    const matchesQuery =
      !term ||
      [company.name, company.cnpj, company.sector, company.city]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(term));
    const matchesStatus = status === 'Todas' || company.status === status;
    return matchesQuery && matchesStatus;
  });

  const changeStatus = async (company: Company, nextStatus: string) => {
    try {
      await api.patch(`/admin/companies/${company.id}/status`, { status: nextStatus });
      toast(
        nextStatus === 'aprovada'
          ? 'Empresa aprovada e notificada.'
          : nextStatus === 'suspensa'
            ? 'Empresa suspensa.'
            : 'Status atualizado.'
      );
      await reload();
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Não foi possível atualizar a empresa.', 'error');
    }
  };

  return (
    <div className="page">
      <PageHeader
        eyebrow="Administração"
        title="Empresas"
        subtitle={`${companies.length} empresas cadastradas • ${
          companies.filter((company) => company.status === 'pendente').length
        } aguardando moderação.`}
      />

      <div className="stat-grid stat-grid-3">
        <StatCard
          icon={<Building2 size={20} />}
          label="Empresas"
          value={companies.length}
          hint="cadastradas"
          tone="blue"
        />
        <StatCard
          icon={<CheckCircle2 size={20} />}
          label="Aprovadas"
          value={companies.filter((company) => company.status === 'aprovada').length}
          hint="ativas na plataforma"
          tone="green"
        />
        <StatCard
          icon={<ShieldCheck size={20} />}
          label="Pendentes"
          value={companies.filter((company) => company.status === 'pendente').length}
          hint="aguardando análise"
          tone="amber"
        />
        <StatCard
          icon={<ShieldBan size={20} />}
          label="Suspensas"
          value={companies.filter((company) => company.status === 'suspensa').length}
          hint="acesso restrito"
          tone="violet"
        />
      </div>

      <section className="filter-panel filter-panel-inline">
        <div className="search-input">
          <Search size={18} />
          <input
            type="search"
            placeholder="Buscar empresa ou CNPJ"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <div className="filter-field filter-field-inline">
          <span>Status</span>
          <Select value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="Todas">Todas</option>
            <option value="aprovada">Aprovada</option>
            <option value="pendente">Pendente</option>
            <option value="suspensa">Suspensa</option>
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
                  <th>Empresa</th>
                  <th>Setor / Cidade</th>
                  <th>Oportunidades</th>
                  <th>Candidaturas</th>
                  <th>Cadastro</th>
                  <th>Status</th>
                  <th aria-label="Ações" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((company) => (
                  <tr key={company.id}>
                    <td>
                      <div className="table-user">
                        <span
                          className="company-logo company-logo-sm"
                          style={{ background: company.logoColor }}
                        >
                          {company.name.slice(0, 2).toUpperCase()}
                        </span>
                        <div>
                          <strong>{company.name}</strong>
                          <span>{company.cnpj || 'CNPJ não informado'}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="table-title">
                        <strong>{company.sector || '—'}</strong>
                        <span>{company.city || '—'}</span>
                      </div>
                    </td>
                    <td>{company.opportunitiesCount || 0}</td>
                    <td>{company.applicationsCount || 0}</td>
                    <td>{formatShortDate(company.createdAt)}</td>
                    <td>
                      <StatusBadge kind="company" status={company.status} />
                    </td>
                    <td>
                      <div className="table-actions">
                        {company.status === 'pendente' && (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => changeStatus(company, 'aprovada')}
                          >
                            <CheckCircle2 size={15} /> Aprovar
                          </Button>
                        )}
                        {company.status === 'suspensa' && (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => changeStatus(company, 'aprovada')}
                          >
                            <ShieldCheck size={15} /> Reativar
                          </Button>
                        )}
                        {company.status !== 'suspensa' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => changeStatus(company, 'suspensa')}
                          >
                            <ShieldBan size={15} /> Suspender
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
            title="Nenhuma empresa encontrada"
            description="Ajuste a busca ou o status selecionado."
          />
        )}
      </section>

      <p className="muted small">
        <Badge tone="info">Nota</Badge> Empresas aprovadas recebem o selo de verificação e podem
        publicar oportunidades imediatamente.
      </p>
    </div>
  );
}
