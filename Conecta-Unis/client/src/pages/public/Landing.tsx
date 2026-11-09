import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BadgeCheck,
  BellRing,
  BriefcaseBusiness,
  Building2,
  CalendarCheck,
  CheckCircle2,
  Compass,
  FileText,
  GraduationCap,
  Handshake,
  MonitorPlay,
  Search,
  ShieldCheck,
  Sparkles,
  UserPlus,
  Users
} from 'lucide-react';
import { Logo } from '../../components/Logo';
import { Badge } from '../../components/ui';

const previewJobs = [
  {
    company: 'TS',
    color: '#1f63e0',
    title: 'Estágio em Desenvolvimento',
    place: 'Tech Solutions • Belo Horizonte',
    tags: ['Estágio', 'Híbrido'],
    salary: 'R$ 1.800/mês'
  },
  {
    company: 'NA',
    color: '#7c3aed',
    title: 'Estágio em Dados e BI',
    place: 'Nexa Analytics • São Paulo',
    tags: ['Estágio', 'Remoto'],
    salary: 'R$ 1.900/mês'
  },
  {
    company: 'GH',
    color: '#0f4c81',
    title: 'Programa de Trainee 2027',
    place: 'Grupo Horizonte • Contagem',
    tags: ['Trainee', 'Presencial'],
    salary: 'R$ 2.600/mês'
  }
];

export function Landing() {
  return (
    <div className="landing">
      <header className="site-header">
        <div className="container site-header-inner">
          <Link to="/" aria-label="Conecta Unis">
            <Logo />
          </Link>
          <nav className="site-nav" aria-label="Navegação principal">
            <a href="#estudantes">Para estudantes</a>
            <a href="#empresas">Para empresas</a>
            <a href="#como-funciona">Como funciona</a>
            <a href="#oportunidades">Oportunidades</a>
          </nav>
          <div className="site-actions">
            <Link to="/demonstracao" className="btn btn-ghost btn-sm demo-entry-link">
              <MonitorPlay size={16} />
              <span>Modo demonstração</span>
            </Link>
            <Link to="/login" className="btn btn-ghost btn-sm">
              Entrar
            </Link>
            <Link to="/cadastro" className="btn btn-primary btn-sm">
              Criar conta
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="container hero-grid">
            <div className="hero-copy">
              <span className="hero-badge">
                <Sparkles size={15} /> Plataforma de conexões
              </span>
              <h1>
                Conectando <span>talentos</span>, universidades e empresas.
              </h1>
              <p>
                Descubra estágios, programas de talento e oportunidades que transformam o início
                da carreira em uma jornada com propósito.
              </p>
              <div className="hero-actions">
                <Link to="/cadastro?tipo=estudante" className="btn btn-primary btn-lg">
                  <GraduationCap size={19} />
                  Sou estudante
                </Link>
                <Link to="/cadastro?tipo=empresa" className="btn btn-secondary btn-lg">
                  <Building2 size={19} />
                  Sou empresa
                </Link>
                <Link to="/demonstracao" className="btn btn-soft btn-lg demo-hero-link">
                  <MonitorPlay size={19} />
                  Modo demonstração
                </Link>
              </div>
              <div className="hero-proof">
                <div className="hero-avatars" aria-hidden="true">
                  <span style={{ background: '#1f63e0' }}>AM</span>
                  <span style={{ background: '#7c3aed' }}>LM</span>
                  <span style={{ background: '#0f9f6e' }}>PH</span>
                  <span style={{ background: '#e07a1f' }}>+</span>
                </div>
                <div>
                  <strong>+12 mil estudantes</strong>
                  <span>já encontraram novas conexões</span>
                </div>
              </div>
            </div>

            <div className="hero-visual" aria-label="Prévia da plataforma">
              <div className="glow glow-one" />
              <div className="glow glow-two" />
              <div className="mock-window">
                <div className="mock-bar">
                  <span className="mock-dots">
                    <i />
                    <i />
                    <i />
                  </span>
                  <span className="mock-address">conectaunis.com.br</span>
                </div>
                <div className="mock-body">
                  <div className="mock-profile">
                    <span className="company-logo" style={{ background: '#1f63e0' }}>
                      AM
                    </span>
                    <div>
                      <small>Portal do estudante</small>
                      <strong>Olá, Ana!</strong>
                    </div>
                    <Badge tone="success" dot>
                      Perfil verificado
                    </Badge>
                  </div>
                  <div className="mock-stats">
                    <div>
                      <strong>8</strong>
                      <span>Candidaturas</span>
                    </div>
                    <div>
                      <strong>2</strong>
                      <span>Entrevistas</span>
                    </div>
                    <div>
                      <strong>24</strong>
                      <span>Recomendadas</span>
                    </div>
                  </div>
                  <div className="mock-progress">
                    <div>
                      <span>Seu perfil está quase completo</span>
                      <strong>92%</strong>
                    </div>
                    <span className="mock-progress-track">
                      <i style={{ width: '92%' }} />
                    </span>
                  </div>
                  <div className="mock-job">
                    <span className="company-logo company-logo-sm" style={{ background: '#0f4c81' }}>
                      TS
                    </span>
                    <div>
                      <strong>Estágio em Desenvolvimento</strong>
                      <small>Tech Solutions • Belo Horizonte</small>
                    </div>
                    <ArrowRight size={17} />
                  </div>
                  <div className="mock-job">
                    <span className="company-logo company-logo-sm" style={{ background: '#7c3aed' }}>
                      NA
                    </span>
                    <div>
                      <strong>Estágio em Dados e BI</strong>
                      <small>Nexa Analytics • Remoto</small>
                    </div>
                    <ArrowRight size={17} />
                  </div>
                </div>
              </div>

              <div className="float-card float-card-one">
                <span className="float-icon">
                  <CalendarCheck size={18} />
                </span>
                <div>
                  <strong>Entrevista confirmada</strong>
                  <span>07 out, 14:30 • Google Meet</span>
                </div>
              </div>
              <div className="float-card float-card-two">
                <span className="float-icon float-icon-green">
                  <BadgeCheck size={18} />
                </span>
                <div>
                  <strong>Candidatura aprovada</strong>
                  <span>Órbita Sistemas</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="stats-strip">
          <div className="container stats-strip-grid">
            <div>
              <strong>12.480</strong>
              <span>estudantes conectados</span>
            </div>
            <div>
              <strong>842</strong>
              <span>empresas parceiras</span>
            </div>
            <div>
              <strong>1.286</strong>
              <span>oportunidades ativas</span>
            </div>
            <div>
              <strong>38.920</strong>
              <span>candidaturas realizadas</span>
            </div>
          </div>
        </section>

        <section className="section" id="como-funciona">
          <div className="container">
            <div className="section-head centered">
              <span className="eyebrow">Como funciona</span>
              <h2>Um caminho mais simples até a próxima oportunidade.</h2>
              <p>
                Da descoberta à contratação, a Conecta Unis aproxima quem quer aprender de quem
                quer crescer.
              </p>
            </div>
            <div className="steps-grid">
              <article className="step-card">
                <span className="step-number">01</span>
                <span className="step-icon">
                  <UserPlus size={22} />
                </span>
                <h3>Crie seu perfil</h3>
                <p>
                  Estudantes mostram suas habilidades e empresas apresentam sua cultura em poucos
                  minutos.
                </p>
              </article>
              <article className="step-card">
                <span className="step-number">02</span>
                <span className="step-icon">
                  <Search size={22} />
                </span>
                <h3>Encontre conexões</h3>
                <p>
                  Recomendações inteligentes conectam perfis a oportunidades que realmente combinam.
                </p>
              </article>
              <article className="step-card">
                <span className="step-number">03</span>
                <span className="step-icon">
                  <Handshake size={22} />
                </span>
                <h3>Comece a jornada</h3>
                <p>
                  Candidate-se, acompanhe cada etapa e prepare o próximo passo da sua carreira.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="section section-soft" id="estudantes">
          <div className="container split-feature">
            <div className="feature-copy">
              <span className="eyebrow">Para estudantes</span>
              <h2>Seu potencial merece ser encontrado.</h2>
              <p>
                Encontre oportunidades alinhadas ao seu curso, momento e objetivos. Acompanhe
                candidaturas e entrevistas em um só lugar.
              </p>
              <ul className="check-list">
                <li>
                  <CheckCircle2 size={19} /> Oportunidades com o seu perfil
                </li>
                <li>
                  <CheckCircle2 size={19} /> Perfil profissional que se destaca
                </li>
                <li>
                  <CheckCircle2 size={19} /> Acompanhamento de cada etapa
                </li>
                <li>
                  <CheckCircle2 size={19} /> Notificações de entrevistas e prazos
                </li>
              </ul>
              <Link to="/cadastro?tipo=estudante" className="btn btn-primary">
                Criar meu perfil <ArrowRight size={17} />
              </Link>
            </div>
            <div className="feature-visual">
              <div className="student-preview">
                <div className="student-preview-head">
                  <span className="company-logo" style={{ background: '#1f63e0' }}>
                    AM
                  </span>
                  <div>
                    <strong>Ana Martins</strong>
                    <span>Sistemas de Informação • 6º período</span>
                  </div>
                  <Badge tone="success" dot>
                    Verificado
                  </Badge>
                </div>
                <div className="skill-row">
                  {['React', 'JavaScript', 'Figma', 'SQL'].map((skill) => (
                    <span key={skill}>{skill}</span>
                  ))}
                </div>
                <div className="preview-timeline">
                  <div className="preview-step done">
                    <span>
                      <CheckCircle2 size={16} />
                    </span>
                    <div>
                      <strong>Candidatura enviada</strong>
                      <small>Tech Solutions • 01 out</small>
                    </div>
                  </div>
                  <div className="preview-step current">
                    <span>
                      <CalendarCheck size={16} />
                    </span>
                    <div>
                      <strong>Entrevista confirmada</strong>
                      <small>07 out, 14:30 • Google Meet</small>
                    </div>
                  </div>
                  <div className="preview-step future">
                    <span>
                      <Compass size={16} />
                    </span>
                    <div>
                      <strong>Próxima etapa</strong>
                      <small>Desafio técnico</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="empresas">
          <div className="container split-feature split-reverse">
            <div className="feature-copy">
              <span className="eyebrow">Para empresas</span>
              <h2>Contrate potencial, não apenas experiência.</h2>
              <p>
                Publique oportunidades, encontre estudantes preparados e acompanhe todo o processo
                seletivo com uma experiência simples e organizada.
              </p>
              <ul className="check-list">
                <li>
                  <CheckCircle2 size={19} /> Publique e gerencie oportunidades
                </li>
                <li>
                  <CheckCircle2 size={19} /> Acesse candidatos qualificados
                </li>
                <li>
                  <CheckCircle2 size={19} /> Agende entrevistas e acompanhe etapas
                </li>
                <li>
                  <CheckCircle2 size={19} /> Fortaleça sua marca empregadora
                </li>
              </ul>
              <Link to="/cadastro?tipo=empresa" className="btn btn-secondary">
                Cadastrar minha empresa <ArrowRight size={17} />
              </Link>
            </div>
            <div className="feature-visual">
              <div className="company-preview">
                <div className="company-preview-head">
                  <span>
                    <Building2 size={18} /> Tech Solutions
                  </span>
                  <Badge tone="success" dot>
                    Conta verificada
                  </Badge>
                </div>
                <div className="company-preview-stats">
                  <div>
                    <strong>08</strong>
                    <span>oportunidades abertas</span>
                  </div>
                  <div>
                    <strong>126</strong>
                    <span>candidatos</span>
                  </div>
                  <div>
                    <strong>14</strong>
                    <span>entrevistas</span>
                  </div>
                </div>
                <div className="candidate-row">
                  <span className="company-logo company-logo-sm" style={{ background: '#7c3aed' }}>
                    LM
                  </span>
                  <div>
                    <strong>Lucas Mendes</strong>
                    <small>Engenharia de Software • PUC Minas</small>
                  </div>
                  <Badge tone="warning">Em análise</Badge>
                </div>
                <div className="candidate-row">
                  <span className="company-logo company-logo-sm" style={{ background: '#0f9f6e' }}>
                    PH
                  </span>
                  <div>
                    <strong>Pedro Henrique</strong>
                    <small>Ciência da Computação • UFMG</small>
                  </div>
                  <Badge tone="success">Aprovado</Badge>
                </div>
                <div className="candidate-row">
                  <span className="company-logo company-logo-sm" style={{ background: '#e07a1f' }}>
                    ML
                  </span>
                  <div>
                    <strong>Mariana Lima</strong>
                    <small>Design • CEFET-MG</small>
                  </div>
                  <Badge tone="info">Entrevista</Badge>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section section-soft" id="oportunidades">
          <div className="container">
            <div className="section-head">
              <div>
                <span className="eyebrow">Oportunidades em destaque</span>
                <h2>O próximo passo pode estar aqui.</h2>
              </div>
              <Link to="/login" className="text-link">
                Ver todas as oportunidades <ArrowRight size={16} />
              </Link>
            </div>
            <div className="preview-job-grid">
              {previewJobs.map((job) => (
                <article className="preview-job" key={job.title}>
                  <div className="preview-job-head">
                    <span className="company-logo" style={{ background: job.color }}>
                      {job.company}
                    </span>
                    <div>
                      <h3>{job.title}</h3>
                      <p>{job.place}</p>
                    </div>
                  </div>
                  <div className="opp-tags">
                    {job.tags.map((tag) => (
                      <Badge key={tag} tone="info">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="preview-job-foot">
                    <strong>{job.salary}</strong>
                    <Link to="/login" className="text-link">
                      Entrar para ver <ArrowRight size={15} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="trust-grid">
              <div>
                <span className="trust-icon">
                  <ShieldCheck size={22} />
                </span>
                <h3>Conexões seguras</h3>
                <p>Empresas verificadas e moderação ativa para proteger a comunidade.</p>
              </div>
              <div>
                <span className="trust-icon">
                  <BellRing size={22} />
                </span>
                <h3>Nada passa batido</h3>
                <p>Notificações de entrevistas, prazos e atualizações do seu processo.</p>
              </div>
              <div>
                <span className="trust-icon">
                  <FileText size={22} />
                </span>
                <h3>Tudo em um só lugar</h3>
                <p>Perfil, candidaturas e histórico organizados para você focar no que importa.</p>
              </div>
              <div>
                <span className="trust-icon">
                  <Users size={22} />
                </span>
                <h3>Feito com universidades</h3>
                <p>Uma ponte entre o ambiente acadêmico e o mercado de trabalho.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section cta-section">
          <div className="container">
            <div className="cta-banner">
              <div>
                <span className="eyebrow eyebrow-light">Pronto para criar sua próxima conexão?</span>
                <h2>Transforme potencial em impacto.</h2>
                <p>
                  Crie sua conta gratuitamente e comece a construir o próximo passo da sua jornada.
                </p>
              </div>
              <div className="cta-actions">
                <Link to="/cadastro?tipo=estudante" className="btn btn-white btn-lg">
                  <GraduationCap size={19} /> Sou estudante
                </Link>
                <Link to="/cadastro?tipo=empresa" className="btn btn-outline-light btn-lg">
                  <Building2 size={19} /> Sou empresa
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-grid">
          <div>
            <Logo />
            <p>
              Conectando talentos, universidades e empresas para transformar o início da carreira
              em uma jornada com propósito.
            </p>
          </div>
          <div>
            <h4>Plataforma</h4>
            <Link to="/login">Entrar</Link>
            <Link to="/cadastro">Criar conta</Link>
            <Link to="/demonstracao">Modo demonstração</Link>
            <a href="#como-funciona">Como funciona</a>
          </div>
          <div>
            <h4>Para você</h4>
            <a href="#estudantes">Estudantes</a>
            <a href="#empresas">Empresas</a>
            <a href="#oportunidades">Oportunidades</a>
          </div>
          <div>
            <h4>Institucional</h4>
            <a href="mailto:contato@conectaunis.com">Contato</a>
            <a href="mailto:privacidade@conectaunis.com">Privacidade</a>
            <a href="mailto:ajuda@conectaunis.com">Ajuda</a>
          </div>
        </div>
        <div className="container footer-bottom">
          <span>© 2026 Conecta Unis. Todos os direitos reservados.</span>
          <span>Feito para conectar futuros.</span>
        </div>
      </footer>
    </div>
  );
}
