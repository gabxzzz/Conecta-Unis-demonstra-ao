import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Gift,
  MapPin,
  Send,
  Sparkles,
  Wallet,
  Wifi
} from 'lucide-react';
import { useApi } from '../../hooks';
import { api } from '../../api';
import {
  Badge,
  Button,
  EmptyState,
  ErrorBanner,
  Field,
  Modal,
  Skeleton,
  Textarea
} from '../../components/ui';
import { useToast } from '../../toast';
import { avatarStyle, daysUntil, formatDate, formatShortDate, initials } from '../../utils';
import type { Opportunity } from '../../types';

export function StudentOpportunityDetail() {
  const { id } = useParams();
  const { data: opportunity, loading, error, reload } = useApi<Opportunity>(
    id ? `/opportunities/${id}` : null
  );
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [applyError, setApplyError] = useState('');

  const apply = async () => {
    if (!opportunity) return;
    setSubmitting(true);
    setApplyError('');
    try {
      await api.post('/applications', { opportunityId: opportunity.id, message });
      toast('Candidatura enviada com sucesso! Acompanhe o processo em Minhas candidaturas.');
      setOpen(false);
      setMessage('');
      await reload();
    } catch (err) {
      setApplyError(err instanceof Error ? err.message : 'Não foi possível enviar sua candidatura.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="page">
        <div className="card">
          <Skeleton lines={8} />
        </div>
      </div>
    );
  }

  if (error || !opportunity) {
    return (
      <div className="page">
        <Link to="/app/oportunidades" className="text-link">
          <ArrowLeft size={16} /> Voltar para oportunidades
        </Link>
        <div className="card">
          <EmptyState
            title="Oportunidade não encontrada"
            description={error || 'Esta oportunidade pode ter sido encerrada.'}
            action={
              <Link to="/app/oportunidades" className="btn btn-primary btn-sm">
                Ver oportunidades
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  const remaining = daysUntil(opportunity.deadline);
  const expired = remaining < 0;

  return (
    <div className="page">
      <Link to="/app/oportunidades" className="text-link back-link">
        <ArrowLeft size={16} /> Voltar para oportunidades
      </Link>

      <section className="detail-hero">
        <span
          className="company-logo company-logo-lg"
          style={avatarStyle(opportunity.company?.logoColor)}
        >
          {initials(opportunity.company?.name)}
        </span>
        <div className="detail-hero-main">
          <div className="opp-tags">
            <Badge tone="info">{opportunity.type}</Badge>
            <Badge tone="neutral">{opportunity.area}</Badge>
            {opportunity.company?.verified && (
              <Badge tone="success">
                <BadgeCheck size={13} /> Empresa verificada
              </Badge>
            )}
          </div>
          <h1>{opportunity.title}</h1>
          <p>
            {opportunity.company?.name} <span>•</span> {opportunity.city} <span>•</span>{' '}
            {opportunity.modality}
          </p>
        </div>
        <div className="detail-hero-side">
          <span className="muted">Bolsa / salário</span>
          <strong>{opportunity.salary || 'A combinar'}</strong>
          <span className="muted">{opportunity.applicationsCount} estudantes já se candidataram</span>
        </div>
      </section>

      <div className="detail-grid">
        <div className="detail-main">
          <section className="card">
            <h2>Sobre a oportunidade</h2>
            <p className="detail-description">{opportunity.description}</p>
          </section>

          <section className="card">
            <h2>Responsabilidades</h2>
            {opportunity.responsibilities.length ? (
              <ul className="bullet-list">
                {opportunity.responsibilities.map((item) => (
                  <li key={item}>
                    <CheckCircle2 size={17} /> {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="muted">A empresa não detalhou responsabilidades.</p>
            )}
          </section>

          <section className="card">
            <h2>Requisitos</h2>
            {opportunity.requirements.length ? (
              <ul className="bullet-list">
                {opportunity.requirements.map((item) => (
                  <li key={item}>
                    <CheckCircle2 size={17} /> {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="muted">A empresa não detalhou requisitos.</p>
            )}
          </section>

          <section className="card">
            <h2>Benefícios</h2>
            {opportunity.benefits.length ? (
              <div className="benefit-grid">
                {opportunity.benefits.map((item) => (
                  <span key={item}>
                    <Gift size={16} /> {item}
                  </span>
                ))}
              </div>
            ) : (
              <p className="muted">Benefícios serão combinados na entrevista.</p>
            )}
          </section>

          <section className="card company-about">
            <div className="card-head">
              <div>
                <span className="eyebrow">Sobre a empresa</span>
                <h2>{opportunity.company?.name}</h2>
              </div>
              <span
                className="company-logo"
                style={avatarStyle(opportunity.company?.logoColor)}
              >
                {initials(opportunity.company?.name)}
              </span>
            </div>
            <p className="muted">
              {opportunity.company?.sector} • {opportunity.company?.city}
            </p>
            <p>
              Empresa parceira da Conecta Unis, com perfil verificado e oportunidades publicadas na
              plataforma.
            </p>
          </section>
        </div>

        <aside className="detail-aside">
          <section className="card apply-card">
            <div className="apply-card-head">
              <span className="eyebrow">Resumo da vaga</span>
              {remaining >= 0 ? (
                <Badge tone={remaining <= 3 ? 'warning' : 'success'}>
                  {remaining === 0 ? 'Último dia' : `${remaining} dias restantes`}
                </Badge>
              ) : (
                <Badge tone="danger">Encerrada</Badge>
              )}
            </div>

            <div className="summary-list">
              <div>
                <MapPin size={17} />
                <span>
                  <small>Localização</small>
                  <strong>{opportunity.city}</strong>
                </span>
              </div>
              <div>
                <Wifi size={17} />
                <span>
                  <small>Modalidade</small>
                  <strong>{opportunity.modality}</strong>
                </span>
              </div>
              <div>
                <Clock3 size={17} />
                <span>
                  <small>Tipo</small>
                  <strong>{opportunity.type}</strong>
                </span>
              </div>
              <div>
                <Wallet size={17} />
                <span>
                  <small>Bolsa / salário</small>
                  <strong>{opportunity.salary || 'A combinar'}</strong>
                </span>
              </div>
              <div>
                <CalendarDays size={17} />
                <span>
                  <small>Inscrições até</small>
                  <strong>{formatDate(opportunity.deadline)}</strong>
                </span>
              </div>
            </div>

            {opportunity.hasApplied ? (
              <>
                <div className="alert alert-success">
                  <CheckCircle2 size={18} /> Candidatura enviada
                  {opportunity.myApplicationCreatedAt
                    ? ` em ${formatShortDate(opportunity.myApplicationCreatedAt)}`
                    : ''}
                </div>
                <Link
                  to={`/app/candidaturas/${opportunity.myApplicationId}`}
                  className="btn btn-secondary btn-block"
                >
                  Acompanhar candidatura <ArrowRight size={16} />
                </Link>
              </>
            ) : (
              <Button
                className="btn-block"
                size="lg"
                disabled={expired}
                onClick={() => setOpen(true)}
              >
                <Send size={17} /> {expired ? 'Inscrições encerradas' : 'Candidatar-se'}
              </Button>
            )}

            <p className="apply-note">
              <Sparkles size={14} /> Seu perfil e currículo serão enviados para a empresa.
            </p>
          </section>

          <section className="card mini-company-card">
            <Building2 size={18} />
            <div>
              <strong>{opportunity.company?.name}</strong>
              <span>{opportunity.company?.sector}</span>
            </div>
          </section>
        </aside>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Enviar candidatura"
        subtitle={opportunity.title}
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={apply} loading={submitting}>
              <Send size={16} /> Enviar candidatura
            </Button>
          </>
        }
      >
        {applyError && <ErrorBanner message={applyError} />}
        <div className="apply-company">
          <span className="company-logo" style={avatarStyle(opportunity.company?.logoColor)}>
            {initials(opportunity.company?.name)}
          </span>
          <div>
            <strong>{opportunity.company?.name}</strong>
            <span>
              {opportunity.title} • {opportunity.city}
            </span>
          </div>
        </div>
        <Field
          label="Mensagem para a empresa (opcional)"
          hint="Conte brevemente por que esta oportunidade combina com você. Até 600 caracteres."
        >
          <Textarea
            rows={5}
            maxLength={600}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Olá! Tenho interesse porque..."
          />
        </Field>
        <div className="alert alert-info">
          <CheckCircle2 size={18} />
          Seu currículo cadastrado será compartilhado com a empresa.
        </div>
      </Modal>
    </div>
  );
}
