export type Role = 'student' | 'company' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: 'ativo' | 'suspenso' | 'pendente';
  avatarColor: string;
  phone?: string;
  university?: string;
  course?: string;
  period?: string;
  city?: string;
  bio?: string;
  skills?: string[];
  linkedin?: string;
  resumeName?: string;
  companyId?: string;
  companyName?: string | null;
  createdAt: string;
}

export interface Company {
  id: string;
  userId?: string;
  name: string;
  sector: string;
  city: string;
  description: string;
  website: string;
  contactEmail: string;
  phone: string;
  cnpj: string;
  size: string;
  status: 'aprovada' | 'pendente' | 'suspensa';
  verified: boolean;
  logoColor: string;
  createdAt: string;
  opportunitiesCount?: number;
  applicationsCount?: number;
}

export type OpportunityStatus =
  | 'publicada'
  | 'aguardando'
  | 'encerrada'
  | 'rascunho'
  | 'rejeitada';

export interface Opportunity {
  id: string;
  companyId: string;
  title: string;
  area: string;
  type: string;
  modality: string;
  city: string;
  salary: string;
  deadline: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  status: OpportunityStatus;
  createdAt: string;
  updatedAt: string;
  moderationNote?: string;
  company: {
    id: string;
    name: string;
    sector: string;
    city: string;
    verified: boolean;
    logoColor: string;
  } | null;
  applicationsCount: number;
  hasApplied: boolean;
  myApplicationId: string | null;
  myApplicationCreatedAt: string | null;
}

export interface Interview {
  date: string;
  time: string;
  link: string;
  format?: string;
}

export type ApplicationStatus =
  | 'enviada'
  | 'em_analise'
  | 'entrevista'
  | 'aprovada'
  | 'recusada'
  | 'encerrada';

export interface Application {
  id: string;
  opportunityId: string;
  studentId: string;
  companyId: string;
  status: ApplicationStatus;
  message: string;
  interview: Interview | null;
  createdAt: string;
  updatedAt: string;
  student: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    city?: string;
    university?: string;
    course?: string;
    period?: string;
    bio?: string;
    skills: string[];
    linkedin?: string;
    resumeName?: string;
    avatarColor: string;
  } | null;
  opportunity: {
    id: string;
    title: string;
    area: string;
    type: string;
    modality: string;
    city: string;
    companyId: string;
    status: OpportunityStatus;
  } | null;
  company: { id: string; name: string; logoColor: string } | null;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: string;
  link: string;
  read: boolean;
  createdAt: string;
}

export interface AdminStats {
  students: number;
  companies: number;
  activeCompanies: number;
  pendingCompanies: number;
  opportunities: number;
  pendingOpportunities: number;
  applications: number;
  interviews: number;
  approved: number;
  series: { key: string; label: string; count: number }[];
  statusBreakdown: { status: ApplicationStatus; label: string; count: number }[];
  areaBreakdown: { area: string; count: number }[];
}

export interface ModerationQueue {
  companies: Company[];
  opportunities: Opportunity[];
}

export interface AuthResponse {
  token: string;
  user: User;
  company: Company | null;
}
