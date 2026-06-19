import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { getReportDepartments } from "@/services/api";
import type { ReportDepartments } from "@/types";
import { ArrowLeft, Building2 } from "lucide-react";

export function ReportDepartmentsPage() {
  const navigate = useNavigate();
  const [data, setData] = useState<ReportDepartments | null>(null);

  useEffect(() => {
    getReportDepartments().then(setData);
  }, []);

  return (
    <div>
      <PageHeader
        title="Relatório de Departamentos"
        description="Métricas de visitas por departamento"
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Deptos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{data?.total ?? "—"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Visitas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{data?.departments.reduce((a, d) => a + d.visitorCount, 0) ?? "—"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Em Andamento</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{data?.departments.reduce((a, d) => a + d.activeVisits, 0) ?? "—"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Visitas Hoje</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{data?.departments.reduce((a, d) => a + d.todayVisits, 0) ?? "—"}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Departamentos</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {data && data.departments.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Departamento</TableHead>
                  <TableHead className="text-right">Total Visitas</TableHead>
                  <TableHead className="text-right">Em Andamento</TableHead>
                  <TableHead className="text-right">Hoje</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.departments.map((d) => (
                  <TableRow key={d.id} className="cursor-pointer" onClick={() => navigate(`/departments/${d.id}/edit`)}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium hover:text-indigo-600 transition-colors">{d.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">{d.visitorCount}</TableCell>
                    <TableCell className="text-right">{d.activeVisits}</TableCell>
                    <TableCell className="text-right">{d.todayVisits}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <EmptyState title="Nenhum departamento" description="Cadastre departamentos para ver as métricas." />
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
