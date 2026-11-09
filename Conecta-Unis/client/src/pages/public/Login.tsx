import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, LockKeyhole, Mail } from 'lucide-react';
import { AuthLayout } from '../../layouts/AuthLayout';
import { Button, ErrorBanner, Field, Input } from '../../components/ui';
import { homeForRole, useAuth } from '../../auth';

const demoAccounts = [
  { label: 'Estudante', email: 'ana@aluno.com', password: '123456' },
  { label: 'Empresa', email: 'rh@techsolutions.com', password: '123456' },
  { label: 'Admin', email: 'admin@conectaunis.com', password: 'admin123' }
];

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await login(email, password);
      navigate(homeForRole(response.user.role), { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível entrar.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (demo: (typeof demoAccounts)[number]) => {
    setEmail(demo.email);
    setPassword(demo.password);
    setError('');
  };

  return (
    <AuthLayout
      title="Boas-vindas de volta."
      description="Entre para acompanhar oportunidades, conexões e os próximos passos da sua jornada."
      points={[
        'Acompanhe candidaturas em tempo real',
        'Receba convites para entrevistas',
        'Mantenha seu perfil sempre atualizado'
      ]}
    >
      <div className="auth-heading">
        <span className="eyebrow">Acesso à plataforma</span>
        <h1>Entrar na Conecta Unis</h1>
        <p>Acesse sua conta para continuar de onde parou.</p>
      </div>

      {error && <ErrorBanner message={error} />}

      <form className="auth-form" onSubmit={submit}>
        <Field label="E-mail" htmlFor="login-email" required>
          <div className="input-icon">
            <Mail size={17} />
            <Input
              id="login-email"
              type="email"
              autoComplete="email"
              placeholder="voce@exemplo.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
        </Field>

        <Field label="Senha" htmlFor="login-password" required>
          <div className="input-icon">
            <LockKeyhole size={17} />
            <Input
              id="login-password"
              type="password"
              autoComplete="current-password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>
        </Field>

        <div className="auth-row">
          <label className="checkbox">
            <input
              type="checkbox"
              checked={remember}
              onChange={(event) => setRemember(event.target.checked)}
            />
            <span>Lembrar de mim</span>
          </label>
          <Link to="/recuperar-senha" className="text-link">
            Esqueci minha senha
          </Link>
        </div>

        <Button type="submit" size="lg" loading={loading} className="btn-block">
          Entrar <ArrowRight size={18} />
        </Button>
      </form>

      <p className="auth-switch">
        Ainda não tem perfil? <Link to="/cadastro">Cadastre-se gratuitamente</Link>
      </p>

      <div className="demo-box">
        <div className="demo-box-head">
          <strong>Contas de demonstração</strong>
          <span>Clique para preencher</span>
        </div>
        <div className="demo-grid">
          {demoAccounts.map((demo) => (
            <button
              type="button"
              key={demo.label}
              className="demo-account"
              onClick={() => fillDemo(demo)}
            >
              <strong>{demo.label}</strong>
              <span>{demo.email}</span>
              <small>senha: {demo.password}</small>
            </button>
          ))}
        </div>
      </div>
    </AuthLayout>
  );
}
