import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getLogs, getLogUsers } from "@/services/api";
import type { AuditLog } from "@/types";
import { Shield, Download, Search } from "lucide-react";

const ACTION_OPTS = ["POST", "PUT", "DELETE"];
const RESOURCE_OPTS = ["users", "departments", "visitors", "auth"];

export function LogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [users, setUsers] = useState<{ id: string; name: string }[]>([]);
  const [filterAction, setFilterAction] = useState("");
  const [filterResource, setFilterResource] = useState("");
  const [filterUser, setFilterUser] = useState("");
  const [filterStart, setFilterStart] = useState("");
  const [filterEnd, setFilterEnd] = useState("");

  const load = () => {
    getLogs({
      action: filterAction || undefined,
      resource: filterResource || undefined,
      userId: filterUser || undefined,
      start: filterStart || undefined,
      end: filterEnd || undefined,
    }).then(setLogs).catch(() => {});
  };

  useEffect(() => { load(); getLogUsers().then(setUsers).catch(() => {}); }, []);

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); load(); };

  const actionBadge = (action: string) => {
    const map: Record<string, "success" | "destructive" | "warning" | "default"> = {
      POST: "success", PUT: "warning", DELETE: "destructive",
    };
    return <Badge variant={map[action] || "default"}>{action}</Badge>;
  };

  const exportCSV = () => {
    const header = "Data,Usuário,Ação,Recurso,ID,Detalhes\n";
    const rows = logs.map((l) =>
      `"${l.createdAt}","${l.uName || l.userName}","${l.action}","${l.resource}","${l.resourceId || ""}","${l.details}"`
    ).join("\n");
    const blob = new Blob(["\uFEFF" + header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "auditoria.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Logs de Auditoria</h2>
          <p className="mt-1 text-sm text-muted-foreground">Histórico de ações realizadas no sistema</p>
        </div>
        <Button variant="outline" onClick={exportCSV} className="gap-2">
          <Download className="h-4 w-4" /> Exportar CSV
        </Button>
      </div>

      <Card className="mb-6">
        <CardContent className="p-4">
          <form onSubmit={handleSearch} className="flex flex-wrap items-end gap-4">
            <div className="space-y-1">
              <Label className="text-xs">Ação</Label>
              <Select value={filterAction} onValueChange={setFilterAction}>
                <SelectTrigger className="h-9 w-28"><SelectValue placeholder="Todas" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value=" ">Todas</SelectItem>
                  {ACTION_OPTS.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Recurso</Label>
              <Select value={filterResource} onValueChange={setFilterResource}>
                <SelectTrigger className="h-9 w-36"><SelectValue placeholder="Todos" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value=" ">Todos</SelectItem>
                  {RESOURCE_OPTS.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Usuário</Label>
              <Select value={filterUser} onValueChange={setFilterUser}>
                <SelectTrigger className="h-9 w-40"><SelectValue placeholder="Todos" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value=" ">Todos</SelectItem>
                  {users.map((u) => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Início</Label>
              <Input type="date" value={filterStart} onChange={(e) => setFilterStart(e.target.value)} className="h-9 w-36" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Fim</Label>
              <Input type="date" value={filterEnd} onChange={(e) => setFilterEnd(e.target.value)} className="h-9 w-36" />
            </div>
            <Button type="submit" size="sm" className="gap-2 h-9">
              <Search className="h-4 w-4" /> Filtrar
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {logs.length === 0 ? (
            <EmptyState title="Nenhum log encontrado" description="Nenhuma ação registrada com os filtros atuais" />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Ação</TableHead>
                  <TableHead>Recurso</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Detalhes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((l) => (
                  <TableRow key={l.id}>
                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                      {new Date(l.createdAt).toLocaleString("pt-BR")}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Shield className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-sm">{l.uName || l.userName}</span>
                      </div>
                    </TableCell>
                    <TableCell>{actionBadge(l.action)}</TableCell>
                    <TableCell className="text-sm font-medium">{l.resource}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{l.resourceId || "—"}</TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">{l.details}</TableCell>
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
