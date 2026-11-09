import { useState } from 'react';
import { Search, ShieldBan, ShieldCheck, Users } from 'lucide-react';
import { useApi } from '../../hooks';
import { api } from '../../api';
import {
  Avatar,
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
import { formatShortDate, roleLabel } from '../../utils';
import { useAuth } from '../../auth';
import type { User } from '../../types';

export function AdminUsers() {
  const { user: currentUser } = useAuth();
  const { data, loading, error, reload } = useApi<User[]>('/admin/users');
  const toast = useToast();
  const [query, setQuery] = useState('');
  const [role, setRole] = useState('Todos');
  const [status, setStatus] = useState('Todos');

  const users = data || [];
  const filtered = users.filter((user) => {
    const term = query.toLowerCase();
    const matchesQuery =
      !term ||
      [user.name, user.email, user.university, user.companyName]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(term));
    const matchesRole = role === 'Todos' || user.role === role;
    const matchesStatus = status === 'Todos' || user.status === status;
    return matchesQuery && matchesRole && matchesStatus;
  });

  const toggleStatus = async (user: User) => {
    const nextStatus = user.status === 'suspenso' ? 'ativo' : 'suspenso';
    try {
      await api.patch(`/admin/users/${user.id}/status`, { status: nextStatus });
      toast(nextStatus === 'suspenso' ? 'Usuário suspenso.' : 'Usuário reativado.');
      await reload();
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Não foi possível alterar o usuário.', 'error');
    }
  };

  return (
    <div className="page">
      <PageHeader
        eyebrow="Administração"
        title="Usuários"
        subtitle="Gerencie estudantes, responsáveis de empresas e administradores."
      />

      <div className="stat-grid stat-grid-3">
        <StatCard
          icon={<Users size={20} />}
          label="Total de usuários"
          value={users.length}
          hint="todos os perfis"
          tone="blue"
        />
        <StatCard
          icon={<Users size={20} />}
          label="Estudantes"
          value={users.filter((user) => user.role === 'student').length}
          hint="em busca de oportunidades"
          tone="violet"
        />
        <StatCard
          icon={<Users size={20} />}
          label="Empresas"
          value={users.filter((user) => user.role === 'company').length}
          hint="responsáveis cadastrados"
          tone="green"
        />
        <StatCard
          icon={<ShieldCheck size={20} />}
          label="Suspensos"
          value={users.filter((user) => user.status === 'suspenso').length}
          hint="contas bloqueadas"
          tone="amber"
        />
      </div>

      <section className="filter-panel filter-panel-inline filter-panel-wrap">
        <div className="search-input">
          <Search size={18} />
          <input
            type="search"
            placeholder="Buscar por nome ou e-mail"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <div className="filter-field filter-field-inline">
          <span>Tipo de usuário</span>
          <Select value={role} onChange={(event) => setRole(event.target.value)}>
            <option value="Todos">Todos</option>
            <option value="student">Estudante</option>
            <option value="company">Empresa</option>
            <option value="admin">Administração</option>
          </Select>
        </div>
        <div className="filter-field filter-field-inline">
          <span>Status</span>
          <Select value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="Todos">Todos</option>
            <option value="ativo">Ativo</option>
            <option value="suspenso">Suspenso</option>
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
                  <th>Usuário</th>
                  <th>Tipo</th>
                  <th>Instituição / Empresa</th>
                  <th>Cadastro</th>
                  <th>Status</th>
                  <th aria-label="Ações" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="table-user">
                        <Avatar name={user.name} color={user.avatarColor} size="sm" />
                        <div>
                          <strong>{user.name}</strong>
                          <span>{user.email}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <Badge tone={user.role === 'admin' ? 'violet' : user.role === 'company' ? 'info' : 'neutral'}>
                        {roleLabel[user.role]}
                      </Badge>
                    </td>
                    <td>{user.companyName || user.university || '—'}</td>
                    <td>{formatShortDate(user.createdAt)}</td>
                    <td>
                      <StatusBadge kind="user" status={user.status} />
                    </td>
                    <td>
                      {user.id !== currentUser?.id && user.role !== 'admin' && (
                        <Button
                          variant={user.status === 'suspenso' ? 'secondary' : 'ghost'}
                          size="sm"
                          onClick={() => toggleStatus(user)}
                        >
                          {user.status === 'suspenso' ? (
                            <>
                              <ShieldCheck size={15} /> Reativar
                            </>
                          ) : (
                            <>
                              <ShieldBan size={15} /> Suspender
                            </>
                          )}
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon={<Search size={26} />}
            title="Nenhum usuário encontrado"
            description="Tente ajustar os filtros selecionados."
          />
        )}
      </section>
    </div>
  );
}
