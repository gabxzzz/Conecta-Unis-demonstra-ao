import { useState, type FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, LockKeyhole } from 'lucide-react';
import { AuthLayout } from '../../layouts/AuthLayout';
import { Button, ErrorBanner, Field, InfoBanner, Input } from '../../components/ui';
import { api } from '../../api';

const rules = [
  { test: (value: string) => value.length >= 8, label: 'Pelo menos 8 caracteres' },
  {
    test: (value: string) => /[a-z]/.test(value) && /[A-Z]/.test(value),
    label: 'Uma letra maiúscula e uma minúscula'
  },
  {
    test: (value: string) => /[0-9]/.test(value) || /[^A-Za-z0-9]/.test(value),
    label: 'Um número ou caractere especial'
  }
];

export function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    if (rules.some((rule) => !rule.test(password))) {
      setError('A senha ainda não atende aos requisitos de segurança.');
      return;
    }
    if (password !== confirm) {
      setError('As senhas não conferem.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/reset', { token, password });
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível redefinir a senha.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Sua conta, protegida."
      description="Boas práticas de segurança ajudam a manter suas informações e oportunidades sempre protegidas."
    >
      <div className="auth-heading">
        <span className="eyebrow">Nova senha</span>
        <h1>{done ? 'Senha redefinida!' : 'Crie uma senha segura'}</h1>
        <p>
          {done
            ? 'Sua nova senha foi salva. Agora você já pode entrar na plataforma.'
            : 'Sua nova senha deve ser diferente das últimas senhas utilizadas.'}
        </p>
      </div>

      {!token && (
        <InfoBanner tone="danger">
          Link inválido. Solicite a recuperação de senha novamente.
        </InfoBanner>
      )}
      {error && <ErrorBanner message={error} />}

      {done ? (
        <div className="auth-success">
          <span className="success-icon">
            <CheckCircle2 size={28} />
          </span>
          <Link to="/login" className="btn btn-primary btn-block">
            Entrar na plataforma
          </Link>
        </div>
      ) : (
        <form className="auth-form" onSubmit={submit}>
          <Field label="Nova senha" htmlFor="new-password" required>
            <div className="input-icon">
              <LockKeyhole size={17} />
              <Input
                id="new-password"
                type="password"
                placeholder="Digite a nova senha"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>
          </Field>

          <Field label="Confirmar nova senha" htmlFor="confirm-password" required>
            <div className="input-icon">
              <LockKeyhole size={17} />
              <Input
                id="confirm-password"
                type="password"
                placeholder="Digite novamente"
                value={confirm}
                onChange={(event) => setConfirm(event.target.value)}
                required
              />
            </div>
          </Field>

          <ul className="password-rules">
            {rules.map((rule) => {
              const passed = rule.test(password);
              return (
                <li key={rule.label} className={passed ? 'passed' : ''}>
                  <CheckCircle2 size={15} /> {rule.label}
                </li>
              );
            })}
          </ul>

          <Button
            type="submit"
            size="lg"
            loading={loading}
            className="btn-block"
            disabled={!token}
          >
            Redefinir senha
          </Button>
          <Link to="/login" className="text-link center-link">
            Cancelar
          </Link>
        </form>
      )}
    </AuthLayout>
  );
}
