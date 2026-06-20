import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarDate, parseDate } from "@internationalized/date";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { JollyDateRangePicker } from "@/components/ui/date-range-picker";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { getReportVisitors, getDepartments } from "@/services/api";
import type { ReportVisitors, Department } from "@/types";
import { ArrowLeft, BarChart3, Filter, Download } from "lucide-react";

const MS_PER_DAY = 86400000;
const today = new Date();
const defaultRange = {
  start: parseDate(new Date(Date.now() - 30 * MS_PER_DAY).toISOString().slice(0, 10)),
  end: parseDate(today.toISOString().slice(0, 10)),
};

export function ReportVisitorsPage() {
  const navigate = useNavigate();
  const [data, setData] = useState<ReportVisitors | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [range, setRange] = useState<{ start: CalendarDate; end: CalendarDate }>(defaultRange);
  const [departmentId, setDepartmentId] = useState("");
  const [status, setStatus] = useState("all");

  const fetchData = () => {
    getReportVisitors({
      start: range.start.toString(),
      end: range.end.toString(),
      departmentId: departmentId || undefined,
      status,
    }).then(setData);
  };

  useEffect(() => {
    getDepartments().then(setDepartments);
    fetchData();
  }, []);

  const totalByStatus = data?.byStatus.reduce((acc, s) => acc + s.count, 0) || 0;

  return (
    <div>
      <PageHeader
        title="Relatório de Visitantes"
        description="Métricas de visitantes por período, status e departamento"
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total no Período</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{data?.total ?? "—"}</p>
          </CardContent>
        </Card>
        {data?.byStatus.map((s) => (
          <Card key={s.status}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground capitalize">{s.status}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{s.count}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-end gap-4">
            <JollyDateRangePicker
              label="Período"
              value={range}
              onChange={(v) => {
                if (v) setRange({ start: v.start as CalendarDate, end: v.end as CalendarDate });
              }}
            />
            <div className="space-y-1">
              <Label className="text-xs">Departamento</Label>
              <Select value={departmentId} onValueChange={setDepartmentId}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  {departments.map((d) => (
                    <SelectItem key={d.id} value={String(d.id)}>{d.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="registered">Registrado</SelectItem>
                  <SelectItem value="scheduled">Agendado</SelectItem>
                  <SelectItem value="checking_in">Check-in</SelectItem>
                  <SelectItem value="in_progress">Em andamento</SelectItem>
                  <SelectItem value="completed">Finalizado</SelectItem>
                  <SelectItem value="cancelled">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button size="sm" className="gap-2" onClick={fetchData}>
              <Filter className="h-4 w-4" />
              Filtrar
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Visitantes por Departamento</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {data && data.byDepartment.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Departamento</TableHead>
                  <TableHead className="text-right">Visitantes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.byDepartment.map((d) => (
                  <TableRow
                    key={d.departmentId || "null"}
                    className="cursor-pointer"
                    onClick={() => d.departmentId && navigate(`/departments/${d.departmentId}/edit`)}
                  >
                    <TableCell className="font-medium hover:text-indigo-600 transition-colors">{d.departmentName || "Sem departamento"}</TableCell>
                    <TableCell className="text-right font-medium">{d.count}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <EmptyState title="Nenhum dado" description="Nenhum visitante encontrado no período." />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Visitantes por Data</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {data && data.byDate.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-right">Visitantes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.byDate.map((d) => (
                  <TableRow key={d.date}>
                    <TableCell>{new Date(d.date).toLocaleDateString("pt-BR")}</TableCell>
                    <TableCell className="text-right font-medium">{d.count}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <EmptyState title="Nenhum dado" description="Nenhum visitante encontrado no período." />
          )}
        </CardContent>
      </Card>

      <div className="mt-6">
        <Button variant="outline" onClick={() => navigate("/reports")} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Voltar aos Relatórios
        </Button>
      </div>
    </div>
  );
}
