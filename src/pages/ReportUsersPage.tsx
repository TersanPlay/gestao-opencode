import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { getReportUsers } from "@/services/api";
import type { ReportUsers } from "@/types";
import { ArrowLeft, Users, UserCheck, UserX } from "lucide-react";

export function ReportUsersPage() {
  const navigate = useNavigate();
  const [data, setData] = useState<ReportUsers | null>(null);

  useEffect(() => {
    getReportUsers().then(setData);
  }, []);

  return (
    <div>
      <PageHeader
        title="Relatório de Usuários"
        description="Distribuição de usuários por papel e status"
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-muted-foreground" />
              <p className="text-3xl font-bold">{data?.total ?? "—"}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <UserCheck className="h-8 w-8 text-emerald-500" />
              <p className="text-3xl font-bold">{data?.active ?? "—"}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Inativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <UserX className="h-8 w-8 text-rose-500" />
              <p className="text-3xl font-bold">{(data?.total ?? 0) - (data?.active ?? 0)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Por Papel</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {data && data.byRole.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Papel</TableHead>
                    <TableHead className="text-right">Usuários</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.byRole.map((r) => (
                    <TableRow key={r.role}>
                      <TableCell className="capitalize">{r.role}</TableCell>
                      <TableCell className="text-right font-medium">{r.count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <EmptyState title="Sem dados" description="Nenhum usuário cadastrado." />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Por Status</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {data && data.byStatus.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Usuários</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.byStatus.map((s) => (
                    <TableRow key={s.status}>
                      <TableCell className="capitalize">{s.status === "active" ? "Ativo" : "Inativo"}</TableCell>
                      <TableCell className="text-right font-medium">{s.count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <EmptyState title="Sem dados" description="Nenhum usuário cadastrado." />
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Button variant="outline" onClick={() => navigate("/reports")} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Voltar aos Relatórios
        </Button>
      </div>
    </div>
  );
}
