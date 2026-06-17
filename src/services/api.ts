import type { User, Department, Visitor, TimelineEvent, DashboardMetrics, ReportVisitors, ReportDepartments, ReportUsers, Notification, AuditLog, SettingsMap } from "@/types";

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
