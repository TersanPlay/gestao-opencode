import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/shared/SearchInput";
import { EmptyState } from "@/components/shared/EmptyState";
import { PageHeader } from "@/components/shared/PageHeader";
import { VisitorStatusBadge } from "@/components/shared/StatusBadge";
import { PermissionGate } from "@/components/auth/PermissionGate";
import { useAuth } from "@/contexts/AuthContext";
import { getVisitors, getDepartments, getUsers } from "@/services/api";
import type { Visitor, Department, User } from "@/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Calendar, Building2, Clock, CalendarPlus, Pencil } from "lucide-react";

export function VisitorsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const canSeeUsers = user && ["admin", "gestor"].includes(user.role);

  useEffect(() => {
    getVisitors().then(setVisitors);
    getDepartments().then(setDepartments);
    if (canSeeUsers) getUsers().then(setUsers).catch(() => {});
  }, [canSeeUsers]);

  const filtered = visitors.filter((v) => {
    const matchesSearch =
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.email.toLowerCase().includes(search.toLowerCase()) ||
      (v.company || "").toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getDeptName = (id?: string) => (id ? departments.find((d) => d.id === id)?.name : undefined) || "—";
  const getResponsibleName = (id?: string) => (id ? users.find((u) => u.id === id)?.name : undefined) || "—";

  return (
    <div>
      <PageHeader
        title="Visitantes"
        description="Registre e controle o acesso de visitantes"
        action={{ label: "Registrar Visitante", to: "/visitors/new" }}
        secondaryActions={[{ label: "Agendar Visita", to: "/visitors/schedule", icon: CalendarPlus }]}
      />

      <Card>
        <CardContent className="p-0">
          <div className="flex flex-wrap items-center gap-4 p-4 pb-0">
            <SearchInput value={search} onChange={setSearch} placeholder="Buscar visitante..." />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-9 w-44 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="registered">Registrado</SelectItem>
                <SelectItem value="scheduled">Agendado</SelectItem>
                <SelectItem value="checking_in">Check-in</SelectItem>
                <SelectItem value="in_progress">Em andamento</SelectItem>
                <SelectItem value="completed">Finalizado</SelectItem>
                <SelectItem value="cancelled">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filtered.length === 0 ? (
            <EmptyState
              title="Nenhum visitante encontrado"
              description={search ? "Tente ajustar sua busca" : "Registre o primeiro visitante"}
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
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((v) => (
                  <TableRow key={v.id} className="cursor-pointer" onClick={() => navigate(`/visitors/${v.id}`)}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar name={v.name} src={v.photo} size="sm" />
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
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => { e.stopPropagation(); navigate(`/visitors/${v.id}`); }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <PermissionGate action="update" resource="visitors">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => { e.stopPropagation(); navigate(`/visitors/${v.id}/edit`); }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </PermissionGate>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
