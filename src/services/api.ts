import type { User, Department, Visitor, TimelineEvent, DashboardMetrics, ReportVisitors, ReportDepartments, ReportUsers, Notification, AuditLog, SettingsMap, Colaborador, CicloAvaliacao, Avaliacao, Competencia, Meta, PDI, Feedback, HistoricoColaborador, DashboardPerformanceRH, DashboardPerformanceGestor, CicloProgress, DashboardPerformanceColaborador, ImportColaborador, ImportResult, PaginatedResponse } from "@/types";

const BASE = "/api";

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem("auth_token");
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${BASE}${url}`, {
    ...options,
    headers: { ...headers, ...(options?.headers as Record<string, string> | undefined) },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export async function getUsers(): Promise<User[]> {
  return request("/users");
}

export async function getUserById(id: string): Promise<User> {
  return request(`/users/${id}`);
}

export async function createUser(data: Omit<User, "id" | "createdAt"> & { password?: string }): Promise<User> {
  return request("/users", { method: "POST", body: JSON.stringify(data) });
}

export async function updateUser(id: string, data: Partial<User>): Promise<void> {
  await request(`/users/${id}`, { method: "PUT", body: JSON.stringify(data) });
}

export async function deleteUser(id: string): Promise<void> {
  await request(`/users/${id}`, { method: "DELETE" });
}

export async function getDepartments(): Promise<Department[]> {
  return request("/departments");
}

export async function getDepartmentById(id: string): Promise<Department> {
  return request(`/departments/${id}`);
}

export async function createDepartment(data: Omit<Department, "id" | "createdAt">): Promise<Department> {
  return request("/departments", { method: "POST", body: JSON.stringify(data) });
}

export async function updateDepartment(id: string, data: Partial<Department>): Promise<void> {
  await request(`/departments/${id}`, { method: "PUT", body: JSON.stringify(data) });
}

export async function deleteDepartment(id: string): Promise<void> {
  await request(`/departments/${id}`, { method: "DELETE" });
}

export async function getVisitors(status?: string): Promise<Visitor[]> {
  const qs = status && status !== "all" ? `?status=${status}` : "";
  return request(`/visitors${qs}`);
}

export async function getVisitorById(id: string): Promise<Visitor> {
  return request(`/visitors/${id}`);
}

export async function createVisitor(data: Omit<Visitor, "id" | "createdAt">): Promise<Visitor> {
  return request("/visitors", { method: "POST", body: JSON.stringify(data) });
}

export async function updateVisitor(id: string, data: Partial<Visitor>): Promise<void> {
  await request(`/visitors/${id}`, { method: "PUT", body: JSON.stringify(data) });
}

export async function deleteVisitor(id: string): Promise<void> {
  await request(`/visitors/${id}`, { method: "DELETE" });
}

export async function checkDisposableEmail(email: string): Promise<{ email: string; disposable: boolean }> {
  return request(`/visitors/check-email?email=${encodeURIComponent(email)}`);
}

export async function getTimeline(visitorId: string): Promise<TimelineEvent[]> {
  return request(`/timeline/${visitorId}`);
}

export async function createTimelineEvent(data: Omit<TimelineEvent, "id">): Promise<{ id: number }> {
  return request("/timeline", { method: "POST", body: JSON.stringify(data) });
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  return request("/dashboard");
}

export async function getReportVisitors(params?: { start?: string; end?: string; departmentId?: string; status?: string }): Promise<ReportVisitors> {
  const clean = params ? Object.fromEntries(Object.entries(params).filter(([_, v]) => v !== undefined && v !== "")) : undefined;
  const qs = clean ? "?" + new URLSearchParams(clean as Record<string, string>).toString() : "";
  return request(`/reports/visitors${qs}`);
}

export async function getReportDepartments(): Promise<ReportDepartments> {
  return request("/reports/departments");
}

export async function getReportUsers(): Promise<ReportUsers> {
  return request("/reports/users");
}

export async function getNotifications(unreadOnly?: boolean): Promise<Notification[]> {
  const qs = unreadOnly ? "?unreadOnly=true" : "";
  return request(`/notifications${qs}`);
}

export async function getUnreadCount(): Promise<{ count: number }> {
  return request("/notifications/unread-count");
}

export async function markNotificationRead(id: string): Promise<void> {
  await request(`/notifications/${id}/read`, { method: "PUT" });
}

export async function markAllNotificationsRead(): Promise<void> {
  await request("/notifications/read-all", { method: "POST" });
}

export async function getLogs(params?: { action?: string; resource?: string; userId?: string; start?: string; end?: string; limit?: number }): Promise<AuditLog[]> {
  const clean = params ? Object.fromEntries(Object.entries(params).filter(([_, v]) => v !== undefined && v !== "")) : undefined;
  const qs = clean ? "?" + new URLSearchParams(clean as Record<string, string>).toString() : "";
  return request(`/logs${qs}`);
}

export async function getLogUsers(): Promise<{ id: string; name: string }[]> {
  return request("/logs/users");
}

export async function getSettings(): Promise<SettingsMap> {
  return request("/settings");
}

export async function updateSettings(data: Record<string, string>): Promise<SettingsMap> {
  return request("/settings", { method: "PUT", body: JSON.stringify(data) });
}

export async function getColaboradores(params?: { search?: string; departamentoId?: string; cargo?: string; status?: string; gestorId?: string; vinculo?: string; page?: number; pageSize?: number }): Promise<PaginatedResponse<Colaborador>> {
  const clean = params ? Object.fromEntries(Object.entries(params).filter(([_, v]) => v !== undefined && v !== "")) : undefined;
  const qs = clean ? "?" + new URLSearchParams(clean as Record<string, string>).toString() : "";
  return request(`/colaboradores${qs}`);
}

export async function getColaboradorById(id: string): Promise<Colaborador> {
  return request(`/colaboradores/${id}`);
}

export async function createColaborador(data: Partial<Colaborador>): Promise<Colaborador> {
  return request("/colaboradores", { method: "POST", body: JSON.stringify(data) });
}

export async function updateColaborador(id: string, data: Partial<Colaborador>): Promise<void> {
  await request(`/colaboradores/${id}`, { method: "PUT", body: JSON.stringify(data) });
}

export async function deleteColaborador(id: string): Promise<void> {
  await request(`/colaboradores/${id}`, { method: "DELETE" });
}

export async function getCiclos(): Promise<CicloAvaliacao[]> {
  return request("/ciclos");
}

export async function getCicloById(id: string): Promise<CicloAvaliacao> {
  return request(`/ciclos/${id}`);
}

export async function createCiclo(data: Partial<CicloAvaliacao>): Promise<CicloAvaliacao> {
  return request("/ciclos", { method: "POST", body: JSON.stringify(data) });
}

export async function updateCiclo(id: string, data: Partial<CicloAvaliacao>): Promise<void> {
  await request(`/ciclos/${id}`, { method: "PUT", body: JSON.stringify(data) });
}

export async function getCompetencias(): Promise<Competencia[]> {
  return request("/competencias");
}

export async function getAvaliacoes(params?: { colaboradorId?: string; cicloId?: string }): Promise<Avaliacao[]> {
  const clean = params ? Object.fromEntries(Object.entries(params).filter(([_, v]) => v !== undefined && v !== "")) : undefined;
  const qs = clean ? "?" + new URLSearchParams(clean as Record<string, string>).toString() : "";
  return request(`/avaliacoes${qs}`);
}

export async function getAvaliacaoById(id: string): Promise<Avaliacao & { competencias: { id: string; avaliacaoId: string; competenciaId: string; nota: number; competenciaNome: string }[] }> {
  return request(`/avaliacoes/${id}`);
}

export async function createAvaliacao(data: { colaboradorId: string; cicloId: string; tipo: string; competencias: { competenciaId: string; nota: number }[]; comentarios?: string }): Promise<{ id: string }> {
  return request("/avaliacoes", { method: "POST", body: JSON.stringify(data) });
}

export async function finalizarAvaliacao(id: string): Promise<{ success: boolean; notaFinal: number; conceitoFinal: string }> {
  return request(`/avaliacoes/${id}/finalizar`, { method: "PUT" });
}

export async function getMetas(params?: { colaboradorId?: string; cicloId?: string }): Promise<Meta[]> {
  const clean = params ? Object.fromEntries(Object.entries(params).filter(([_, v]) => v !== undefined && v !== "")) : undefined;
  const qs = clean ? "?" + new URLSearchParams(clean as Record<string, string>).toString() : "";
  return request(`/metas${qs}`);
}

export async function createMeta(data: Partial<Meta>): Promise<{ id: string }> {
  return request("/metas", { method: "POST", body: JSON.stringify(data) });
}

export async function updateMeta(id: string, data: Partial<Meta>): Promise<void> {
  await request(`/metas/${id}`, { method: "PUT", body: JSON.stringify(data) });
}

export async function deleteMeta(id: string): Promise<void> {
  await request(`/metas/${id}`, { method: "DELETE" });
}

export async function getPDIs(params?: { colaboradorId?: string; cicloId?: string }): Promise<PDI[]> {
  const clean = params ? Object.fromEntries(Object.entries(params).filter(([_, v]) => v !== undefined && v !== "")) : undefined;
  const qs = clean ? "?" + new URLSearchParams(clean as Record<string, string>).toString() : "";
  return request(`/pdi${qs}`);
}

export async function createPDI(data: Partial<PDI>): Promise<{ id: string }> {
  return request("/pdi", { method: "POST", body: JSON.stringify(data) });
}

export async function updatePDI(id: string, data: Partial<PDI>): Promise<void> {
  await request(`/pdi/${id}`, { method: "PUT", body: JSON.stringify(data) });
}

export async function deletePDI(id: string): Promise<void> {
  await request(`/pdi/${id}`, { method: "DELETE" });
}

export async function getFeedbacks(params?: { colaboradorId?: string }): Promise<Feedback[]> {
  const clean = params ? Object.fromEntries(Object.entries(params).filter(([_, v]) => v !== undefined && v !== "")) : undefined;
  const qs = clean ? "?" + new URLSearchParams(clean as Record<string, string>).toString() : "";
  return request(`/feedbacks${qs}`);
}

export async function createFeedback(data: { colaboradorId: string; tipo: string; comentario: string }): Promise<{ id: string }> {
  return request("/feedbacks", { method: "POST", body: JSON.stringify(data) });
}

export async function getHistorico(colaboradorId: string): Promise<HistoricoColaborador[]> {
  return request(`/historico/${colaboradorId}`);
}

export async function getDashboardPerformanceRH(): Promise<DashboardPerformanceRH> {
  return request("/dashboard-performance/rh");
}

export async function getDashboardPerformanceGestor(): Promise<DashboardPerformanceGestor> {
  return request("/dashboard-performance/gestor");
}

export async function getDashboardPerformanceColaborador(userId: string): Promise<DashboardPerformanceColaborador> {
  return request(`/dashboard-performance/colaborador?userId=${userId}`);
}

export async function getCicloProgress(id: string): Promise<CicloProgress> {
  return request(`/ciclos/${id}/progress`);
}

export function exportAvaliacoes(cicloId: string) {
  window.open(`/api/export/avaliacoes/${cicloId}`, "_blank");
}

export async function getMetaById(id: string): Promise<Meta> {
  return request(`/metas/${id}`);
}

export async function getPDIById(id: string): Promise<PDI> {
  return request(`/pdi/${id}`);
}

export async function deleteAvaliacao(id: string): Promise<void> {
  await request(`/avaliacoes/${id}`, { method: "DELETE" });
}

export async function getDocumentos(colaboradorId: string): Promise<{ id: string; nome: string; tipo: string; mimeType: string; tamanho: number; createdAt: string }[]> {
  return request(`/documentos/${colaboradorId}`);
}

export async function uploadDocumento(formData: FormData): Promise<{ id: string }> {
  const token = localStorage.getItem("auth_token");
  const res = await fetch("/api/documentos", {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });
  if (!res.ok) { const err = await res.json().catch(() => ({ error: res.statusText })); throw new Error(err.error || `HTTP ${res.status}`); }
  return res.json();
}

export async function downloadDocumento(id: string): Promise<void> {
  const token = localStorage.getItem("auth_token");
  const res = await fetch(`/api/documentos/${id}/download`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
  if (!res.ok) { const err = await res.json().catch(() => ({ error: res.statusText })); throw new Error(err.error || `HTTP ${res.status}`); }
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url;
  const cd = res.headers.get("content-disposition");
  const match = cd && cd.match(/filename="?(.+?)"?$/);
  a.download = match ? match[1] : "documento";
  document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
}

export async function deleteDocumento(id: string): Promise<void> {
  await request(`/documentos/${id}`, { method: "DELETE" });
}

export async function getCursos(): Promise<{ id: string; nome: string; descricao: string; cargaHoraria: number; createdAt: string }[]> {
  return request("/cursos");
}

export async function getCursoById(id: string): Promise<any> {
  return request(`/cursos/${id}`);
}

export async function createCurso(data: { nome: string; descricao?: string; cargaHoraria?: number }): Promise<{ id: string }> {
  return request("/cursos", { method: "POST", body: JSON.stringify(data) });
}

export async function updateCurso(id: string, data: any): Promise<void> {
  await request(`/cursos/${id}`, { method: "PUT", body: JSON.stringify(data) });
}

export async function deleteCurso(id: string): Promise<void> {
  await request(`/cursos/${id}`, { method: "DELETE" });
}

export async function getCursosColaborador(colaboradorId: string): Promise<any[]> {
  return request(`/cursos/colaborador/${colaboradorId}`);
}

export async function getAllVinculos(): Promise<any[]> {
  return request("/cursos/vinculos");
}

export async function vincularCurso(data: { colaboradorId: string; cursoId: string; dataInicio?: string; dataFim?: string }): Promise<{ id: string }> {
  return request("/cursos/vincular", { method: "POST", body: JSON.stringify(data) });
}

export async function updateVinculoCurso(id: string, data: any): Promise<void> {
  await request(`/cursos/vincular/${id}`, { method: "PUT", body: JSON.stringify(data) });
}

export async function deleteVinculoCurso(id: string): Promise<void> {
  await request(`/cursos/vincular/${id}`, { method: "DELETE" });
}

export async function importColaboradores(colaboradores: ImportColaborador[]): Promise<ImportResult> {
  return request("/colaboradores/import", { method: "POST", body: JSON.stringify({ colaboradores }) });
}
