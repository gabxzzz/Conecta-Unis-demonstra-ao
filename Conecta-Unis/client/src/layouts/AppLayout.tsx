import { useEffect, useMemo, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Bell,
  BriefcaseBusiness,
  Building2,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  MonitorPlay,
  ShieldCheck,
  UserRound,
  Users,
  X
} from 'lucide-react';
import { useAuth } from '../auth';
import { useApi } from '../hooks';
import { Avatar } from '../components/ui';
import { Logo } from '../components/Logo';
import { roleLabel } from '../utils';
import type { AppNotification } from '../types';

const navByRole = {
  student: [
    { to: '/app', label: 'Visão geral', icon: LayoutDashboard, end: true },
    { to: '/app/oportunidades', label: 'Oportunidades', icon: BriefcaseBusiness },
    { to: '/app/candidaturas', label: 'Minhas candidaturas', icon: FileText },
    { to: '/app/notificacoes', label: 'Notificações', icon: Bell },
    { to: '/app/perfil', label: 'Meu perfil', icon: UserRound }
  ],
  company: [
    { to: '/empresa', label: 'Visão geral', icon: LayoutDashboard, end: true },
    { to: '/empresa/oportunidades', label: 'Oportunidades', icon: BriefcaseBusiness },
    { to: '/empresa/candidatos', label: 'Candidatos', icon: Users },
    { to: '/empresa/perfil', label: 'Perfil da empresa', icon: Building2 }
  ],
  admin: [
    { to: '/admin', label: 'Visão geral', icon: LayoutDashboard, end: true },
    { to: '/admin/usuarios', label: 'Usuários', icon: Users },
    { to: '/admin/empresas', label: 'Empresas', icon: Building2 },
    { to: '/admin/oportunidades', label: 'Oportunidades', icon: BriefcaseBusiness },
    { to: '/admin/candidaturas', label: 'Candidaturas', icon: FileText },
    { to: '/admin/moderacao', label: 'Moderação', icon: ShieldCheck }
  ]
};

const portalLabel = {
  student: 'Portal do estudante',
  company: 'Área da empresa',
  admin: 'Administração'
};

export function AppLayout() {
  const { user, company, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const role = user?.role || 'student';
  const nav = navByRole[role];
  const notifications = useApi<AppNotification[]>(role === 'student' ? '/notifications' : null);
  const unread = (notifications.data || []).filter((item) => !item.read).length;

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const pageTitle = useMemo(() => {
    const exact = nav.find((item) => item.to === location.pathname);
    if (exact) return exact.label;
    const nested = [...nav]
      .sort((a, b) => b.to.length - a.to.length)
      .find((item) => location.pathname.startsWith(`${item.to}/`));
    return nested?.label || portalLabel[role];
  }, [location.pathname, nav, role]);

  const displayName = role === 'company' ? company?.name || user?.name : user?.name;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-shell">
      {menuOpen && <button className="sidebar-backdrop" onClick={() => setMenuOpen(false)} aria-label="Fechar menu" />}

      <aside className={`sidebar ${menuOpen ? 'open' : ''}`}>
        <div className="sidebar-top">
          <Link to="/" className="sidebar-brand">
            <Logo />
          </Link>
          <button className="icon-btn sidebar-close" onClick={() => setMenuOpen(false)} aria-label="Fechar menu">
            <X size={18} />
          </button>
        </div>

        <span className="sidebar-role">{portalLabel[role]}</span>

        <nav className="side-nav">
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => `side-link ${isActive ? 'active' : ''}`}
              >
                <Icon size={19} />
                <span>{item.label}</span>
                {item.label === 'Notificações' && unread > 0 && (
                  <span className="side-count">{unread}</span>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="account-card">
            <Avatar
              name={displayName}
              color={role === 'company' ? company?.logoColor : user?.avatarColor}
              size="sm"
            />
            <div>
              <strong>{displayName}</strong>
              <small>{roleLabel[role]}</small>
            </div>
          </div>
          <Link to="/demonstracao" className="side-link demo-switch-link">
            <MonitorPlay size={18} />
            <span>Trocar perfil (demo)</span>
          </Link>
          <button type="button" className="side-link logout-link" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      <div className="app-content">
        <header className="topbar">
          <div className="topbar-left">
            <button className="icon-btn mobile-toggle" onClick={() => setMenuOpen(true)} aria-label="Abrir menu">
              <Menu size={20} />
            </button>
            <div>
              <span className="topbar-eyebrow">{portalLabel[role]}</span>
              <strong>{pageTitle}</strong>
            </div>
          </div>
          <div className="topbar-right">
            {role === 'student' && (
              <Link to="/app/notificacoes" className="topbar-icon" aria-label="Notificações">
                <Bell size={19} />
                {unread > 0 && <span className="notif-dot">{unread}</span>}
              </Link>
            )}
            <Link
              to={role === 'student' ? '/app/perfil' : role === 'company' ? '/empresa/perfil' : '/admin'}
              className="user-chip"
            >
              <Avatar
                name={displayName}
                color={role === 'company' ? company?.logoColor : user?.avatarColor}
                size="sm"
              />
              <span>
                <strong>{displayName}</strong>
                <small>{user?.email}</small>
              </span>
            </Link>
          </div>
        </header>

        <main className="app-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
