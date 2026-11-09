import fs from 'node:fs';
import bcrypt from 'bcryptjs';
import { dbFile, writeDb } from './db.js';

const hash = (password) => bcrypt.hashSync(password, 10);

function daysAgo(days, hour = 10) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(hour, 0, 0, 0);
  return date.toISOString();
}

function daysAhead(days, hour = 12) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(hour, 0, 0, 0);
  return date.toISOString();
}

function dateOnly(daysAheadCount) {
  const date = new Date();
  date.setDate(date.getDate() + daysAheadCount);
  return date.toISOString().slice(0, 10);
}

function interviewIn(days) {
  return {
    date: dateOnly(days),
    time: '14:30',
    link: 'https://meet.google.com/conecta-unis-entrevista',
    format: 'Videoconferência'
  };
}

export function createSeed() {
  const users = [
    {
      id: 'usr_admin',
      name: 'Marina Costa',
      email: 'admin@conectaunis.com',
      passwordHash: hash('admin123'),
      role: 'admin',
      status: 'ativo',
      avatarColor: '#0f4c81',
      phone: '(31) 3333-2026',
      createdAt: daysAgo(400)
    },
    {
      id: 'usr_tech',
      name: 'Ricardo Alves',
      email: 'rh@techsolutions.com',
      passwordHash: hash('123456'),
      role: 'company',
      status: 'ativo',
      companyId: 'cmp_tech',
      avatarColor: '#1f63e0',
      createdAt: daysAgo(310)
    },
    {
      id: 'usr_nexa',
      name: 'Juliana Prado',
      email: 'talentos@nexaanalytics.com',
      passwordHash: hash('123456'),
      role: 'company',
      status: 'ativo',
      companyId: 'cmp_nexa',
      avatarColor: '#7c3aed',
      createdAt: daysAgo(240)
    },
    {
      id: 'usr_lumina',
      name: 'Paula Nunes',
      email: 'contato@luminasaude.com',
      passwordHash: hash('123456'),
      role: 'company',
      status: 'ativo',
      companyId: 'cmp_lumina',
      avatarColor: '#0f9f6e',
      createdAt: daysAgo(2)
    },
    {
      id: 'usr_ana',
      name: 'Ana Martins',
      email: 'ana@aluno.com',
      passwordHash: hash('123456'),
      role: 'student',
      status: 'ativo',
      avatarColor: '#1f63e0',
      phone: '(31) 99842-1067',
      university: 'Centro Universitário UNA',
      course: 'Sistemas de Informação',
      period: '6º período',
      city: 'Belo Horizonte, MG',
      bio: 'Estudante de Sistemas de Informação apaixonada por tecnologia, experiência do usuário e produtos que resolvem problemas reais. Busco uma oportunidade para aprofundar meus conhecimentos em desenvolvimento web e trabalhar em times colaborativos.',
      skills: ['JavaScript', 'React', 'HTML e CSS', 'Git', 'Figma', 'SQL', 'Scrum', 'Comunicação'],
      linkedin: 'linkedin.com/in/ana-martins',
      resumeName: 'Curriculo_Ana_Martins.pdf',
      createdAt: daysAgo(180)
    },
    {
      id: 'usr_lucas',
      name: 'Lucas Mendes',
      email: 'lucas@aluno.com',
      passwordHash: hash('123456'),
      role: 'student',
      status: 'ativo',
      avatarColor: '#7c3aed',
      phone: '(31) 98811-2233',
      university: 'PUC Minas',
      course: 'Engenharia de Software',
      period: '8º período',
      city: 'Belo Horizonte, MG',
      bio: 'Desenvolvedor back-end em formação, com interesse em APIs, arquitetura e boas práticas de engenharia.',
      skills: ['Node.js', 'TypeScript', 'PostgreSQL', 'Docker', 'Git'],
      linkedin: 'linkedin.com/in/lucas-mendes',
      resumeName: 'Curriculo_Lucas_Mendes.pdf',
      createdAt: daysAgo(150)
    },
    {
      id: 'usr_mariana',
      name: 'Mariana Lima',
      email: 'mariana@aluno.com',
      passwordHash: hash('123456'),
      role: 'student',
      status: 'ativo',
      avatarColor: '#e07a1f',
      phone: '(31) 97744-9080',
      university: 'CEFET-MG',
      course: 'Design',
      period: '5º período',
      city: 'Belo Horizonte, MG',
      bio: 'Designer com foco em pesquisa, prototipação e experiências digitais acessíveis.',
      skills: ['Figma', 'UX Research', 'Prototipação', 'Design System'],
      linkedin: 'linkedin.com/in/mariana-lima',
      resumeName: 'Curriculo_Mariana_Lima.pdf',
      createdAt: daysAgo(120)
    },
    {
      id: 'usr_pedro',
      name: 'Pedro Henrique',
      email: 'pedro@aluno.com',
      passwordHash: hash('123456'),
      role: 'student',
      status: 'ativo',
      avatarColor: '#0f9f6e',
      phone: '(31) 96655-7711',
      university: 'UFMG',
      course: 'Ciência da Computação',
      period: '7º período',
      city: 'Belo Horizonte, MG',
      bio: 'Interessado em dados, inteligência artificial e produtos digitais.',
      skills: ['Python', 'SQL', 'Power BI', 'Machine Learning'],
      linkedin: 'linkedin.com/in/pedro-henrique',
      resumeName: 'Curriculo_Pedro_Henrique.pdf',
      createdAt: daysAgo(90)
    },
    {
      id: 'usr_camila',
      name: 'Camila Duarte',
      email: 'camila@aluno.com',
      passwordHash: hash('123456'),
      role: 'student',
      status: 'ativa',
      avatarColor: '#d64545',
      phone: '(31) 95544-1020',
      university: 'PUC Minas',
      course: 'Sistemas de Informação',
      period: '4º período',
      city: 'Belo Horizonte, MG',
      bio: 'Estudante com interesse em front-end, acessibilidade e projetos de extensão.',
      skills: ['HTML', 'CSS', 'JavaScript', 'Comunicação'],
      linkedin: 'linkedin.com/in/camila-duarte',
      resumeName: 'Curriculo_Camila_Duarte.pdf',
      createdAt: daysAgo(60)
    }
  ];

  const companies = [
    {
      id: 'cmp_tech',
      userId: 'usr_tech',
      name: 'Tech Solutions',
      sector: 'Tecnologia e software',
      city: 'Belo Horizonte, MG',
      description:
        'Criamos produtos digitais que simplificam a rotina de milhares de pessoas. Nosso time combina tecnologia, design e dados em uma cultura de aprendizado contínuo, autonomia e colaboração.',
      website: 'https://techsolutions.com.br',
      contactEmail: 'talentos@techsolutions.com.br',
      phone: '(31) 3333-2026',
      cnpj: '12.345.678/0001-90',
      size: '51-200 colaboradores',
      status: 'aprovada',
      verified: true,
      logoColor: '#1f63e0',
      createdAt: daysAgo(310)
    },
    {
      id: 'cmp_nexa',
      userId: 'usr_nexa',
      name: 'Nexa Analytics',
      sector: 'Dados e BI',
      city: 'São Paulo, SP',
      description:
        'Consultoria de dados que ajuda empresas a tomar decisões melhores com analytics, engenharia de dados e inteligência artificial.',
      website: 'https://nexaanalytics.com.br',
      contactEmail: 'talentos@nexaanalytics.com',
      phone: '(11) 3555-1200',
      cnpj: '98.765.432/0001-10',
      size: '201-500 colaboradores',
      status: 'aprovada',
      verified: true,
      logoColor: '#7c3aed',
      createdAt: daysAgo(240)
    },
    {
      id: 'cmp_orbit',
      userId: 'usr_orbit',
      name: 'Órbita Sistemas',
      sector: 'Tecnologia',
      city: 'Nova Lima, MG',
      description:
        'Sistemas sob medida para operações complexas, com foco em confiabilidade e escala.',
      website: 'https://orbitasistemas.com.br',
      contactEmail: 'contato@orbitasistemas.com.br',
      phone: '(31) 3222-8800',
      cnpj: '17.553.319/0001-70',
      size: '51-200 colaboradores',
      status: 'aprovada',
      verified: true,
      logoColor: '#0f9f6e',
      createdAt: daysAgo(200)
    },
    {
      id: 'cmp_mobi',
      userId: 'usr_mobi',
      name: 'Mobi Labs',
      sector: 'Produto digital',
      city: 'Belo Horizonte, MG',
      description:
        'Estúdio de produto digital focado em mobilidade urbana e experiências simples para milhões de usuários.',
      website: 'https://mobilabs.com.br',
      contactEmail: 'pessoas@mobilabs.com.br',
      phone: '(31) 3111-4500',
      cnpj: '28.114.905/0001-33',
      size: '11-50 colaboradores',
      status: 'aprovada',
      verified: true,
      logoColor: '#e07a1f',
      createdAt: daysAgo(170)
    },
    {
      id: 'cmp_viva',
      userId: 'usr_viva',
      name: 'Viva Fintech',
      sector: 'Finanças',
      city: 'Belo Horizonte, MG',
      description:
        'Fintech que descomplica a vida financeira de pessoas e pequenos negócios.',
      website: 'https://vivafintech.com.br',
      contactEmail: 'carreiras@vivafintech.com.br',
      phone: '(31) 3999-1010',
      cnpj: '35.224.781/0001-05',
      size: '51-200 colaboradores',
      status: 'aprovada',
      verified: true,
      logoColor: '#d64545',
      createdAt: daysAgo(160)
    },
    {
      id: 'cmp_horizonte',
      userId: 'usr_horizonte',
      name: 'Grupo Horizonte',
      sector: 'Consultoria',
      city: 'Contagem, MG',
      description:
        'Consultoria de gestão e tecnologia que apoia grandes organizações em transformação digital.',
      website: 'https://grupohorizonte.com.br',
      contactEmail: 'talentos@grupohorizonte.com.br',
      phone: '(31) 3444-7700',
      cnpj: '48.112.534/0001-22',
      size: '501-1.000 colaboradores',
      status: 'aprovada',
      verified: true,
      logoColor: '#0f4c81',
      createdAt: daysAgo(140)
    },
    {
      id: 'cmp_lumina',
      userId: 'usr_lumina',
      name: 'Lumina Saúde',
      sector: 'Saúde e tecnologia',
      city: 'Belo Horizonte, MG',
      description:
        'Plataforma de cuidado integrado que conecta clínicas, profissionais e pacientes.',
      website: 'https://luminasaude.com.br',
      contactEmail: 'contato@luminasaude.com.br',
      phone: '(31) 3555-9090',
      cnpj: '12.348.678/0001-90',
      size: '11-50 colaboradores',
      status: 'pendente',
      verified: false,
      logoColor: '#0f9f6e',
      createdAt: daysAgo(1)
    },
    {
      id: 'cmp_norte',
      userId: 'usr_norte',
      name: 'Norte Consultoria',
      sector: 'Negócios',
      city: 'Belo Horizonte, MG',
      description:
        'Consultoria especializada em expansão comercial e novos mercados.',
      website: 'https://norteconsultoria.com.br',
      contactEmail: 'contato@norteconsultoria.com.br',
      phone: '(31) 3777-2020',
      cnpj: '41.553.319/0001-70',
      size: '11-50 colaboradores',
      status: 'pendente',
      verified: false,
      logoColor: '#7c3aed',
      createdAt: daysAgo(3)
    }
  ];

  const opportunities = [
    {
      id: 'opp_dev_estagio',
      companyId: 'cmp_tech',
      title: 'Estágio em Desenvolvimento',
      area: 'Tecnologia',
      type: 'Estágio',
      modality: 'Híbrido',
      city: 'Belo Horizonte, MG',
      salary: 'R$ 1.800,00',
      deadline: dateOnly(14),
      description:
        'Buscamos uma pessoa curiosa e colaborativa para integrar nosso time de Engenharia. Você participará da construção de produtos digitais usados por milhares de clientes, com acompanhamento próximo de pessoas desenvolvedoras experientes e espaço real para aprender.',
      responsibilities: [
        'Apoiar o desenvolvimento e a manutenção de aplicações web em React e Node.js.',
        'Participar de rituais ágeis, refinamentos e revisões de código.',
        'Escrever testes e documentar decisões técnicas do time.',
        'Colaborar com Produto e Design na evolução da experiência.'
      ],
      requirements: [
        'Cursando Sistemas de Informação, Ciência da Computação ou áreas correlatas.',
        'Conhecimento básico de JavaScript, HTML, CSS e Git.',
        'Boa comunicação, organização e vontade de aprender.',
        'Disponibilidade para 30 horas semanais.'
      ],
      benefits: [
        'Vale-refeição',
        'Vale-transporte',
        'Trilha de desenvolvimento',
        'Plano de saúde',
        'Gympass'
      ],
      status: 'publicada',
      createdAt: daysAgo(2),
      updatedAt: daysAgo(2)
    },
    {
      id: 'opp_dados_estagio',
      companyId: 'cmp_nexa',
      title: 'Estágio em Dados e BI',
      area: 'Dados',
      type: 'Estágio',
      modality: 'Remoto',
      city: 'São Paulo, SP',
      salary: 'R$ 1.900,00',
      deadline: dateOnly(20),
      description:
        'Faça parte do time de Analytics e apoie a construção de dashboards, análises e modelos que orientam decisões de negócio.',
      responsibilities: [
        'Construir consultas SQL e apoiar a modelagem de indicadores.',
        'Manter dashboards no Power BI.',
        'Documentar análises e apoiar squads multidisciplinares.'
      ],
      requirements: [
        'Cursando a partir do 4º período em áreas quantitativas.',
        'Conhecimento de SQL e Excel.',
        'Noções de Power BI ou ferramenta similar.',
        'Inglês para leitura técnica.'
      ],
      benefits: ['Auxílio home office', 'Vale-refeição', 'Plano de saúde', 'Horário flexível'],
      status: 'publicada',
      createdAt: daysAgo(1),
      updatedAt: daysAgo(1)
    },
    {
      id: 'opp_trainee',
      companyId: 'cmp_horizonte',
      title: 'Programa de Trainee 2027',
      area: 'Negócios',
      type: 'Trainee',
      modality: 'Presencial',
      city: 'Contagem, MG',
      salary: 'R$ 2.600,00',
      deadline: dateOnly(25),
      description:
        'Programa de aceleração de carreira com rotação por áreas de negócio, mentoria e formação em liderança.',
      responsibilities: [
        'Participar de projetos estratégicos em diferentes áreas.',
        'Analisar indicadores e propor melhorias.',
        'Apresentar resultados para lideranças.'
      ],
      requirements: [
        'Formação prevista entre dezembro de 2026 e dezembro de 2027.',
        'Disponibilidade integral.',
        'Interesse por gestão, tecnologia e inovação.'
      ],
      benefits: ['Plano de carreira', 'Vale-refeição', 'Plano de saúde', 'Mentoria'],
      status: 'publicada',
      createdAt: daysAgo(9),
      updatedAt: daysAgo(9)
    },
    {
      id: 'opp_produto_estagio',
      companyId: 'cmp_mobi',
      title: 'Estágio em Produto Digital',
      area: 'Produto',
      type: 'Estágio',
      modality: 'Híbrido',
      city: 'Belo Horizonte, MG',
      salary: 'R$ 1.600,00',
      deadline: dateOnly(11),
      description:
        'Apoie a descoberta e entrega de produtos digitais, trabalhando lado a lado com design, tecnologia e dados.',
      responsibilities: [
        'Apoiar pesquisas com usuários e análise de métricas.',
        'Documentar requisitos e acompanhar entregas.',
        'Participar de cerimônias ágeis.'
      ],
      requirements: [
        'Cursando a partir do 3º período.',
        'Interesse por produto, tecnologia e comportamento do usuário.',
        'Boa escrita e organização.'
      ],
      benefits: ['Vale-refeição', 'Vale-transporte', 'Auxílio home office', 'Day off no aniversário'],
      status: 'publicada',
      createdAt: daysAgo(1),
      updatedAt: daysAgo(1)
    },
    {
      id: 'opp_dev_junior',
      companyId: 'cmp_orbit',
      title: 'Desenvolvedor(a) Júnior',
      area: 'Tecnologia',
      type: 'Júnior',
      modality: 'Presencial',
      city: 'Nova Lima, MG',
      salary: 'R$ 4.200,00',
      deadline: dateOnly(18),
      description:
        'Atue no desenvolvimento de sistemas corporativos com foco em qualidade, testes e evolução contínua.',
      responsibilities: [
        'Desenvolver funcionalidades em TypeScript e Node.js.',
        'Participar de revisões de código e definição de arquitetura.',
        'Investigar e corrigir incidentes.'
      ],
      requirements: [
        'Formação concluída ou em conclusão em Computação.',
        'Experiência com JavaScript/TypeScript.',
        'Conhecimento de banco de dados relacional.'
      ],
      benefits: ['Plano de saúde', 'Vale-refeição', 'Participação nos resultados', 'Home office 1x/semana'],
      status: 'publicada',
      createdAt: daysAgo(3),
      updatedAt: daysAgo(3)
    },
    {
      id: 'opp_ux_estagio',
      companyId: 'cmp_viva',
      title: 'Estágio em UX Research',
      area: 'Design',
      type: 'Estágio',
      modality: 'Remoto',
      city: 'Belo Horizonte, MG',
      salary: 'R$ 1.500,00',
      deadline: dateOnly(9),
      description:
        'Conduza pesquisas e testes de usabilidade para apoiar a evolução de produtos financeiros digitais.',
      responsibilities: [
        'Planejar e conduzir entrevistas e testes com usuários.',
        'Sintetizar descobertas em relatórios acionáveis.',
        'Apoiar a criação de jornadas e personas.'
      ],
      requirements: [
        'Cursando Design, Psicologia, Sistemas ou áreas afins.',
        'Interesse por pesquisa qualitativa e produtos digitais.',
        'Boa comunicação e escrita.'
      ],
      benefits: ['Auxílio home office', 'Vale-refeição', 'Plano de saúde', 'Horário flexível'],
      status: 'publicada',
      createdAt: daysAgo(5),
      updatedAt: daysAgo(5)
    },
    {
      id: 'opp_dados_tech',
      companyId: 'cmp_tech',
      title: 'Estágio em Dados',
      area: 'Dados',
      type: 'Estágio',
      modality: 'Híbrido',
      city: 'Belo Horizonte, MG',
      salary: 'R$ 1.700,00',
      deadline: dateOnly(16),
      description:
        'Apoie a estruturação de dados e a criação de indicadores para os times de produto e engenharia.',
      responsibilities: [
        'Modelar e documentar conjuntos de dados.',
        'Criar consultas e dashboards.',
        'Apoiar a qualidade e governança dos dados.'
      ],
      requirements: [
        'Cursando áreas de tecnologia ou exatas.',
        'Conhecimento de SQL.',
        'Noções de Python são um diferencial.'
      ],
      benefits: ['Vale-refeição', 'Vale-transporte', 'Plano de saúde', 'Trilha de desenvolvimento'],
      status: 'publicada',
      createdAt: daysAgo(7),
      updatedAt: daysAgo(7)
    },
    {
      id: 'opp_cs_junior',
      companyId: 'cmp_tech',
      title: 'Assistente de Customer Success',
      area: 'Negócios',
      type: 'Júnior',
      modality: 'Híbrido',
      city: 'Belo Horizonte, MG',
      salary: 'R$ 2.200,00',
      deadline: dateOnly(22),
      description:
        'Apoie clientes na adoção da plataforma, acompanhe indicadores e ajude a construir relacionamentos de longo prazo.',
      responsibilities: [
        'Atender clientes e acompanhar solicitações.',
        'Monitorar indicadores de satisfação e retenção.',
        'Produzir materiais de apoio e treinamentos.'
      ],
      requirements: [
        'Formação em Administração, Comunicação ou áreas afins.',
        'Boa comunicação e organização.',
        'Conhecimento de CRM é diferencial.'
      ],
      benefits: ['Vale-refeição', 'Plano de saúde', 'Participação nos resultados'],
      status: 'publicada',
      createdAt: daysAgo(12),
      updatedAt: daysAgo(12)
    },
    {
      id: 'opp_fisio',
      companyId: 'cmp_lumina',
      title: 'Estágio em Fisioterapia',
      area: 'Saúde',
      type: 'Estágio',
      modality: 'Presencial',
      city: 'Belo Horizonte, MG',
      salary: 'R$ 1.200,00',
      deadline: dateOnly(13),
      description:
        'Apoiar atendimentos supervisionados, organizar prontuários e participar de ações de prevenção.',
      responsibilities: [
        'Apoiar atendimentos fisioterapêuticos.',
        'Organizar prontuários e materiais.',
        'Participar de ações de prevenção.'
      ],
      requirements: [
        'Cursando Fisioterapia a partir do 5º período.',
        'Disponibilidade de 20 horas semanais.'
      ],
      benefits: ['Vale-transporte', 'Supervisão de preceptor'],
      status: 'aguardando',
      createdAt: daysAgo(0, 8),
      updatedAt: daysAgo(0, 8)
    },
    {
      id: 'opp_eng_estagio',
      companyId: 'cmp_orbit',
      title: 'Estágio em Engenharia de Software',
      area: 'Tecnologia',
      type: 'Estágio',
      modality: 'Híbrido',
      city: 'Nova Lima, MG',
      salary: 'R$ 1.750,00',
      deadline: dateOnly(21),
      description:
        'Apoie o desenvolvimento de sistemas internos e participe de projetos reais de engenharia.',
      responsibilities: [
        'Desenvolver pequenas funcionalidades.',
        'Escrever testes automatizados.',
        'Documentar soluções.'
      ],
      requirements: [
        'Cursando Engenharia de Software ou áreas correlatas.',
        'Conhecimento de lógica de programação.'
      ],
      benefits: ['Vale-refeição', 'Vale-transporte', 'Plano de saúde'],
      status: 'aguardando',
      createdAt: daysAgo(1),
      updatedAt: daysAgo(1)
    },
    {
      id: 'opp_people_closed',
      companyId: 'cmp_tech',
      title: 'Estágio em People Ops',
      area: 'Negócios',
      type: 'Estágio',
      modality: 'Híbrido',
      city: 'Belo Horizonte, MG',
      salary: 'R$ 1.600,00',
      deadline: dateOnly(-4),
      description: 'Apoio aos processos de pessoas e cultura.',
      responsibilities: ['Apoiar rotinas de recrutamento e onboarding.'],
      requirements: ['Cursando Psicologia, Administração ou áreas afins.'],
      benefits: ['Vale-refeição', 'Vale-transporte'],
      status: 'encerrada',
      createdAt: daysAgo(40),
      updatedAt: daysAgo(3)
    },
    {
      id: 'opp_backend_draft',
      companyId: 'cmp_tech',
      title: 'Desenvolvedor(a) Back-end',
      area: 'Tecnologia',
      type: 'Júnior',
      modality: 'Remoto',
      city: 'Belo Horizonte, MG',
      salary: 'A definir',
      deadline: dateOnly(30),
      description: 'Rascunho de oportunidade para o time de engenharia.',
      responsibilities: ['Desenvolver APIs.'],
      requirements: ['Experiência com Node.js.'],
      benefits: ['Plano de saúde'],
      status: 'rascunho',
      createdAt: daysAgo(4),
      updatedAt: daysAgo(4)
    }
  ];

  const applications = [
    {
      id: 'app_ana_dev',
      opportunityId: 'opp_dev_estagio',
      studentId: 'usr_ana',
      companyId: 'cmp_tech',
      status: 'entrevista',
      message:
        'Olá! Tenho interesse em construir produtos digitais com foco em acessibilidade e experiência do usuário.',
      interview: interviewIn(3),
      createdAt: daysAgo(12),
      updatedAt: daysAgo(2)
    },
    {
      id: 'app_ana_dados',
      opportunityId: 'opp_dados_estagio',
      studentId: 'usr_ana',
      companyId: 'cmp_nexa',
      status: 'em_analise',
      message: 'Gostaria de aplicar meus conhecimentos de SQL e análise de dados nesse desafio.',
      interview: null,
      createdAt: daysAgo(7),
      updatedAt: daysAgo(4)
    },
    {
      id: 'app_ana_produto',
      opportunityId: 'opp_produto_estagio',
      studentId: 'usr_ana',
      companyId: 'cmp_mobi',
      status: 'enviada',
      message: 'Tenho interesse em produtos digitais e já participei de projetos de extensão.',
      interview: null,
      createdAt: daysAgo(3),
      updatedAt: daysAgo(3)
    },
    {
      id: 'app_ana_junior',
      opportunityId: 'opp_dev_junior',
      studentId: 'usr_ana',
      companyId: 'cmp_orbit',
      status: 'aprovada',
      message: 'Tenho experiência com React e JavaScript em projetos acadêmicos.',
      interview: null,
      createdAt: daysAgo(20),
      updatedAt: daysAgo(5)
    },
    {
      id: 'app_ana_ux',
      opportunityId: 'opp_ux_estagio',
      studentId: 'usr_ana',
      companyId: 'cmp_viva',
      status: 'recusada',
      message: 'Tenho interesse em pesquisa com usuários e experiência do usuário.',
      interview: null,
      createdAt: daysAgo(26),
      updatedAt: daysAgo(15)
    },
    {
      id: 'app_ana_trainee',
      opportunityId: 'opp_trainee',
      studentId: 'usr_ana',
      companyId: 'cmp_horizonte',
      status: 'encerrada',
      message: 'Gostaria de participar do programa de trainee.',
      interview: null,
      createdAt: daysAgo(45),
      updatedAt: daysAgo(30)
    },
    {
      id: 'app_lucas_dev',
      opportunityId: 'opp_dev_estagio',
      studentId: 'usr_lucas',
      companyId: 'cmp_tech',
      status: 'em_analise',
      message: 'Tenho foco em back-end e quero evoluir como desenvolvedor full-stack.',
      interview: null,
      createdAt: daysAgo(6),
      updatedAt: daysAgo(3)
    },
    {
      id: 'app_lucas_junior',
      opportunityId: 'opp_dev_junior',
      studentId: 'usr_lucas',
      companyId: 'cmp_orbit',
      status: 'entrevista',
      message: 'Experiência com Node.js e TypeScript em projetos pessoais.',
      interview: interviewIn(5),
      createdAt: daysAgo(9),
      updatedAt: daysAgo(1)
    },
    {
      id: 'app_lucas_dados_tech',
      opportunityId: 'opp_dados_tech',
      studentId: 'usr_lucas',
      companyId: 'cmp_tech',
      status: 'enviada',
      message: 'Quero ampliar minha experiência com dados.',
      interview: null,
      createdAt: daysAgo(2),
      updatedAt: daysAgo(2)
    },
    {
      id: 'app_mariana_dev',
      opportunityId: 'opp_dev_estagio',
      studentId: 'usr_mariana',
      companyId: 'cmp_tech',
      status: 'enviada',
      message: 'Sou designer e gostaria de trabalhar próxima ao time de engenharia.',
      interview: null,
      createdAt: daysAgo(5),
      updatedAt: daysAgo(5)
    },
    {
      id: 'app_mariana_produto',
      opportunityId: 'opp_produto_estagio',
      studentId: 'usr_mariana',
      companyId: 'cmp_mobi',
      status: 'em_analise',
      message: 'Tenho experiência com Figma e pesquisa com usuários.',
      interview: null,
      createdAt: daysAgo(4),
      updatedAt: daysAgo(2)
    },
    {
      id: 'app_mariana_ux',
      opportunityId: 'opp_ux_estagio',
      studentId: 'usr_mariana',
      companyId: 'cmp_viva',
      status: 'entrevista',
      message: 'Pesquisa e acessibilidade são os temas que mais me interessam.',
      interview: interviewIn(4),
      createdAt: daysAgo(8),
      updatedAt: daysAgo(1)
    },
    {
      id: 'app_pedro_dev',
      opportunityId: 'opp_dev_estagio',
      studentId: 'usr_pedro',
      companyId: 'cmp_tech',
      status: 'em_analise',
      message: 'Tenho experiência com Python e quero aprender mais sobre web.',
      interview: null,
      createdAt: daysAgo(4),
      updatedAt: daysAgo(2)
    },
    {
      id: 'app_pedro_dados',
      opportunityId: 'opp_dados_estagio',
      studentId: 'usr_pedro',
      companyId: 'cmp_nexa',
      status: 'enviada',
      message: 'Tenho interesse em dados e já desenvolvi projetos de machine learning.',
      interview: null,
      createdAt: daysAgo(1),
      updatedAt: daysAgo(1)
    },
    {
      id: 'app_pedro_junior',
      opportunityId: 'opp_dev_junior',
      studentId: 'usr_pedro',
      companyId: 'cmp_orbit',
      status: 'aprovada',
      message: 'Gostaria de contribuir com minha base em computação.',
      interview: null,
      createdAt: daysAgo(18),
      updatedAt: daysAgo(6)
    },
    {
      id: 'app_camila_dev',
      opportunityId: 'opp_dev_estagio',
      studentId: 'usr_camila',
      companyId: 'cmp_tech',
      status: 'enviada',
      message: 'Estou começando minha jornada em front-end e tenho muita vontade de aprender.',
      interview: null,
      createdAt: daysAgo(3),
      updatedAt: daysAgo(3)
    },
    {
      id: 'app_camila_dados_tech',
      opportunityId: 'opp_dados_tech',
      studentId: 'usr_camila',
      companyId: 'cmp_tech',
      status: 'em_analise',
      message: 'Tenho interesse em dados e sou organizada com processos.',
      interview: null,
      createdAt: daysAgo(2),
      updatedAt: daysAgo(1)
    }
  ];

  const notifications = [
    {
      id: 'ntf_1',
      userId: 'usr_ana',
      title: 'Convite para entrevista',
      body: 'A Tech Solutions convidou você para uma entrevista no dia ' + new Date(interviewIn(3).date + 'T12:00:00').toLocaleDateString('pt-BR') + ', às 14:30.',
      type: 'entrevista',
      link: '/app/candidaturas/app_ana_dev',
      read: false,
      createdAt: daysAgo(0, 9)
    },
    {
      id: 'ntf_2',
      userId: 'usr_ana',
      title: 'Empresa atualizou seu processo',
      body: 'Sua candidatura para Estágio em Desenvolvimento avançou para a etapa de entrevista.',
      type: 'processo',
      link: '/app/candidaturas/app_ana_dev',
      read: false,
      createdAt: daysAgo(1, 15)
    },
    {
      id: 'ntf_3',
      userId: 'usr_ana',
      title: 'Nova oportunidade recomendada',
      body: 'Encontramos uma vaga de Estágio em Produto Digital que combina com seu perfil.',
      type: 'oportunidade',
      link: '/app/oportunidades/opp_produto_estagio',
      read: false,
      createdAt: daysAgo(2, 11)
    },
    {
      id: 'ntf_4',
      userId: 'usr_ana',
      title: 'Candidatura recebida',
      body: 'A Nexa Analytics recebeu sua candidatura para Estágio em Dados e BI.',
      type: 'processo',
      link: '/app/candidaturas/app_ana_dados',
      read: true,
      createdAt: daysAgo(4, 10)
    },
    {
      id: 'ntf_5',
      userId: 'usr_ana',
      title: 'Complete seu perfil',
      body: 'Adicionar uma experiência pode aumentar a visibilidade do seu perfil para empresas.',
      type: 'perfil',
      link: '/app/perfil',
      read: true,
      createdAt: daysAgo(6, 8)
    },
    {
      id: 'ntf_6',
      userId: 'usr_ana',
      title: 'Prazo de inscrição termina em breve',
      body: 'A oportunidade Programa de Trainee 2027 encerra inscrições em 3 dias.',
      type: 'oportunidade',
      link: '/app/oportunidades/opp_trainee',
      read: true,
      createdAt: daysAgo(8, 16)
    }
  ];

  return {
    users,
    companies,
    opportunities,
    applications,
    notifications,
    resets: []
  };
}

export function seedIfNeeded(force = false) {
  if (!fs.existsSync(dbFile) || force) {
    writeDb(createSeed());
    return true;
  }
  return false;
}

const invokedDirectly = process.argv[1] && process.argv[1].replace(/\\/g, '/').endsWith('/seed.js');
if (invokedDirectly) {
  const created = seedIfNeeded(process.argv.includes('--force'));
  console.log(created ? 'Banco de demonstração criado.' : 'Banco já existe. Use --force para recriar.');
}
