import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, MapPin } from 'lucide-react';
import { Logo } from '../components/Logo';

export function AuthLayout({
  title,
  description,
  points = [
    'Oportunidades alinhadas ao seu perfil',
    'Conexões com empresas de verdade',
    'Acompanhamento de cada etapa'
  ],
  children,
  wide = false
}: {
  title: string;
  description: string;
  points?: string[];
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <div className="auth-page">
      <aside className="auth-aside">
        <Link to="/" className="auth-brand" aria-label="Conecta Unis">
          <Logo />
        </Link>

        <div className="auth-aside-content">
          <span className="eyebrow eyebrow-light">Conexões que transformam</span>
          <h2>{title}</h2>
          <p>{description}</p>

          <div className="aside-opportunity">
            <div className="aside-opportunity-head">
              <span className="company-logo company-logo-sm" style={{ background: '#1f63e0' }}>
                NT
              </span>
              <div>
                <strong>Estágio em Produto</strong>
                <small>Nexo Tecnologia • São Paulo</small>
              </div>
              <span className="aside-tag">Nova</span>
            </div>
            <div className="aside-opportunity-meta">
              <span>
                <MapPin size={13} /> Híbrido
              </span>
              <span>6h/dia</span>
            </div>
          </div>

          <ul className="aside-points">
            {points.map((point) => (
              <li key={point}>
                <CheckCircle2 size={17} /> {point}
              </li>
            ))}
          </ul>
        </div>

        <p className="auth-aside-foot">© 2026 Conecta Unis. Segurança e privacidade.</p>
      </aside>

      <main className="auth-main">
        <div className="auth-main-top">
          <Link to="/" className="text-link">
            <ArrowLeft size={16} /> Voltar ao site
          </Link>
        </div>
        <div className={wide ? 'auth-card auth-card-wide' : 'auth-card'}>{children}</div>
        <p className="auth-help">
          Precisa de ajuda? <a href="mailto:ajuda@conectaunis.com">Fale conosco</a>
        </p>
      </main>
    </div>
  );
}
