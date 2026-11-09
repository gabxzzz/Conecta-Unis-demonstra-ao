import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowRight, Building2, GraduationCap } from 'lucide-react';
import { AuthLayout } from '../../layouts/AuthLayout';
import {
  Button,
  ErrorBanner,
  Field,
  InfoBanner,
  Input,
  Select,
  Tabs,
  Textarea
} from '../../components/ui';
import { homeForRole, useAuth } from '../../auth';
import { useToast } from '../../toast';

const initialForm = {
  name: '',
  email: '',
  password: '',
  confirm: '',
  phone: '',
  university: '',
  course: '',
  period: '',
  city: '',
  companyName: '',
  cnpj: '',
  sector: '',
  description: ''
};

export function Register() {
  const [searchParams] = useSearchParams();
  const [role, setRole] = useState(searchParams.get('tipo') === 'empresa' ? 'company' : 'student');
  const [form, setForm] = useState(initialForm);
  const [terms, setTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const update = (key: keyof typeof initialForm, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    if (form.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    if (form.password !== form.confirm) {
      setError('As senhas não conferem.');
      return;
    }
    if (!terms) {
      setError('Para continuar, aceite os Termos de uso e a Política de privacidade.');
      return;
    }

    setLoading(true);
    try {
      const response = await register({
        role,
        name: role === 'company' ? form.companyName : form.name,
        companyName: form.companyName,
        email: form.email,
        password: form.password,
        phone: form.phone,
        university: form.university,
        course: form.course,
        period: form.period,
        city: form.city,
        cnpj: form.cnpj,
        sector: form.sector,
        description: form.description
      });
      toast(
        role === 'company'
          ? 'Conta criada! Seu perfil de empresa será analisado pela equipe.'
          : 'Conta criada com sucesso. Boas-vindas à Conecta Unis!'
      );
      navigate(homeForRole(response.user.role), { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível criar sua conta.');
    } finally {
      setLoading(false);
    }
  };

  const tab = role === 'company' ? 'company' : 'student';

  return (
    <AuthLayout
      wide
      title={tab === 'student' ? 'Seu futuro começa com uma conexão.' : 'Encontre os talentos do futuro.'}
      description={
        tab === 'student'
          ? 'Crie seu perfil gratuitamente e encontre oportunidades que combinam com o seu momento.'
          : 'Crie o perfil da sua empresa e comece a construir conexões relevantes com novos talentos.'
      }
      points={
        tab === 'student'
          ? [
              'Oportunidades com o seu perfil',
              'Acompanhe cada etapa do processo',
              'Perfil profissional que se destaca'
            ]
          : [
              'Publique oportunidades em poucos minutos',
              'Acesse candidatos qualificados',
              'Acompanhe todo o processo seletivo'
            ]
      }
    >
      <div className="auth-heading">
        <span className="eyebrow">Criar conta gratuita</span>
        <h1>Crie sua conta</h1>
        <p>Escolha o perfil que melhor representa você.</p>
      </div>

      <Tabs
        value={tab}
        onChange={(value) => {
          setRole(value);
          setError('');
        }}
        items={[
          { value: 'student', label: 'Sou estudante' },
          { value: 'company', label: 'Sou empresa' }
        ]}
      />

      {error && <ErrorBanner message={error} />}
      {role === 'company' && (
        <InfoBanner tone="info">
          <Building2 size={18} />
          <span>
            Cadastros de empresas passam por uma análise rápida antes da publicação das
            oportunidades.
          </span>
        </InfoBanner>
      )}

      <form className="auth-form" onSubmit={submit}>
        {role === 'student' ? (
          <>
            <div className="form-grid">
              <Field label="Nome completo" htmlFor="name" required>
                <Input
                  id="name"
                  placeholder="Como podemos chamar você?"
                  value={form.name}
                  onChange={(event) => update('name', event.target.value)}
                  required
                />
              </Field>
              <Field label="Telefone" htmlFor="phone">
                <Input
                  id="phone"
                  placeholder="(31) 99999-0000"
                  value={form.phone}
                  onChange={(event) => update('phone', event.target.value)}
                />
              </Field>
            </div>

            <Field label="E-mail" htmlFor="register-email" required>
              <Input
                id="register-email"
                type="email"
                placeholder="voce@exemplo.com"
                value={form.email}
                onChange={(event) => update('email', event.target.value)}
                required
              />
            </Field>

            <div className="form-grid">
              <Field label="Senha" htmlFor="register-password" hint="Mínimo de 6 caracteres" required>
                <Input
                  id="register-password"
                  type="password"
                  placeholder="Crie uma senha"
                  value={form.password}
                  onChange={(event) => update('password', event.target.value)}
                  required
                />
              </Field>
              <Field label="Confirmar senha" htmlFor="register-confirm" required>
                <Input
                  id="register-confirm"
                  type="password"
                  placeholder="Repita a senha"
                  value={form.confirm}
                  onChange={(event) => update('confirm', event.target.value)}
                  required
                />
              </Field>
            </div>

            <div className="form-grid">
              <Field label="Universidade" htmlFor="university">
                <Input
                  id="university"
                  placeholder="Ex.: PUC Minas"
                  value={form.university}
                  onChange={(event) => update('university', event.target.value)}
                />
              </Field>
              <Field label="Curso" htmlFor="course">
                <Input
                  id="course"
                  placeholder="Ex.: Sistemas de Informação"
                  value={form.course}
                  onChange={(event) => update('course', event.target.value)}
                />
              </Field>
            </div>

            <div className="form-grid">
              <Field label="Período" htmlFor="period">
                <Select
                  id="period"
                  value={form.period}
                  onChange={(event) => update('period', event.target.value)}
                >
                  <option value="">Selecione</option>
                  {['1º período', '2º período', '3º período', '4º período', '5º período', '6º período', '7º período', '8º período', '9º período', '10º período'].map(
                    (period) => (
                      <option key={period} value={period}>
                        {period}
                      </option>
                    )
                  )}
                </Select>
              </Field>
              <Field label="Cidade" htmlFor="city">
                <Input
                  id="city"
                  placeholder="Cidade - UF"
                  value={form.city}
                  onChange={(event) => update('city', event.target.value)}
                />
              </Field>
            </div>
          </>
        ) : (
          <>
            <Field label="Nome da empresa" htmlFor="company-name" required>
              <Input
                id="company-name"
                placeholder="Razão social ou nome fantasia"
                value={form.companyName}
                onChange={(event) => update('companyName', event.target.value)}
                required
              />
            </Field>

            <div className="form-grid">
              <Field label="E-mail corporativo" htmlFor="company-email" required>
                <Input
                  id="company-email"
                  type="email"
                  placeholder="voce@empresa.com.br"
                  value={form.email}
                  onChange={(event) => update('email', event.target.value)}
                  required
                />
              </Field>
              <Field label="CNPJ" htmlFor="cnpj">
                <Input
                  id="cnpj"
                  placeholder="00.000.000/0001-00"
                  value={form.cnpj}
                  onChange={(event) => update('cnpj', event.target.value)}
                />
              </Field>
            </div>

            <div className="form-grid">
              <Field label="Senha" htmlFor="company-password" hint="Mínimo de 6 caracteres" required>
                <Input
                  id="company-password"
                  type="password"
                  placeholder="Crie uma senha"
                  value={form.password}
                  onChange={(event) => update('password', event.target.value)}
                  required
                />
              </Field>
              <Field label="Confirmar senha" htmlFor="company-confirm" required>
                <Input
                  id="company-confirm"
                  type="password"
                  placeholder="Repita a senha"
                  value={form.confirm}
                  onChange={(event) => update('confirm', event.target.value)}
                  required
                />
              </Field>
            </div>

            <div className="form-grid">
              <Field label="Área de atuação" htmlFor="sector">
                <Select
                  id="sector"
                  value={form.sector}
                  onChange={(event) => update('sector', event.target.value)}
                >
                  <option value="">Selecione o setor</option>
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
              <Field label="Cidade" htmlFor="company-city">
                <Input
                  id="company-city"
                  placeholder="Cidade - UF"
                  value={form.city}
                  onChange={(event) => update('city', event.target.value)}
                />
              </Field>
            </div>

            <Field label="Telefone" htmlFor="company-phone">
              <Input
                id="company-phone"
                placeholder="(11) 3333-4444"
                value={form.phone}
                onChange={(event) => update('phone', event.target.value)}
              />
            </Field>

            <Field
              label="Descrição da empresa"
              htmlFor="company-description"
              hint="Conte o que sua empresa faz, sua cultura e propósito."
            >
              <Textarea
                id="company-description"
                rows={4}
                placeholder="Até 800 caracteres"
                maxLength={800}
                value={form.description}
                onChange={(event) => update('description', event.target.value)}
              />
            </Field>
          </>
        )}

        <label className="checkbox checkbox-terms">
          <input
            type="checkbox"
            checked={terms}
            onChange={(event) => setTerms(event.target.checked)}
          />
          <span>
            Confirmo que represento este perfil e aceito os <a href="#termos">Termos de uso</a> e a{' '}
            <a href="#privacidade">Política de privacidade</a>.
          </span>
        </label>

        <Button type="submit" size="lg" loading={loading} className="btn-block">
          {role === 'company' ? 'Criar conta da empresa' : 'Criar minha conta'}
          <ArrowRight size={18} />
        </Button>
      </form>

      <p className="auth-switch">
        Já possui uma conta? <Link to="/login">Entrar</Link>
      </p>
    </AuthLayout>
  );
}
