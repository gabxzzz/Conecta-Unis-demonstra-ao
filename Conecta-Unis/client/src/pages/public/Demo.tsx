import { useState, type CSSProperties } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  BellRing,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  FileText,
  GraduationCap,
  LayoutDashboard,
  MonitorPlay,
  ShieldCheck,
  Sparkles,
  UserRound,
  Users
} from 'lucide-react';
import { homeForRole, useAuth } from '../../auth';
import { Logo } from '../../components/Logo';
import { Button, ErrorBanner } from '../../components/ui';
import type { Role } from '../../types';

interface DemoAccount {
  role: Role;
  label: string;
  title: string;
  description: string;
  name: string;
  email: string;
  password: string;
  color: string;
  icon: typeof GraduationCap;
  highlights: { icon: typeof GraduationCap; text: string }[];
}

const demoAccounts: DemoAccount[] = [
  {
    role: 'student',
    label: 'Aluno',
    title: 'Portal do estudante',
    description:
      'Entre como a Ana e acompanhe oportunidades, candidaturas, entrevistas e notificações.',
    name: 'Ana Martins',
    email: 'ana@aluno.com',
    password: '123456',
    color: '#1f63e0',
    icon: GraduationCap,
    highlights: [
      { icon: BriefcaseBusiness, text: 'Oportunidades recomendadas' },
      { icon: FileText, text: 'Candidaturas e entrevistas' },
      { icon: BellRing, text: 'Notificações e perfil' }
    ]
  },
  {
    role: 'company',
    label: 'Empresa',
    title: 'Área da empresa',
    description:
      'Entre como a Tech Solutions e gerencie vagas, acompanhe candidatos e edite o perfil da empresa.',
    name: 'Tech Solutions',
    email: 'rh@techsolutions.com',
    password: '123456',
    color: '#7c3aed',
    icon: Building2,
    highlights: [
      { icon: BriefcaseBusiness, text: 'Publicar e gerenciar oportunidades' },
      { icon: Users, text: 'Visualizar candidatos' },
      { icon: LayoutDashboard, text: 'Acompanhar o processo seletivo' }
    ]
  },
  {
    role: 'admin',
    label: 'Administrador',
    title: 'Administração da plataforma',
    description:
      'Entre como a Marina e acompanhe indicadores, gerencie usuários e modere empresas e oportunidades.',
    name: 'Marina Costa',
    email: 'admin@conectaunis.com',
    password: 'admin123',
    color: '#0f9f6e',
    icon: ShieldCheck,
    highlights: [
      { icon: LayoutDashboard, text: 'Visão geral da plataforma' },
      { icon: Users, text: 'Gestão de usuários e empresas' },
      { icon: ShieldCheck, text: 'Moderação de oportunidades' }
    ]
  }
];

export function Demo() {
  const { login, logout, user, company } = useAuth();
  const navigate = useNavigate();
  const [loadingRole, setLoadingRole] = useState<Role | null>(null);
  const [error, setError] = useState('');

  const displayName = user?.role === 'company' ? company?.name || user.name : user?.name;

  const enter = async (account: DemoAccount) => {
    setError('');
    setLoadingRole(account.role);
    try {
      const response = await login(account.email, account.password);
      navigate(homeForRole(response.user.role), { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível entrar na conta de demonstração.');
    } finally {
      setLoadingRole(null);
    }
  };

  return (
    <div className="demo-page">
      <header className="demo-topbar">
        <div className="container demo-topbar-inner">
          <Link to="/" aria-label="Conecta Unis">
            <Logo />
          </Link>
          <Link to="/" className="text-link">
            <ArrowLeft size={16} /> Voltar ao site
          </Link>
        </div>
      </header>

      <main className="demo-main">
        <div className="container">
          <div className="demo-hero">
            <span className="demo-mode-badge">
              <MonitorPlay size={15} /> Modo demonstração
            </span>
            <h1>
              Escolha um perfil e entre <span>direto na experiência</span>.
            </h1>
            <p>
              Cada botão faz login automático com uma conta de demonstração já preenchida com
              oportunidades, candidaturas e dados de exemplo. Ideal para apresentar o projeto sem
              precisar cadastrar nada.
            </p>

            {user && (
              <div className="demo-current">
                <span>
                  Você está conectado como <strong>{displayName}</strong>.
                </span>
                <button type="button" className="demo-current-logout" onClick={logout}>
                  Sair da conta atual
                </button>
              </div>
            )}

            {error && <ErrorBanner message={error} />}
          </div>

          <div className="demo-role-grid">
            {demoAccounts.map((account) => {
              const Icon = account.icon;
              const loading = loadingRole === account.role;
              return (
                <article
                  key={account.role}
                  className="demo-role-card"
                  style={{ '--demo-accent': account.color } as CSSProperties}
                >
                  <div className="demo-role-head">
                    <span className="demo-role-icon">
                      <Icon size={24} />
                    </span>
                    <span className="demo-role-label">{account.label}</span>
                  </div>

                  <h2>{account.title}</h2>
                  <p>{account.description}</p>

                  <ul className="demo-role-list">
                    {account.highlights.map((item) => {
                      const HighlightIcon = item.icon;
                      return (
                        <li key={item.text}>
                          <HighlightIcon size={17} /> {item.text}
                        </li>
                      );
                    })}
                  </ul>

                  <div className="demo-role-account">
                    <span>
                      <UserRound size={14} /> {account.name}
                    </span>
                    <small>{account.email}</small>
                    <small>senha: {account.password}</small>
                  </div>

                  <Button
                    type="button"
                    size="lg"
                    className="btn-block demo-role-cta"
                    loading={loading}
                    disabled={loadingRole !== null}
                    onClick={() => enter(account)}
                  >
                    Entrar como {account.label.toLowerCase()} <ArrowRight size={18} />
                  </Button>
                </article>
              );
            })}
          </div>

          <div className="demo-notes">
            <div className="demo-note">
              <span>
                <Sparkles size={18} />
              </span>
              <div>
                <strong>Sem cadastro e sem configuração</strong>
                <p>As contas de demonstração já existem no banco de dados do projeto.</p>
              </div>
            </div>
            <div className="demo-note">
              <span>
                <CheckCircle2 size={18} />
              </span>
              <div>
                <strong>Troque de perfil quando quiser</strong>
                <p>
                  Dentro da plataforma, use <em>Trocar perfil (demo)</em> no menu lateral para voltar
                  a esta tela.
                </p>
              </div>
            </div>
            <div className="demo-note">
              <span>
                <ShieldCheck size={18} />
              </span>
              <div>
                <strong>Dados de exemplo</strong>
                <p>
                  Tudo o que aparece aqui é fictício e serve apenas para demonstrar o fluxo do
                  sistema.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
