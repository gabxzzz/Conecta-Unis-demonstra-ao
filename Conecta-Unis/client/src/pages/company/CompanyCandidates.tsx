import { useState } from 'react';
import {
  CalendarCheck2,
  CheckCircle2,
  FileText,
  Search,
  Users
} from 'lucide-react';
import { useApi } from '../../hooks';
import { api } from '../../api';
import {
  Avatar,
  Badge,
  Button,
  EmptyState,
  ErrorBanner,
  Field,
  Input,
  Modal,
  PageHeader,
  Select,
  Skeleton,
  StatCard,
  StatusBadge
} from '../../components/ui';
import { useToast } from '../../toast';
import { applicationStatus, formatDate, formatShortDate } from '../../utils';
import type { Application } from '../../types';

export function CompanyCandidates() {
  const { data, loading, error, reload } = useApi<Application[]>('/applications/company');
  const toast = useToast();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('Todos');
  const [opportunityFilter, setOpportunityFilter] = useState('Todas');
  const [selected, setSelected] = useState<Application | null>(null);
  const [nextStatus, setNextStatus] = useState('em_analise');
  const [interview, setInterview] = useState({ date: '', time: '14:30', link: '' });
  const [saving, setSaving] = useState(false);
  const [manageError, setManageError] = useState('');

  const applications = data || [];
  const opportunities = Array.from(
    new Map(
      applications
        .filter((application) => application.opportunity)
        .map((application) => [application.opportunity!.id, application.opportunity!])
    ).values()
  );

  const filtered = applications.filter((application) => {
    const term = query.toLowerCase();
    const matchesQuery =
      !term ||
      [application.student?.name, application.student?.course, application.opportunity?.title]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(term));
    const matchesStatus = status === 'Todos' || application.status === status;
    const matchesOpportunity =
      opportunityFilter === 'Todas' || application.opportunityId === opportunityFilter;
    return matchesQuery && matchesStatus && matchesOpportunity;
  });

  const openManage = (application: Application) => {
    setSelected(application);
    setNextStatus(application.status === 'enviada' ? 'em_analise' : application.status);
    setInterview({
      date: application.interview?.date || '',
      time: application.interview?.time || '14:30',
      link: application.interview?.link || ''
    });
    setManageError('');
  };

  const save = async () => {
    if (!selected) return;
    if (nextStatus === 'entrevista' && (!interview.date || !interview.time)) {
      setManageError('Informe a data e o horário da entrevista.');
      return;
    }
    setSaving(true);
    setManageError('');
    try {
      await api.patch(`/applications/${selected.id}/status`, {
        status: nextStatus,
        interview: nextStatus === 'entrevista' ? interview : undefined
      });
      toast('Status do candidato atualizado. O estudante foi notificado.');
      setSelected(null);
      await reload();
    } catch (err) {
      setManageError(err instanceof Error ? err.message : 'Não foi possível atualizar o candidato.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page">
      <PageHeader
        eyebrow="Área da empresa"
        title="Candidatos"
        subtitle="Gerencie candidaturas, avance etapas e agende entrevistas."
      />

      <div className="stat-grid stat-grid-3">
        <StatCard
          icon={<Users size={20} />}
          label="Candidatos"
          value={applications.length}
          hint="em todos os processos"
          tone="blue"
        />
        <StatCard
          icon={<Search size={20} />}
          label="Em análise"
          value={applications.filter((item) => item.status === 'em_analise').length}
          hint="aguardando avaliação"
          tone="amber"
        />
        <StatCard
          icon={<CalendarCheck2 size={20} />}
          label="Entrevistas"
          value={applications.filter((item) => item.status === 'entrevista').length}
          hint="agendadas"
          tone="green"
        />
        <StatCard
          icon={<CheckCircle2 size={20} />}
          label="Aprovados"
          value={applications.filter((item) => item.status === 'aprovada').length}
          hint="candidatos selecionados"
          tone="violet"
        />
      </div>

      <section className="filter-panel filter-panel-inline filter-panel-wrap">
        <div className="search-input">
          <Search size={18} />
          <input
            type="search"
            placeholder="Buscar por nome, curso ou oportunidade"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <div className="filter-field filter-field-inline">
          <span>Oportunidade</span>
          <Select
            value={opportunityFilter}
            onChange={(event) => setOpportunityFilter(event.target.value)}
          >
            <option value="Todas">Todas</option>
            {opportunities.map((opportunity) => (
              <option key={opportunity.id} value={opportunity.id}>
                {opportunity.title}
              </option>
            ))}
          </Select>
        </div>
        <div className="filter-field filter-field-inline">
          <span>Status</span>
          <Select value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="Todos">Todos</option>
            <option value="enviada">Enviada</option>
            <option value="em_analise">Em análise</option>
            <option value="entrevista">Entrevista</option>
            <option value="aprovada">Aprovada</option>
            <option value="recusada">Recusada</option>
          </Select>
        </div>
      </section>

      {error && <ErrorBanner message={error} />}

      <section className="card">
        <div className="card-head">
          <div>
            <h2>Candidaturas recebidas</h2>
            <p className="muted">{filtered.length} candidatos listados</p>
          </div>
        </div>

        {loading ? (
          <Skeleton lines={7} />
        ) : filtered.length ? (
          <div className="application-list application-list-detailed">
            {filtered.map((application) => (
              <div key={application.id} className="application-row application-row-detailed">
                <Avatar
                  name={application.student?.name}
                  color={application.student?.avatarColor}
                  size="md"
                />
                <div className="application-row-main">
                  <strong>{application.student?.name}</strong>
                  <span>
                    {application.student?.course} <i>•</i> {application.student?.university}
                  </span>
                </div>
                <div className="application-row-opportunity">
                  <small>Candidatura para</small>
                  <strong>{application.opportunity?.title}</strong>
                </div>
                <div className="application-row-meta">
                  <small>Data</small>
                  <strong>{formatShortDate(application.createdAt)}</strong>
                </div>
                <StatusBadge kind="application" status={application.status} />
                <Button variant="secondary" size="sm" onClick={() => openManage(application)}>
                  Gerenciar
                </Button>
              </div>
            ))}
          </div>
        ) : applications.length ? (
          <EmptyState
            icon={<Search size={26} />}
            title="Nenhum candidato encontrado"
            description="Ajuste os filtros para ver outras candidaturas."
            action={
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setQuery('');
                  setStatus('Todos');
                  setOpportunityFilter('Todas');
                }}
              >
                Limpar filtros
              </Button>
            }
          />
        ) : (
          <EmptyState
            icon={<Users size={28} />}
            title="Nenhuma candidatura recebida"
            description="Publique oportunidades para começar a receber candidatos."
          />
        )}
      </section>

      <Modal
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title={selected?.student?.name || 'Candidato'}
        subtitle={selected?.opportunity?.title}
        size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={() => setSelected(null)}>
              Cancelar
            </Button>
            <Button onClick={save} loading={saving}>
              Salvar e notificar
            </Button>
          </>
        }
      >
        {manageError && <ErrorBanner message={manageError} />}

        {selected?.student && (
          <>
            <div className="candidate-profile">
              <Avatar
                name={selected.student.name}
                color={selected.student.avatarColor}
                size="lg"
              />
              <div>
                <h3>{selected.student.name}</h3>
                <p>
                  {selected.student.course} • {selected.student.period}
                </p>
                <p className="muted">
                  {selected.student.university} • {selected.student.city}
                </p>
              </div>
              <StatusBadge kind="application" status={selected.status} />
            </div>

            <div className="candidate-contact">
              <span>{selected.student.email}</span>
              <span>{selected.student.phone || 'Telefone não informado'}</span>
            </div>

            {selected.student.bio && <p className="detail-description">{selected.student.bio}</p>}

            <div className="skill-row">
              {selected.student.skills.map((skill) => (
                <span key={skill}>{skill}</span>
              ))}
            </div>

            <div className="modal-section">
              <h4>Mensagem do candidato</h4>
              <p className="muted">
                {selected.message || 'O candidato não enviou uma mensagem.'}
              </p>
            </div>

            <div className="document-row">
              <span className="document-icon">
                <FileText size={18} />
              </span>
              <div>
                <strong>{selected.student.resumeName || 'Currículo'}</strong>
                <span>Enviado em {formatDate(selected.createdAt)}</span>
              </div>
            </div>

            <div className="divider" />

            <div className="form-grid">
              <Field label="Etapa do processo">
                <Select value={nextStatus} onChange={(event) => setNextStatus(event.target.value)}>
                  <option value="enviada">Enviada</option>
                  <option value="em_analise">Em análise</option>
                  <option value="entrevista">Entrevista</option>
                  <option value="aprovada">Aprovada</option>
                  <option value="recusada">Recusada</option>
                  <option value="encerrada">Encerrada</option>
                </Select>
              </Field>
              {selected.status !== 'enviada' && (
                <div className="status-preview">
                  <small>Status atual</small>
                  <Badge tone={applicationStatus[selected.status].tone}>
                    {applicationStatus[selected.status].label}
                  </Badge>
                </div>
              )}
            </div>

            {nextStatus === 'entrevista' && (
              <div className="interview-form">
                <div className="form-grid form-grid-3">
                  <Field label="Data" required>
                    <Input
                      type="date"
                      value={interview.date}
                      onChange={(event) =>
                        setInterview((current) => ({ ...current, date: event.target.value }))
                      }
                      required
                    />
                  </Field>
                  <Field label="Horário" required>
                    <Input
                      type="time"
                      value={interview.time}
                      onChange={(event) =>
                        setInterview((current) => ({ ...current, time: event.target.value }))
                      }
                      required
                    />
                  </Field>
                  <Field label="Link ou local">
                    <Input
                      value={interview.link}
                      onChange={(event) =>
                        setInterview((current) => ({ ...current, link: event.target.value }))
                      }
                      placeholder="https://meet.google.com/..."
                    />
                  </Field>
                </div>
                <p className="muted small">
                  O estudante receberá uma notificação com os detalhes da entrevista.
                </p>
              </div>
            )}
          </>
        )}
      </Modal>
    </div>
  );
}
