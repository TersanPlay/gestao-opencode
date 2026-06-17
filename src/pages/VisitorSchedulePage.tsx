import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog } from "@/components/ui/dialog";
import { SearchInput } from "@/components/shared/SearchInput";
import { EmptyState } from "@/components/shared/EmptyState";
import { PageHeader } from "@/components/shared/PageHeader";
import { VisitorStatusBadge } from "@/components/shared/StatusBadge";
import { getVisitors, getDepartments, getUsers, updateVisitor } from "@/services/api";
import type { Visitor, Department, User } from "@/types";
import { CalendarDate, Time, now, getLocalTimeZone, parseDate } from "@internationalized/date";
import { JollyDatePicker } from "@/components/ui/date-range-picker";
import { JollyTimeField } from "@/components/ui/datefield";
import { CalendarCheck, Calendar, Building2, Plus, CheckCircle, XCircle, Send, Search, Clock } from "lucide-react";
import { toast } from "sonner";

const purposeOptions = [
  "Protocolo de documento",
  "Reunião com vereador",
  "Reunião Agendada",
  "Entrega de documento",
  "Retirada de documento",
  "Audiência pública",
  "Entrega AI-food",
  "Evento institucional",
  "Prestação de serviço",
  "Manutenção técnica",
  "Visita institucional",
  "Visita escolar",
  "Outro motivo",
];

const statusActions: { status: Visitor["status"]; label: string; icon: typeof Send; nextStatus: Visitor["status"] }[] = [
  { status: "scheduled", label: "Registrar Check-in", icon: Send, nextStatus: "checking_in" },
  { status: "checking_in", label: "Iniciar Visita", icon: Send, nextStatus: "in_progress" },
  { status: "in_progress", label: "Finalizar Visita", icon: CheckCircle, nextStatus: "completed" },
  { status: "completed", label: "", icon: CheckCircle, nextStatus: "completed" },
  { status: "cancelled", label: "", icon: XCircle, nextStatus: "cancelled" },
];

export function VisitorSchedulePage() {
  const navigate = useNavigate();
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<Visitor[]>([]);
  const [selected, setSelected] = useState<Visitor | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [purpose, setPurpose] = useState("");
  const [customPurpose, setCustomPurpose] = useState("");
  const initDate = now(getLocalTimeZone());
  const [scheduleDate, setScheduleDate] = useState<CalendarDate>(new CalendarDate(initDate.year, initDate.month, initDate.day));
  const [scheduleTime, setScheduleTime] = useState<Time>(new Time(initDate.hour, initDate.minute));
  const [scheduleDeptId, setScheduleDeptId] = useState("");
  const [modalMode, setModalMode] = useState<"schedule" | "manage">("schedule");

  const refresh = () => getVisitors().then(setVisitors);

  useEffect(() => {
    refresh();
    getDepartments().then(setDepartments);
    getUsers().then(setUsers);
  }, []);

  const scheduled = visitors.filter((v) =>
    ["scheduled","checking_in","in_progress","completed","cancelled"].includes(v.status || "")
  );

  useEffect(() => {
    if (!search.trim()) { setSearchResults([]); return; }
    const q = search.toLowerCase();
    const results = visitors.filter((v) =>
      v.name.toLowerCase().includes(q) ||
      v.email.toLowerCase().includes(q) ||
      (v.company || "").toLowerCase().includes(q) ||
      v.document.toLowerCase().includes(q)
    );
    setSearchResults(results);
  }, [search, visitors]);

  const getDeptName = (id?: string) => (id ? departments.find((d) => d.id === id)?.name : undefined) || "—";
  const getResponsibleName = (id?: string) => (id ? users.find((u) => u.id === id)?.name : undefined) || "—";

  const isScheduled = !!selected && ["scheduled","checking_in","in_progress","completed","cancelled"].includes(selected?.status || "");
  const action = selected ? statusActions.find((a) => a.status === selected.status) : null;
  const canAct = action && action.nextStatus !== selected?.status;

  const openScheduleModal = (v: Visitor) => {
    setSelected(v);
    setPurpose(v.purpose || "");
    setCustomPurpose(purposeOptions.includes(v.purpose || "") ? "" : v.purpose || "");
    const n = now(getLocalTimeZone());
    setScheduleDate(new CalendarDate(n.year, n.month, n.day));
    setScheduleTime(new Time(n.hour, n.minute));
    setScheduleDeptId(v.departmentId || "");
    setModalMode("schedule");
    setModalOpen(true);
  };

  const openManageModal = (v: Visitor) => {
    setSelected(v);
    setModalMode("manage");
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    const finalPurpose = purpose === "Outro motivo" ? customPurpose : purpose;
    if (!finalPurpose) return toast.error("Selecione um motivo para a visita");
    const dt = scheduleDate.toDate(getLocalTimeZone());
    dt.setHours(scheduleTime.hour, scheduleTime.minute, 0, 0);
    await updateVisitor(selected.id, {
      purpose: finalPurpose,
      departmentId: scheduleDeptId || selected.departmentId,
      scheduledAt: dt.toISOString(),
      status: "scheduled",
    });
    toast.success(`Visita agendada para ${selected.name}`);
    setModalOpen(false);
    setSearch("");
    setSearchResults([]);
    refresh();
  };

  const handleStatusChange = async (newStatus: Visitor["status"]) => {
    if (!selected) return;
    const now = new Date().toISOString();
    const extra: Record<string, string> = {};
    if (newStatus === "checking_in") extra.checkinAt = now;
    if (newStatus === "completed") extra.checkoutAt = now;
    await updateVisitor(selected.id, { status: newStatus, ...extra });
    setSelected({ ...selected, status: newStatus, ...extra });
    toast.success(`Status atualizado`);
    setModalOpen(false);
    refresh();
  };

  const handleCancel = async () => {
    if (!selected) return;
    const now = new Date().toISOString();
    await updateVisitor(selected.id, { status: "cancelled", checkoutAt: now });
    toast.success(`Visita cancelada para ${selected.name}`);
    setModalOpen(false);
    refresh();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Agendar Visita"
        description="Pesquise um visitante para agendar ou gerencie agendamentos existentes"
        secondaryActions={[{ label: "Registrar Visitante", to: "/visitors/new", icon: Plus }]}
      />

      {/* Search for visitors to schedule */}
      <Card>
        <CardContent className="p-4">
          <Label className="text-sm font-medium mb-2 block">Pesquisar Visitante para Agendar</Label>
          <SearchInput value={search} onChange={setSearch} placeholder="Digite nome, documento ou email..." />
          {searchResults.length > 0 && (
            <div className="mt-3 space-y-2 max-h-60 overflow-y-auto">
              {searchResults.map((v) => (
                <div
                  key={v.id}
                  className="flex items-center justify-between rounded-xl border p-3 hover:bg-accent cursor-pointer transition-colors"
                  onClick={() => openScheduleModal(v)}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <Avatar name={v.name} size="sm" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{v.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{v.email} — {v.document}</p>
                    </div>
                  </div>
                  <VisitorStatusBadge status={v.status || "registered"} />
                </div>
              ))}
            </div>
          )}
          {search.trim() && searchResults.length === 0 && (
            <p className="text-sm text-muted-foreground mt-3 text-center py-4">
              Nenhum visitante encontrado.
              <Button variant="link" className="px-1" onClick={() => navigate("/visitors/new")}>Cadastrar novo</Button>
            </p>
          )}
        </CardContent>
      </Card>

      {/* Scheduled visitors list */}
      <Card>
        <CardContent className="p-0">
          <div className="px-4 pt-4 pb-2">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <CalendarCheck className="h-4 w-4" />
              Agendamentos Realizados
              <span className="text-xs text-muted-foreground font-normal">({scheduled.length})</span>
            </h3>
          </div>

          {scheduled.length === 0 ? (
            <EmptyState
              title="Nenhum agendamento"
              description="Pesquise um visitante acima para criar um agendamento"
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Visitante</TableHead>
                  <TableHead>Departamento</TableHead>
                  <TableHead>Responsável</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scheduled.map((v) => (
                  <TableRow
                    key={v.id}
                    className="cursor-pointer transition-colors hover:bg-accent"
                    onClick={() => openManageModal(v)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar name={v.name} size="sm" />
                        <span className="font-medium">{v.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Building2 className="h-3.5 w-3.5" />
                        {v.departmentId ? getDeptName(v.departmentId) : "—"}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{getResponsibleName(v.responsibleId)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        {v.scheduledAt ? new Date(v.scheduledAt).toLocaleDateString("pt-BR") : "—"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <VisitorStatusBadge status={v.status || "scheduled"} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Schedule modal (for non-scheduled visitors) */}
      <Dialog
        open={!!(modalOpen && modalMode === "schedule")}
        onOpenChange={(o) => { setModalOpen(o); if (!o) setSearchResults([]); }}
        title="Agendar Visita"
        description={selected ? `Agendar visita para ${selected.name}` : ""}
      >
        {selected && (
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="flex items-center gap-3 rounded-xl border bg-muted/30 p-3">
              <Avatar name={selected.name} size="md" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{selected.name}</p>
                <p className="text-xs text-muted-foreground truncate">{selected.document} — {selected.email}</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="scheduleDept">Departamento</Label>
              <Select value={scheduleDeptId} onValueChange={setScheduleDeptId}>
                <SelectTrigger id="scheduleDept">
                  <SelectValue placeholder="Selecione o departamento..." />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((d) => (
                    <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="purpose">Motivo da Visita</Label>
              <Select value={purpose} onValueChange={(v) => { setPurpose(v); if (v !== "Outro motivo") setCustomPurpose(""); }}>
                <SelectTrigger id="purpose">
                  <SelectValue placeholder="Selecione o motivo..." />
                </SelectTrigger>
                <SelectContent>
                  {purposeOptions.map((opt) => (
                    <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {purpose === "Outro motivo" && (
                <Input
                  value={customPurpose}
                  onChange={(e) => setCustomPurpose(e.target.value)}
                  placeholder="Descreva o motivo"
                  className="mt-2"
                  autoFocus
                  required
                />
              )}
            </div>

            <div className="space-y-2">
              <Label>Data e Hora da Visita</Label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <JollyDatePicker value={scheduleDate} onChange={(v) => v && setScheduleDate(v)} />
                </div>
                <div className="w-28">
                  <JollyTimeField value={scheduleTime} onChange={(v) => v && setScheduleTime(v)} />
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" className="gap-2 flex-1">
                <CalendarCheck className="h-4 w-4" />
                Confirmar Agendamento
              </Button>
              <Button type="button" variant="outline" onClick={() => { setModalOpen(false); setSearchResults([]); }} className="gap-2">
                Cancelar
              </Button>
            </div>
          </form>
        )}
      </Dialog>

      {/* Manage modal (for scheduled visitors) */}
      <Dialog
        open={!!(modalOpen && modalMode === "manage")}
        onOpenChange={setModalOpen}
        title="Gerenciar Visita"
        description={selected ? selected.name : ""}
      >
        {selected && (
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-3 rounded-xl border bg-muted/30 p-3">
              <Avatar name={selected.name} size="md" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{selected.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {selected.purpose || "Sem motivo"} — {selected.document}
                </p>
              </div>
              <VisitorStatusBadge status={selected.status || "scheduled"} />
            </div>

            {selected.scheduledAt && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Agendado: {new Date(selected.scheduledAt).toLocaleString("pt-BR")}
              </div>
            )}

            {canAct && action && (
              <Button onClick={() => handleStatusChange(action.nextStatus)} className="gap-2 w-full justify-start" size="lg">
                {action.nextStatus === "completed" ? <CheckCircle className="h-5 w-5" /> : <Send className="h-5 w-5" />}
                {action.label}
              </Button>
            )}

            {selected.status !== "cancelled" && selected.status !== "completed" && (
              <Button onClick={handleCancel} variant="outline" className="gap-2 w-full justify-start text-red-600 border-red-200 hover:bg-red-50" size="lg">
                <XCircle className="h-5 w-5" />
                Cancelar Visita
              </Button>
            )}

            {selected.status === "completed" && (
              <div className="text-center py-2">
                <p className="text-sm text-muted-foreground">Visita finalizada.</p>
                {selected.checkoutAt && (
                  <p className="text-xs text-muted-foreground flex items-center justify-center gap-1 mt-1">
                    <Clock className="h-3 w-3" />
                    {new Date(selected.checkoutAt).toLocaleString("pt-BR")}
                  </p>
                )}
              </div>
            )}

            {selected.status === "cancelled" && (
              <div className="text-center py-2">
                <p className="text-sm text-muted-foreground">Visita cancelada.</p>
                {selected.checkoutAt && (
                  <p className="text-xs text-muted-foreground flex items-center justify-center gap-1 mt-1">
                    <Clock className="h-3 w-3" />
                    Cancelado em: {new Date(selected.checkoutAt).toLocaleString("pt-BR")}
                  </p>
                )}
              </div>
            )}

            <Button variant="ghost" onClick={() => setModalOpen(false)} className="w-full">
              Fechar
            </Button>
          </div>
        )}
      </Dialog>
    </div>
  );
}
