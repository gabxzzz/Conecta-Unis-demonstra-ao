import { useEffect, useState, type FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  BriefcaseBusiness,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Send,
  Users,
  XCircle
} from 'lucide-react';
import { useAuth } from '../../auth';
import { useApi } from '../../hooks';
import { api } from '../../api';
import {
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
  StatusBadge,
  Textarea
} from '../../components/ui';
import { useToast } from '../../toast';
import { formatShortDate } from '../../utils';
import type { Opportunity } from '../../types';

const blankForm = () => ({
  title: '',
  area: 'Tecnologia',
  type: 'Estágio',
  modality: 'Híbrido',
  city: 'Belo Horizonte, MG',
  salary: '',
  deadline: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
  description: '',
  responsibilities: '',
  requirements: '',
  benefits: ''
});

type FormState = ReturnType<typeof blankForm>;

export function CompanyOpportunities() {
  const { company } = useAuth();
  const { data, loading, error, reload } = useApi<Opportunity[]>('/opportunities/company/mine');
  const toast = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('Todas');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Opportunity | null>(null);
  const [form, setForm] = useState<FormState>(blankForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const openCreate = () => {
    setEditing(null);
    setForm(blankForm());
    setFormError('');
    setOpen(true);
  };

  useEffect(() => {
    if (searchParams.get('novo')) {
      openCreate();
      const next = new URLSearchParams(searchParams);
      next.delete('novo');
      setSearchParams(next, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const edit = (opportunity: Opportunity) => {
    setEditing(opportunity);
    setForm({
      title: opportunity.title,
      area: opportunity.area,
      type: opportunity.type,
      modality: opportunity.modality,
      city: opportunity.city,
      salary: opportunity.salary,
      deadline: opportunity.deadline,
      description: opportunity.description,
      responsibilities: opportunity.responsibilities.join('\n'),
      requirements: opportunity.requirements.join('\n'),
      benefits: opportunity.benefits.join('\n')
    });
    setFormError('');
    setOpen(true);
  };

  const update = (key: keyof FormState, value: string) =>
    setForm((current) => ({ ...current, [key]: value }));

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setFormError('');
    if (!form.title || !form.area || !form.description || !form.deadline) {
      setFormError('Preencha título, área, descrição e prazo de inscrição.');
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        await api.put(`/opportunities/${editing.id}`, form);
        toast('Oportunidade atualizada com sucesso.');
      } else {
        await api.post('/opportunities', form);
        toast(
          company?.status === 'aprovada'
            ? 'Oportunidade publicada com sucesso.'
            : 'Oportunidade criada e enviada para análise.'
        );
      }
      setOpen(false);
      await reload();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Não foi possível salvar a oportunidade.');
    } finally {
      setSaving(false);
    }
  };

  const changeStatus = async (opportunity: Opportunity, nextStatus: string) => {
    try {
      await api.patch(`/opportunities/${opportunity.id}/status`, { status: nextStatus });
      toast(
        nextStatus === 'encerrada'
          ? 'Oportunidade encerrada.'
          : nextStatus === 'aguardando'
            ? 'Oportunidade reenviada para análise.'
            : 'Oportunidade publicada.'
      );
      await reload();
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Não foi possível alterar o status.', 'error');
    }
  };

  const opportunities = (data || []).filter((opportunity) => {
    const matchesStatus = status === 'Todas' || opportunity.status === status;
    const term = query.toLowerCase();
    const matchesQuery =
      !term ||
      [opportunity.title, opportunity.city, opportunity.area]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(term));
    return matchesStatus && matchesQuery;
  });

  return (
    <div className="page">
      <PageHeader
        eyebrow="Área da empresa"
        title="Gerenciar oportunidades"
        subtitle={`${(data || []).filter((item) => item.status === 'publicada').length} ativas, ${
          (data || []).filter((item) => item.status === 'rascunho').length
        } em rascunho e ${(data || []).filter((item) => item.status === 'encerrada').length} encerradas.`}
        actions={
          <Button onClick={openCreate}>
            <Plus size={17} /> Nova oportunidade
          </Button>
        }
      />

      {company?.status === 'pendente' && (
        <div className="alert alert-warning">
          <span>
            Sua empresa está em análise. Novas oportunidades ficarão aguardando aprovação antes de
            serem publicadas.
          </span>
        </div>
      )}

      <section className="filter-panel filter-panel-inline">
        <div className="search-input">
          <Search size={18} />
          <input
            type="search"
            placeholder="Buscar oportunidade"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <div className="filter-field filter-field-inline">
          <span>Status</span>
          <Select value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="Todas">Todos os status</option>
            <option value="publicada">Publicada</option>
            <option value="aguardando">Aguardando</option>
            <option value="rascunho">Rascunho</option>
            <option value="encerrada">Encerrada</option>
            <option value="rejeitada">Rejeitada</option>
          </Select>
        </div>
      </section>

      {error && <ErrorBanner message={error} />}

      <section className="card">
        {loading ? (
          <Skeleton lines={7} />
        ) : opportunities.length ? (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Oportunidade</th>
                  <th>Status</th>
                  <th>Candidaturas</th>
                  <th>Prazo</th>
                  <th aria-label="Ações" />
                </tr>
              </thead>
              <tbody>
                {opportunities.map((opportunity) => (
                  <tr key={opportunity.id}>
                    <td>
                      <div className="table-title">
                        <strong>{opportunity.title}</strong>
                        <span>
                          {opportunity.area} • {opportunity.type} • {opportunity.city}
                        </span>
                        {opportunity.status === 'rejeitada' && opportunity.moderationNote && (
                          <span className="table-note">
                            Ajuste solicitado: {opportunity.moderationNote}
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <StatusBadge kind="opportunity" status={opportunity.status} />
                    </td>
                    <td>
                      <span className="table-candidates">
                        <Users size={15} /> {opportunity.applicationsCount}
                      </span>
                    </td>
                    <td>{formatShortDate(opportunity.deadline)}</td>
                    <td>
                      <div className="table-actions">
                        <Button variant="ghost" size="sm" onClick={() => edit(opportunity)}>
                          <Pencil size={15} /> Editar
                        </Button>
                        {['publicada', 'rascunho'].includes(opportunity.status) && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => changeStatus(opportunity, 'encerrada')}
                          >
                            <XCircle size={15} /> Encerrar
                          </Button>
                        )}
                        {opportunity.status === 'encerrada' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => changeStatus(opportunity, 'publicada')}
                          >
                            <RotateCcw size={15} /> Reabrir
                          </Button>
                        )}
                        {opportunity.status === 'rejeitada' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => changeStatus(opportunity, 'aguardando')}
                          >
                            <Send size={15} /> Reenviar
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (data || []).length ? (
          <EmptyState
            icon={<Search size={26} />}
            title="Nenhuma oportunidade encontrada"
            description="Tente ajustar os filtros de busca."
          />
        ) : (
          <EmptyState
            icon={<BriefcaseBusiness size={28} />}
            title="Publique sua primeira oportunidade"
            description="Descreva a vaga, os requisitos e os benefícios para atrair os candidatos certos."
            action={
              <Button onClick={openCreate}>
                <Plus size={16} /> Criar oportunidade
              </Button>
            }
          />
        )}
      </section>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? 'Editar oportunidade' : 'Nova oportunidade'}
        subtitle="Campos completos ajudam os estudantes a entender se a vaga combina com eles."
        size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={submit} loading={saving}>
              {editing ? 'Salvar alterações' : 'Publicar oportunidade'}
            </Button>
          </>
        }
      >
        <form className="auth-form" onSubmit={submit}>
          {formError && <ErrorBanner message={formError} />}

          <Field label="Título da oportunidade" required>
            <Input
              value={form.title}
              onChange={(event) => update('title', event.target.value)}
              placeholder="Ex.: Estágio em Desenvolvimento"
              required
            />
          </Field>

          <div className="form-grid form-grid-3">
            <Field label="Área" required>
              <Select value={form.area} onChange={(event) => update('area', event.target.value)}>
                {['Tecnologia', 'Dados', 'Design', 'Produto', 'Negócios', 'Saúde', 'Outro'].map(
                  (area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  )
                )}
              </Select>
            </Field>
            <Field label="Tipo">
              <Select value={form.type} onChange={(event) => update('type', event.target.value)}>
                {['Estágio', 'Trainee', 'Júnior', 'CLT'].map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Modalidade">
              <Select
                value={form.modality}
                onChange={(event) => update('modality', event.target.value)}
              >
                {['Presencial', 'Híbrido', 'Remoto'].map((modality) => (
                  <option key={modality} value={modality}>
                    {modality}
                  </option>
                ))}
              </Select>
            </Field>
          </div>

          <div className="form-grid form-grid-3">
            <Field label="Cidade">
              <Input
                value={form.city}
                onChange={(event) => update('city', event.target.value)}
                placeholder="Cidade - UF"
              />
            </Field>
            <Field label="Bolsa / salário">
              <Input
                value={form.salary}
                onChange={(event) => update('salary', event.target.value)}
                placeholder="R$ 1.800,00"
              />
            </Field>
            <Field label="Prazo de inscrição" required>
              <Input
                type="date"
                value={form.deadline}
                onChange={(event) => update('deadline', event.target.value)}
                required
              />
            </Field>
          </div>

          <Field label="Descrição" required>
            <Textarea
              rows={4}
              value={form.description}
              onChange={(event) => update('description', event.target.value)}
              placeholder="Descreva o contexto da vaga, o time e o que a pessoa fará."
              required
            />
          </Field>

          <div className="form-grid">
            <Field label="Responsabilidades" hint="Uma por linha.">
              <Textarea
                rows={4}
                value={form.responsibilities}
                onChange={(event) => update('responsibilities', event.target.value)}
                placeholder="Apoiar o desenvolvimento de aplicações web."
              />
            </Field>
            <Field label="Requisitos" hint="Um por linha.">
              <Textarea
                rows={4}
                value={form.requirements}
                onChange={(event) => update('requirements', event.target.value)}
                placeholder="Cursando a partir do 3º período."
              />
            </Field>
          </div>

          <Field label="Benefícios" hint="Um por linha.">
            <Textarea
              rows={3}
              value={form.benefits}
              onChange={(event) => update('benefits', event.target.value)}
              placeholder="Vale-refeição"
            />
          </Field>

          <button type="submit" hidden />
        </form>
        {editing && (
          <div className="modal-note">
            <Badge tone="info">Última atualização {formatShortDate(editing.updatedAt)}</Badge>
          </div>
        )}
      </Modal>
    </div>
  );
}
