export type UserRole = "admin" | "gestor" | "assessor" | "operator";

export type Resource = "users" | "departments" | "visitors" | "reports" | "dashboard" | "notifications" | "logs" | "settings";

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
