import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, KeyRound, Mail } from 'lucide-react';
import { AuthLayout } from '../../layouts/AuthLayout';
import { Button, ErrorBanner, Field, InfoBanner, Input } from '../../components/ui';
import { api } from '../../api';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [response, setResponse] = useState<{ message: string; devLink?: string | null } | null>(
    null
  );

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await api.post<{ message: string; devLink?: string | null }>('/auth/forgot', {
        email
      });
      setResponse(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível enviar as instruções.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Recupere seu acesso com segurança."
      description="Vamos confirmar sua identidade e ajudar você a voltar para a plataforma em poucos minutos."
      points={[
        'Link seguro com validade de 30 minutos',
        'Defina uma nova senha forte',
        'Volte para suas oportunidades'
      ]}
    >
      <div className="auth-heading">
        <span className="eyebrow">Recuperar acesso</span>
        <h1>{response ? 'Verifique sua caixa de entrada' : 'Esqueceu sua senha?'}</h1>
        <p>
          {response
            ? 'Se o e-mail informado estiver cadastrado, enviamos as instruções de recuperação.'
            : 'Informe o e-mail da sua conta e enviaremos as instruções para criar uma nova senha.'}
        </p>
      </div>

      {error && <ErrorBanner message={error} />}

      {response ? (
        <div className="auth-success">
          <span className="success-icon">
            <Mail size={26} />
          </span>
          <h3>Link enviado</h3>
          <p>
            Não encontrou a mensagem? Confira a pasta de spam ou aguarde alguns minutos. O link
            expira em 30 minutos.
          </p>
          {response.devLink && (
            <InfoBanner tone="warning">
              <KeyRound size={18} />
              <span>
                Ambiente de demonstração: o link de redefinição está disponível abaixo.
              </span>
            </InfoBanner>
          )}
          {response.devLink && (
            <Link to={response.devLink} className="btn btn-primary btn-block">
              Definir nova senha (demo)
            </Link>
          )}
          <button type="button" className="text-link center-link" onClick={() => setResponse(null)}>
            Reenviar e-mail
          </button>
        </div>
      ) : (
        <form className="auth-form" onSubmit={submit}>
          <Field label="E-mail" htmlFor="forgot-email" required>
            <div className="input-icon">
              <Mail size={17} />
              <Input
                id="forgot-email"
                type="email"
                placeholder="voce@exemplo.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>
          </Field>
          <Button type="submit" size="lg" loading={loading} className="btn-block">
            Enviar instruções
          </Button>
        </form>
      )}

      <Link to="/login" className="text-link center-link">
        <ArrowLeft size={16} /> Voltar para entrar
      </Link>
    </AuthLayout>
  );
}
