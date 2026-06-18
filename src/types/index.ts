export type UserRole = "admin" | "gestor" | "assessor" | "operator";

export type Resource = "users" | "departments" | "visitors" | "reports" | "dashboard" | "notifications" | "logs" | "settings" | "performance";

export type ColaboradorStatus = "ativo" | "afastado" | "desligado";

export interface Colaborador {
  id: string;
  nome: string;
  email: string;
  cpf: string;
  matricula: string;
  cargo: string;
  departamentoId: string | null;
  funcao: string;
  cargaHoraria: number;
  ano: number | null;
  mes: number | null;
  vinculo: string;
  dataAdmissao: string;
  dataDesligamento: string | null;
  gestorId: string | null;
  userId: string | null;
  status: ColaboradorStatus;
  foto: string | null;
  createdAt: string;
  updatedAt: string;
  departamentoNome?: string;
  gestorNome?: string;
  notaMedia?: number;
  statusAvaliacao?: "nunca_avaliado" | "pendente" | "em_dia";
  metasAtivas?: number;
  pdisAtivos?: number;
  totalAvaliacoes?: number;
  metasConcluidas?: number;
  pdisConcluidos?: number;
  ultimaAvaliacao?: {
    id: string;
    cicloNome: string;
    avaliadorNome: string;
    notaFinal: number;
    conceitoFinal: string;
    status: string;
    createdAt: string;
  } | null;
}

export type CicloStatus = "aberto" | "fechado";

export interface CicloAvaliacao {
  id: string;
  nome: string;
  dataInicio: string;
  dataFim: string;
  status: CicloStatus;
  createdAt: string;
}

export type TipoAvaliacao = "autoavaliacao" | "gestor" | "colega" | "liderado";

export interface Avaliacao {
  id: string;
  colaboradorId: string;
  cicloId: string;
  avaliadorId: string;
  tipo: TipoAvaliacao;
  notaFinal: number;
  conceitoFinal: string;
  status: "pending" | "completed";
  createdAt: string;
  colaboradorNome?: string;
  avaliadorNome?: string;
  cicloNome?: string;
  comentarios?: string;
}

export interface Competencia {
  id: string;
  nome: string;
  descricao: string;
}

export interface AvaliacaoCompetencia {
  id: string;
  avaliacaoId: string;
  competenciaId: string;
  nota: number;
  competenciaNome?: string;
}

export type MetaStatus = "pending" | "in_progress" | "completed";

export interface Meta {
  id: string;
  colaboradorId: string;
  cicloId: string | null;
  nome: string;
  descricao: string;
  metaEsperada: string;
  resultadoObtido: string;
  percentualConclusao: number;
  prazo: string;
  status: MetaStatus;
  responsavelId: string;
  createdAt: string;
  responsavelNome?: string;
}

export type PDIStatus = "pending" | "in_progress" | "completed";

export interface PDI {
  id: string;
  colaboradorId: string;
  cicloId: string | null;
  objetivo: string;
  acoesPrevistas: string;
  prazo: string;
  responsavelId: string;
  status: PDIStatus;
  evidencias: string;
  observacoes: string;
  createdAt: string;
  responsavelNome?: string;
}

export type TipoFeedback = "autoavaliacao" | "gestor" | "colega" | "liderado";

export interface Feedback {
  id: string;
  colaboradorId: string;
  autorId: string;
  tipo: TipoFeedback;
  comentario: string;
  status: string;
  createdAt: string;
  autorNome?: string;
}

export type HistoricoTipo = "admissao" | "cargo" | "lotacao" | "avaliacao" | "feedback" | "meta" | "pdi" | "promocao" | "desligamento";

export interface HistoricoColaborador {
  id: string;
  colaboradorId: string;
  tipo: HistoricoTipo;
  descricao: string;
  dataReferencia: string;
  createdAt: string;
}

export interface DashboardPerformanceRH {
  totalColaboradores: number;
  avaliacoesRealizadas: number;
  avaliacoesPendentes: number;
  mediaGeral: number;
  melhoresCompetencias: { nome: string; media: number }[];
  pioresCompetencias: { nome: string; media: number }[];
  ciclosAbertos: number;
}

export interface CicloProgress {
  totalColaboradores: number;
  avaliacoesRealizadas: number;
  avaliacoesPendentes: number;
  percentualConcluido: number;
  mediaGeral: number | null;
  pendentes: { id: string; nome: string }[];
}

export interface DashboardPerformanceColaborador {
  colaboradorNome: string;
  ultimaAvaliacao: { notaFinal: number; conceitoFinal: string; cicloNome: string; createdAt: string } | null;
  metasEmAndamento: number;
  pdiEmAndamento: number;
  feedbacksRecebidos: number;
  melhoresCompetencias: { nome: string; media: number }[];
  pioresCompetencias: { nome: string; media: number }[];
}

export interface DashboardPerformanceGestor {
  totalEquipe: number;
  equipeAvaliada: number;
  avaliacoesPendentes: number;
  pdisPendentes: number;
  metasAtrasadas: number;
  destaques: { id: string; nome: string; notaMedia: number }[];
  baixoDesempenho: { id: string; nome: string; notaMedia: number }[];
}

export type Action = "create" | "read" | "update" | "delete";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  departmentId: string;
  avatar?: string;
  active: boolean;
  phone?: string;
  createdAt: string;
}

export interface Department {
  id: string;
  name: string;
  description?: string;
  parentId: string | null;
  responsibleId: string;
  createdAt: string;
  children?: Department[];
}

export type VisitorStatus =
  | "registered"
  | "scheduled"
  | "checking_in"
  | "in_progress"
  | "completed"
  | "cancelled";

export interface Visitor {
  id: string;
  name: string;
  email: string;
  isDisposable?: number;
  phone: string;
  document: string;
  company?: string;
  photo?: string;
  departmentId?: string;
  responsibleId?: string;
  status?: VisitorStatus;
  purpose?: string;
  scheduledAt?: string;
  checkinAt?: string;
  checkoutAt?: string;
  createdAt: string;
}

export interface TimelineEvent {
  id: string;
  visitorId: string;
  type: "checkin" | "checkout" | "created" | "cancelled" | "rescheduled";
  description: string;
  timestamp: string;
  author: string;
}

export interface DashboardMetrics {
  totalUsers: number;
  activeUsers: number;
  totalDepartments: number;
  totalVisitorsToday: number;
  visitorsInProgress: number;
  visitorsCompleted: number;
}

export interface ReportVisitors {
  total: number;
  byStatus: { status: string; count: number }[];
  byDepartment: { departmentId: number | null; departmentName: string | null; count: number }[];
  byDate: { date: string; count: number }[];
}

export interface ReportDepartment {
  id: number;
  name: string;
  description: string | null;
  visitorCount: number;
  activeVisits: number;
  todayVisits: number;
}

export interface ReportDepartments {
  total: number;
  departments: ReportDepartment[];
}

export interface ReportUsers {
  total: number;
  active: number;
  byRole: { role: string; count: number }[];
  byStatus: { status: string; count: number }[];
}

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  link: string | null;
  read: number;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId: number | null;
  userName: string;
  userRole: string;
  action: string;
  resource: string;
  resourceId: string | null;
  details: string;
  ip: string;
  createdAt: string;
  uName?: string;
  uRole?: string;
}

export interface SettingEntry {
  value: string;
  description: string;
  updatedAt: string;
}

export type SettingsMap = Record<string, SettingEntry>;

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ImportColaborador {
  ano: string;
  mes: string;
  matricula: string;
  cpf: string;
  nome: string;
  cargo: string;
  lotacao: string;
  funcao: string;
  cargaHoraria: string;
  vinculo: string;
  dataAdmissao: string;
  dataDesligamento: string;
}

export interface ImportResult {
  imported: number;
  skipped: number;
  departamentosCriados: number;
  errors: { row: number; matricula: string; reason: string }[];
}
