import { useEffect, useState, type FormEvent } from 'react';
import {
  BadgeCheck,
  FileText,
  GraduationCap,
  Link2,
  Mail,
  MapPin,
  Phone,
  Save,
  UserRound
} from 'lucide-react';
import { useAuth } from '../../auth';
import { api } from '../../api';
import {
  Avatar,
  Badge,
  Button,
  ErrorBanner,
  Field,
  Input,
  PageHeader,
  Progress,
  Select,
  Textarea
} from '../../components/ui';
import { useToast } from '../../toast';
import { formatDate, studentCompletion } from '../../utils';
import type { User } from '../../types';

export function StudentProfile() {
  const { user, setUser } = useAuth();
  const toast = useToast();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    university: user?.university || '',
    course: user?.course || '',
    period: user?.period || '',
    city: user?.city || '',
    bio: user?.bio || '',
    linkedin: user?.linkedin || '',
    resumeName: user?.resumeName || '',
    skills: (user?.skills || []).join(', ')
  });

  useEffect(() => {
    if (!user) return;
    setForm({
      name: user.name || '',
      phone: user.phone || '',
      university: user.university || '',
      course: user.course || '',
      period: user.period || '',
      city: user.city || '',
      bio: user.bio || '',
      linkedin: user.linkedin || '',
      resumeName: user.resumeName || '',
      skills: (user.skills || []).join(', ')
    });
  }, [user]);

  const update = (key: keyof typeof form, value: string) =>
    setForm((current) => ({ ...current, [key]: value }));

  const completion = studentCompletion(user);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      const response = await api.put<{ user: User }>('/profile', {
        ...form,
        skills: form.skills
          .split(',')
          .map((skill) => skill.trim())
          .filter(Boolean)
      });
      setUser(response.user);
      toast('Perfil atualizado com sucesso.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível salvar seu perfil.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page">
      <PageHeader
        eyebrow="Portal do estudante"
        title="Meu perfil"
        subtitle="Mantenha suas informações atualizadas para receber recomendações melhores."
      />

      <div className="profile-layout">
        <aside className="profile-summary card">
          <Avatar name={user?.name} color={user?.avatarColor} size="xl" />
          <h2>{user?.name}</h2>
          <p className="muted">
            {user?.course || 'Curso não informado'}
            {user?.period ? ` • ${user.period}` : ''}
          </p>
          <Badge tone="success" dot>
            <BadgeCheck size={13} /> Perfil verificado
          </Badge>

          <div className="profile-facts">
            <span>
              <GraduationCap size={16} /> {user?.university || 'Universidade não informada'}
            </span>
            <span>
              <MapPin size={16} /> {user?.city || 'Cidade não informada'}
            </span>
            <span>
              <Mail size={16} /> {user?.email}
            </span>
            <span>
              <Phone size={16} /> {user?.phone || 'Telefone não informado'}
            </span>
            <span>
              <Link2 size={16} /> {user?.linkedin || 'LinkedIn não informado'}
            </span>
          </div>

          <div className="profile-skills">
            <span className="eyebrow">Habilidades</span>
            <div className="skill-row">
              {(user?.skills || []).length ? (
                user?.skills?.map((skill) => <span key={skill}>{skill}</span>)
              ) : (
                <span className="muted">Adicione suas habilidades no formulário.</span>
              )}
            </div>
          </div>

          <div className="divider" />
          <Progress value={completion.percent} />
          <p className="muted small">
            {completion.percent === 100
              ? 'Perfil completo! Você está pronto para novas conexões.'
              : `Falta: ${completion.missing.join(', ')}.`}
          </p>
          <p className="muted small">Conta criada em {formatDate(user?.createdAt)}</p>
        </aside>

        <form className="profile-form card" onSubmit={submit}>
          <div className="card-head">
            <div>
              <span className="eyebrow">Informações pessoais</span>
              <h2>Editar perfil</h2>
            </div>
            <Button type="submit" loading={saving}>
              <Save size={16} /> Salvar alterações
            </Button>
          </div>

          {error && <ErrorBanner message={error} />}

          <div className="form-grid">
            <Field label="Nome completo" required>
              <Input
                value={form.name}
                onChange={(event) => update('name', event.target.value)}
                required
              />
            </Field>
            <Field label="E-mail" hint="O e-mail de acesso não pode ser alterado.">
              <Input value={user?.email || ''} disabled />
            </Field>
          </div>

          <Field label="Sobre você" hint="Conte brevemente seus interesses, objetivos e o que busca.">
            <Textarea
              rows={4}
              maxLength={500}
              value={form.bio}
              onChange={(event) => update('bio', event.target.value)}
              placeholder="Estudante interessado em..."
            />
          </Field>

          <div className="form-section-title">
            <GraduationCap size={17} /> Informações acadêmicas
          </div>

          <div className="form-grid">
            <Field label="Universidade">
              <Input
                value={form.university}
                onChange={(event) => update('university', event.target.value)}
                placeholder="Ex.: PUC Minas"
              />
            </Field>
            <Field label="Curso">
              <Input
                value={form.course}
                onChange={(event) => update('course', event.target.value)}
                placeholder="Ex.: Sistemas de Informação"
              />
            </Field>
          </div>

          <div className="form-grid">
            <Field label="Período">
              <Select
                value={form.period}
                onChange={(event) => update('period', event.target.value)}
              >
                <option value="">Selecione</option>
                {Array.from({ length: 10 }, (_, index) => `${index + 1}º período`).map((period) => (
                  <option key={period} value={period}>
                    {period}
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

          <div className="form-section-title">
            <UserRound size={17} /> Contato e links
          </div>

          <div className="form-grid">
            <Field label="Telefone">
              <Input
                value={form.phone}
                onChange={(event) => update('phone', event.target.value)}
                placeholder="(31) 99999-0000"
              />
            </Field>
            <Field label="LinkedIn">
              <Input
                value={form.linkedin}
                onChange={(event) => update('linkedin', event.target.value)}
                placeholder="linkedin.com/in/seu-perfil"
              />
            </Field>
          </div>

          <Field
            label="Habilidades"
            hint="Separe as habilidades com vírgulas. Ex.: React, SQL, Comunicação."
          >
            <Input
              value={form.skills}
              onChange={(event) => update('skills', event.target.value)}
              placeholder="React, JavaScript, Figma"
            />
          </Field>

          <Field label="Currículo" hint="Na demonstração, informe o nome do arquivo do seu currículo.">
            <div className="input-icon">
              <FileText size={17} />
              <Input
                value={form.resumeName}
                onChange={(event) => update('resumeName', event.target.value)}
                placeholder="Curriculo_Seu_Nome.pdf"
              />
            </div>
          </Field>

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
