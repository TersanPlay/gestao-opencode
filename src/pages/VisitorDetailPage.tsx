import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { VisitorStatusBadge } from "@/components/shared/StatusBadge";
import { PermissionGate } from "@/components/auth/PermissionGate";
import { getVisitorById, getTimeline, getDepartments, getUsers, updateVisitor } from "@/services/api";
import type { Visitor, TimelineEvent, Department, User } from "@/types";
import { AlertTriangle, ArrowLeft, Building2, User as UserIcon, Calendar, Clock, CheckCircle, XCircle, Send, Pencil } from "lucide-react";
import { toast } from "sonner";

const statusActions: { status: Visitor["status"]; label: string; icon: typeof Send; nextStatus: Visitor["status"] }[] = [
  { status: "scheduled", label: "Registrar Check-in", icon: Send, nextStatus: "checking_in" },
  { status: "checking_in", label: "Iniciar Visita", icon: Send, nextStatus: "in_progress" },
  { status: "in_progress", label: "Finalizar Visita", icon: CheckCircle, nextStatus: "completed" },
  { status: "completed", label: "", icon: CheckCircle, nextStatus: "completed" },
  { status: "cancelled", label: "", icon: XCircle, nextStatus: "cancelled" },
];

const statusColors: Record<string, string> = {
  scheduled: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  checking_in: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  in_progress: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  completed: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
  cancelled: "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300",
};

export function VisitorDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [visitor, setVisitor] = useState<Visitor | null>(null);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    if (!id) return;
    getVisitorById(id).then((v) => v && setVisitor(v));
    getTimeline(id).then(setTimeline);
    getDepartments().then(setDepartments);
    getUsers().then(setUsers);
  }, [id]);

  if (!visitor) return null;

  const deptName = departments.find((d) => d.id === visitor.departmentId)?.name || "—";
  const responsibleName = users.find((u) => u.id === visitor.responsibleId)?.name || "—";

  const action = statusActions.find((a) => a.status === visitor.status);
  const canAct = action && action.nextStatus !== visitor.status;

  const handleStatusChange = async (newStatus: Visitor["status"]) => {
    await updateVisitor(visitor.id, { status: newStatus });
    setVisitor({ ...visitor, status: newStatus });
    toast.success(`Status atualizado para "${newStatus === "checking_in" ? "Check-in" : newStatus === "in_progress" ? "Em andamento" : newStatus === "completed" ? "Finalizado" : newStatus}"`);
  };

  return (
    <div className="max-w-3xl space-y-6">
      <Button variant="ghost" onClick={() => navigate("/visitors")} className="gap-2 -ml-2">
        <ArrowLeft className="h-4 w-4" />
        Voltar
      </Button>

      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Avatar name={visitor.name} size="lg" />
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{visitor.name}</h2>
            <p className="text-sm text-muted-foreground">{visitor.company || "Visitante externo"}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <VisitorStatusBadge status={visitor.status || "registered"} />
          <PermissionGate action="update" resource="visitors">
            <Button variant="outline" onClick={() => navigate(`/visitors/${visitor.id}/edit`)} className="gap-2">
              <Pencil className="h-4 w-4" />
              Editar
            </Button>
          </PermissionGate>
          {canAct && (
            <Button onClick={() => handleStatusChange(action!.nextStatus)} className="gap-2">
              <action.icon className="h-4 w-4" />
              {action!.label}
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Informações Pessoais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <UserIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Email:</span>
              <span>{visitor.email}</span>
              {visitor.isDisposable === 1 && (
                <Badge variant="destructive" className="gap-1 text-[10px] px-1.5 py-0">
                  <AlertTriangle className="h-3 w-3" />
                  Descartável
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <UserIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Telefone:</span>
              <span>{visitor.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <UserIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Documento:</span>
              <span>{visitor.document}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Detalhes da Visita</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Departamento:</span>
              <span>{deptName}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <UserIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Responsável:</span>
              <span>{responsibleName}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Agendado:</span>
              <span>{visitor.scheduledAt ? new Date(visitor.scheduledAt).toLocaleString("pt-BR") : "—"}</span>
            </div>
            {visitor.checkinAt && (
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Check-in:</span>
                <span>{new Date(visitor.checkinAt).toLocaleString("pt-BR")}</span>
              </div>
            )}
            {visitor.checkoutAt && (
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Check-out:</span>
                <span>{new Date(visitor.checkoutAt).toLocaleString("pt-BR")}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Motivo da Visita</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{visitor.purpose || "—"}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Histórico / Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          {timeline.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum evento registrado.</p>
          ) : (
            <div className="relative space-y-0">
              {timeline.map((event, idx) => (
                <div key={event.id} className="relative flex gap-4 pb-6 last:pb-0">
                  <div className="flex flex-col items-center">
                    <div className={`flex h-7 w-7 items-center justify-center rounded-full text-white text-[10px] ${
                      event.type === "checkin" ? "bg-emerald-500" :
                      event.type === "checkout" ? "bg-slate-500" :
                      event.type === "cancelled" ? "bg-rose-500" : "bg-indigo-500"
                    }`}>
                      {event.type === "checkin" ? "✓" : event.type === "checkout" ? "◌" : event.type === "cancelled" ? "✕" : "+"}
                    </div>
                    {idx < timeline.length - 1 && (
                      <div className="mt-1 w-px flex-1 bg-border" />
                    )}
                  </div>
                  <div className="flex-1 pb-2">
                    <p className="text-sm font-medium">{event.description}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-muted-foreground">{event.author}</span>
                      <span className="text-xs text-muted-foreground">·</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(event.timestamp).toLocaleString("pt-BR")}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
