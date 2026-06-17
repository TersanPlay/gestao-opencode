import { Badge } from "@/components/ui/badge";
import type { VisitorStatus, UserRole } from "@/types";

const statusConfig: Record<VisitorStatus, { label: string; variant: "info" | "warning" | "success" | "destructive" | "slate" }> = {
  registered: { label: "Registrado", variant: "slate" },
  scheduled: { label: "Agendado", variant: "info" },
  checking_in: { label: "Check-in", variant: "warning" },
  in_progress: { label: "Em andamento", variant: "success" },
  completed: { label: "Finalizado", variant: "slate" },
  cancelled: { label: "Cancelado", variant: "destructive" },
};

const roleConfig: Record<UserRole, { label: string; variant: "default" | "success" | "warning" | "slate" }> = {
  admin: { label: "Admin", variant: "default" },
  gestor: { label: "Gestor", variant: "success" },
  assessor: { label: "Assessor", variant: "warning" },
  operator: { label: "Operador", variant: "slate" },
};

export function VisitorStatusBadge({ status }: { status: VisitorStatus }) {
  const cfg = statusConfig[status];
  return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
}

export function UserRoleBadge({ role }: { role: UserRole }) {
  const cfg = roleConfig[role];
  return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
}
