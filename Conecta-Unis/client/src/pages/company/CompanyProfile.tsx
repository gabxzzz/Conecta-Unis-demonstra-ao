import { useEffect, useState, type FormEvent } from 'react';
import {
  BadgeCheck,
  Building2,
  Globe,
  Mail,
  MapPin,
  Phone,
  Save,
  Users
} from 'lucide-react';
import { useAuth } from '../../auth';
import { api } from '../../api';
import {
  Badge,
  Button,
  ErrorBanner,
  Field,
  Input,
  PageHeader,
  Progress,
  Select,
  StatusBadge,
  Textarea
} from '../../components/ui';
import { useToast } from '../../toast';
import { companyCompletion, formatDate } from '../../utils';
import type { Company } from '../../types';

export function CompanyProfile() {
  const { company, setCompany } = useAuth();
  const toast = useToast();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: company?.name || '',
    sector: company?.sector || '',
    city: company?.city || '',
    cnpj: company?.cnpj || '',
    phone: company?.phone || '',
    website: company?.website || '',
    contactEmail: company?.contactEmail || '',
    size: company?.size || '11-50 colaboradores',
    description: company?.description || ''
  });

  useEffect(() => {
    if (!company) return;
    setForm({
      name: company.name || '',
      sector: company.sector || '',
      city: company.city || '',
      cnpj: company.cnpj || '',
      phone: company.phone || '',
      website: company.website || '',
      contactEmail: company.contactEmail || '',
      size: company.size || '11-50 colaboradores',
      description: company.description || ''
    });
  }, [company]);

  const update = (key: keyof typeof form, value: string) =>
    setForm((current) => ({ ...current, [key]: value }));

  const completion = companyCompletion(company);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      const response = await api.put<{ company: Company }>('/company/profile', form);
      setCompany(response.company);
      toast('Perfil da empresa atualizado com sucesso.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível salvar o perfil.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page">
      <PageHeader
        eyebrow="Área da empresa"
        title="Perfil da empresa"
        subtitle="Mantenha os dados atualizados para transmitir confiança aos candidatos."
        actions={
          <Button type="submit" form="company-profile-form" loading={saving}>
            <Save size={16} /> Salvar alterações
          </Button>
        }
      />

      {company?.status === 'pendente' && (
        <div className="alert alert-warning">
          <BadgeCheck size={18} />
          <span>
            Seu perfil está em análise. Assim que for aprovado, suas oportunidades poderão ser
            publicadas imediatamente.
          </span>
        </div>
      )}

      <div className="profile-layout">
        <aside className="profile-summary card">
          <span
            className="company-logo company-logo-xl"
            style={{ background: company?.logoColor || '#1f63e0' }}
          >
            {company?.name?.slice(0, 2).toUpperCase() || 'CU'}
          </span>
          <h2>{company?.name}</h2>
          <p className="muted">{company?.sector}</p>
          <StatusBadge kind="company" status={company?.status || 'pendente'} />

          <div className="profile-facts">
            <span>
              <MapPin size={16} /> {company?.city || 'Cidade não informada'}
            </span>
            <span>
              <Globe size={16} /> {company?.website || 'Site não informado'}
            </span>
            <span>
              <Mail size={16} /> {company?.contactEmail}
            </span>
            <span>
              <Phone size={16} /> {company?.phone || 'Telefone não informado'}
            </span>
            <span>
              <Users size={16} /> {company?.size || 'Tamanho não informado'}
            </span>
          </div>

          <div className="company-about-box">
            <span className="eyebrow">Sobre a empresa</span>
            <p>{company?.description || 'Adicione uma descrição para se apresentar aos candidatos.'}</p>
          </div>

          <div className="divider" />
          <Progress value={completion.percent} label="Qualidade do perfil" />
          <p className="muted small">
            {completion.percent === 100
              ? 'Perfil completo! Sua empresa transmite mais confiança.'
              : `Falta: ${completion.missing.join(', ')}.`}
          </p>
          <p className="muted small">No Conecta Unis desde {formatDate(company?.createdAt)}</p>
        </aside>

        <form id="company-profile-form" className="profile-form card" onSubmit={submit}>
          <div className="card-head">
            <div>
              <span className="eyebrow">Identidade da empresa</span>
              <h2>Informações cadastrais</h2>
            </div>
            <Badge tone={company?.verified ? 'success' : 'warning'} dot>
              {company?.verified ? 'Conta verificada' : 'Verificação pendente'}
            </Badge>
          </div>

          {error && <ErrorBanner message={error} />}

          <div className="form-grid">
            <Field label="Nome da empresa" required>
              <div className="input-icon">
                <Building2 size={17} />
                <Input
                  value={form.name}
                  onChange={(event) => update('name', event.target.value)}
                  required
                />
              </div>
            </Field>
            <Field label="CNPJ">
              <Input
                value={form.cnpj}
                onChange={(event) => update('cnpj', event.target.value)}
                placeholder="00.000.000/0001-00"
              />
            </Field>
          </div>

          <div className="form-grid">
            <Field label="Área de atuação">
              <Select value={form.sector} onChange={(event) => update('sector', event.target.value)}>
                <option value="">Selecione</option>
                {[
                  'Tecnologia e software',
                  'Dados e BI',
                  'Saúde e tecnologia',
                  'Finanças',
                  'Consultoria',
                  'Negócios',
                  'Educação',
                  'Indústria',
                  'Outro'
                ].map((sector) => (
                  <option key={sector} value={sector}>
                    {sector}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Cidade">
              <Input
                value={form.city}
                onChange={(event) => update('city', event.target.value)}
                placeholder="Cidade - UF"
              />
            </Field>
          </div>

          <Field
            label="Descrição"
            hint="Conte o que sua empresa faz, sua cultura e propósito. Até 800 caracteres."
          >
            <Textarea
              rows={5}
              maxLength={800}
              value={form.description}
              onChange={(event) => update('description', event.target.value)}
              placeholder="Nossa empresa..."
            />
          </Field>

          <div className="form-section-title">
            <Globe size={17} /> Presença e contato
          </div>

          <div className="form-grid">
            <Field label="Site">
              <Input
                value={form.website}
                onChange={(event) => update('website', event.target.value)}
                placeholder="https://suaempresa.com.br"
              />
            </Field>
            <Field label="E-mail de contato">
              <Input
                type="email"
                value={form.contactEmail}
                onChange={(event) => update('contactEmail', event.target.value)}
                placeholder="talentos@suaempresa.com.br"
              />
            </Field>
          </div>

          <div className="form-grid">
            <Field label="Telefone">
              <Input
                value={form.phone}
                onChange={(event) => update('phone', event.target.value)}
                placeholder="(31) 3333-2026"
              />
            </Field>
            <Field label="Tamanho do time">
              <Select value={form.size} onChange={(event) => update('size', event.target.value)}>
                {[
                  '1-10 colaboradores',
                  '11-50 colaboradores',
                  '51-200 colaboradores',
                  '201-500 colaboradores',
                  '501-1.000 colaboradores',
                  '1.000+ colaboradores'
                ].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </Select>
            </Field>
          </div>

          <div className="form-actions">
            <Button type="submit" loading={saving}>
              <Save size={16} /> Salvar alterações
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
