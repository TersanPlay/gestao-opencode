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
import { CalendarCheck, Calendar, Building2, Plus, ArrowLeft, Check } from "lucide-react";
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

function toDatetimeLocal(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const h = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  return `${y}-${m}-${d}T${h}:${min}`;
}

export function VisitorSchedulePage() {
  const navigate = useNavigate();
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState<Visitor | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [purpose, setPurpose] = useState("");
  const [customPurpose, setCustomPurpose] = useState("");
  const [scheduledAt, setScheduledAt] = useState(toDatetimeLocal(new Date()));

  useEffect(() => {
    getVisitors().then(setVisitors);
    getDepartments().then(setDepartments);
    getUsers().then(setUsers);
  }, []);

  const filtered = visitors.filter((v) => {
    const q = search.toLowerCase();
    const matchesSearch = !search ||
      v.name.toLowerCase().includes(q) ||
      v.email.toLowerCase().includes(q) ||
      (v.company || "").toLowerCase().includes(q) ||
      v.document.toLowerCase().includes(q);
    const matchesStatus = statusFilter === "all" || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getDeptName = (id?: string) => (id ? departments.find((d) => d.id === id)?.name : undefined) || "—";
  const getResponsibleName = (id?: string) => (id ? users.find((u) => u.id === id)?.name : undefined) || "—";

  const handleSelect = (v: Visitor) => {
    setSelected(v);
    const existing = v.purpose || "";
    setPurpose(existing);
    setCustomPurpose(purposeOptions.includes(existing) ? "" : existing);
    setScheduledAt(v.scheduledAt ? toDatetimeLocal(new Date(v.scheduledAt)) : toDatetimeLocal(new Date()));
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    const finalPurpose = purpose === "Outro motivo" ? customPurpose : purpose;
    if (!finalPurpose) return;
    await updateVisitor(selected.id, {
      purpose: finalPurpose,
      scheduledAt: new Date(scheduledAt).toISOString(),
      status: "scheduled",
    });
    toast.success(`Visita agendada para ${selected.name}`);
    setModalOpen(false);
    navigate("/visitors");
  };

  return (
    <div>
      <PageHeader
        title="Agendar Visita"
        description="Selecione um visitante na tabela para agendar a visita"
        action={{ label: "Registrar Agendamento", to: "/visitors/schedule", icon: CalendarCheck }}
        secondaryActions={[{ label: "Registrar Visitante", to: "/visitors/new", icon: Plus }]}
      />

      <Card>
        <CardContent className="p-0">
          <div className="flex flex-wrap items-center gap-4 p-4 pb-0">
            <SearchInput value={search} onChange={setSearch} placeholder="Buscar por nome, documento, email..." />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex h-9 rounded-xl border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">Todos os status</option>
              <option value="scheduled">Agendado</option>
              <option value="checking_in">Check-in</option>
              <option value="in_progress">Em andamento</option>
              <option value="completed">Finalizado</option>
              <option value="cancelled">Cancelado</option>
            </select>
          </div>

          {filtered.length === 0 ? (
            <EmptyState
              title="Nenhum visitante encontrado"
              description={search ? "Tente ajustar sua busca" : "Cadastre um visitante primeiro"}
              action={search ? undefined : { label: "Registrar Visitante", to: "/visitors/new" }}
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Visitante</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Departamento</TableHead>
                  <TableHead>Responsável</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((v) => (
                  <TableRow
                    key={v.id}
                    className="cursor-pointer transition-colors hover:bg-accent"
                    onClick={() => handleSelect(v)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar name={v.name} size="sm" />
                        <span className="font-medium">{v.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{v.company || "—"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Building2 className="h-3.5 w-3.5" />
                        {getDeptName(v.departmentId)}
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
                      <VisitorStatusBadge status={v.status || "registered"} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={modalOpen} onOpenChange={setModalOpen} title="Agendar Visita" description={selected ? `Visitante: ${selected.name}` : ""}>
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
              <Label htmlFor="scheduledAt">Data da Visita</Label>
              <Input
                id="scheduledAt"
                type="datetime-local"
                value={scheduledAt}
                disabled
              />
              <p className="text-xs text-muted-foreground">Preenchido automaticamente.</p>
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" className="gap-2 flex-1">
                <CalendarCheck className="h-4 w-4" />
                Confirmar Agendamento
              </Button>
              <Button type="button" variant="outline" onClick={() => setModalOpen(false)} className="gap-2">
                Cancelar
              </Button>
            </div>
          </form>
        )}
      </Dialog>
    </div>
  );
}
