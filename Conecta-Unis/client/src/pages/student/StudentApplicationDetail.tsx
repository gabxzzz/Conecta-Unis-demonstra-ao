import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Download,
  FileText,
  MapPin,
  Video
} from 'lucide-react';
import { useApi } from '../../hooks';
import {
  Badge,
  Button,
  EmptyState,
  Skeleton,
  StatusBadge
} from '../../components/ui';
import { buildTimeline, formatDate, formatShortDate, timeAgo } from '../../utils';
import type { Application } from '../../types';

export function StudentApplicationDetail() {
  const { id } = useParams();
  const { data: application, loading, error } = useApi<Application>(
    id ? `/applications/${id}` : null
  );

  if (loading) {
    return (
      <div className="page">
        <div className="card">
          <Skeleton lines={8} />
        </div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="page">
        <Link to="/app/candidaturas" className="text-link">
          <ArrowLeft size={16} /> Voltar para candidaturas
        </Link>
        <div className="card">
          <EmptyState
            title="Candidatura não encontrada"
            description={error || 'Não foi possível carregar os detalhes desta candidatura.'}
            action={
              <Link to="/app/candidaturas" className="btn btn-primary btn-sm">
                Ver minhas candidaturas
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  const timeline = buildTimeline(application);
  const protocol = `CU-2026-${application.id.slice(-4).toUpperCase()}`;

  return (
    <div className="page">
      <Link to="/app/candidaturas" className="text-link back-link">
        <ArrowLeft size={16} /> Voltar para candidaturas
      </Link>

      <section className="detail-hero">
        <span
          className="company-logo company-logo-lg"
          style={{ background: application.company?.logoColor || '#1f63e0' }}
        >
          {application.company?.name?.slice(0, 2).toUpperCase() || 'CU'}
        </span>
        <div className="detail-hero-main">
          <div className="opp-tags">
            <StatusBadge kind="application" status={application.status} />
            <Badge tone="neutral">{application.opportunity?.type}</Badge>
          </div>
          <h1>{application.opportunity?.title}</h1>
          <p>
            {application.company?.name} <span>•</span> {application.opportunity?.city}{' '}
            <span>•</span> {application.opportunity?.modality}
          </p>
        </div>
        <div className="detail-hero-side">
          <span className="muted">Protocolo</span>
          <strong>{protocol}</strong>
          <span className="muted">Última atualização {timeAgo(application.updatedAt)}</span>
        </div>
      </section>

      <div className="detail-grid">
        <div className="detail-main">
          <section className="card">
            <div className="card-head">
              <div>
                <span className="eyebrow">Acompanhamento</span>
                <h2>Linha do tempo do processo</h2>
              </div>
              <Badge tone="info">{timeline.filter((step) => step.state === 'done').length} etapas concluídas</Badge>
            </div>

            <div className="timeline">
              {timeline.map((step, index) => (
                <div className={`timeline-step ${step.state}`} key={`${step.label}-${index}`}>
                  <span className="timeline-dot">
                    {step.state === 'done' ? <CheckCircle2 size={15} /> : <Clock3 size={15} />}
                  </span>
                  <div className="timeline-content">
                    <div className="timeline-head">
                      <strong>{step.label}</strong>
                      {step.date && <span>{formatDate(step.date)}</span>}
                    </div>
                    <p>{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {application.interview && (
            <section className="card interview-detail-card">
              <div className="card-head">
                <div>
                  <span className="eyebrow">Entrevista</span>
                  <h2>Sua entrevista</h2>
                </div>
                <Badge tone="success" dot>
                  Confirmada
                </Badge>
              </div>
              <div className="interview-card">
                <div className="interview-date">
                  <span>{formatShortDate(application.interview.date)}</span>
                  <strong>{application.interview.time}</strong>
                </div>
                <div className="interview-info">
                  <strong>{application.interview.format || 'Videoconferência'}</strong>
                  <span>
                    <CalendarDays size={14} /> {formatDate(application.interview.date)} às{' '}
                    {application.interview.time}
                  </span>
                  {application.interview.link && (
                    <span>
                      <Video size={14} /> {application.interview.link}
                    </span>
                  )}
                  {application.interview.link && (
                    <a
                      href={application.interview.link}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-primary btn-sm"
                    >
                      <Video size={16} /> Acessar entrevista
                    </a>
                  )}
                </div>
              </div>
            </section>
          )}

          <section className="card">
            <div className="card-head">
              <div>
                <span className="eyebrow">Sua candidatura</span>
                <h2>Mensagem enviada</h2>
              </div>
            </div>
            <p className="detail-description">
              {application.message || 'Nenhuma mensagem adicional foi enviada.'}
            </p>
          </section>
        </div>

        <aside className="detail-aside">
          <section className="card">
            <h2>Resumo</h2>
            <div className="summary-list">
              <div>
                <FileText size={17} />
                <span>
                  <small>Oportunidade</small>
                  <strong>{application.opportunity?.title}</strong>
                </span>
              </div>
              <div>
                <MapPin size={17} />
                <span>
                  <small>Localização</small>
                  <strong>{application.opportunity?.city}</strong>
                </span>
              </div>
              <div>
                <CalendarDays size={17} />
                <span>
                  <small>Candidatura enviada</small>
                  <strong>{formatDate(application.createdAt)}</strong>
                </span>
              </div>
              <div>
                <Clock3 size={17} />
                <span>
                  <small>Status atual</small>
                  <StatusBadge kind="application" status={application.status} />
                </span>
              </div>
            </div>
          </section>

          <section className="card">
            <h2>Documento enviado</h2>
            <div className="document-row">
              <span className="document-icon">
                <FileText size={18} />
              </span>
              <div>
                <strong>{application.student?.resumeName || 'Currículo'}</strong>
                <span>PDF • enviado com a candidatura</span>
              </div>
              <button type="button" className="icon-btn" title="Download indisponível na demo">
                <Download size={16} />
              </button>
            </div>
          </section>

          <section className="card">
            <h2>Precisa de ajuda?</h2>
            <p className="muted">
              Fale com a equipe Conecta Unis se tiver dúvidas sobre este processo.
            </p>
            <Button
              variant="secondary"
              className="btn-block btn-sm"
              onClick={() => window.open('mailto:ajuda@conectaunis.com')}
            >
              Falar com o suporte
            </Button>
          </section>
        </aside>
      </div>
    </div>
  );
}
