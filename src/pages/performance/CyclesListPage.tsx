import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";
import { getCiclos, updateCiclo, getCicloProgress } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Plus, Play, Square, Eye } from "lucide-react";
import type { CicloAvaliacao } from "@/types";

const PERCENT_COMPLETE = 100;
const PERCENT_HALF = 50;

export function CyclesListPage() {
  const navigate = useNavigate();
  const { user, can } = useAuth();
  const [ciclos, setCiclos] = useState<CicloAvaliacao[]>([]);
  const [progressMap, setProgressMap] = useState<Record<string, { totalColaboradores: number; avaliacoesRealizadas: number; percentualConcluido: number }>>({});
  const [loading, setLoading] = useState(true);
  const podeGerenciar = user?.role === "admin";

  const load = () => {
    setLoading(true);
    getCiclos().then(async (ciclos) => {
      setCiclos(ciclos);
      const pm: Record<string, { totalColaboradores: number; avaliacoesRealizadas: number; percentualConcluido: number }> = {};
      await Promise.all(ciclos.map(async (c) => {
        try { pm[c.id] = await getCicloProgress(c.id); } catch (err) { console.error(err); }
      }));
      setProgressMap(pm);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleToggleStatus = async (ciclo: CicloAvaliacao) => {
    try {
      const newStatus = ciclo.status === "aberto" ? "fechado" : "aberto";
      await updateCiclo(ciclo.id, { status: newStatus });
      toast.success(`Ciclo ${newStatus === "aberto" ? "aberto" : "fechado"} com sucesso`);
      load();
    } catch (err: any) {
      toast.error(err.message || "Erro ao alterar status");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Ciclos de Avaliação" description="Gerencie os períodos formais de avaliação de desempenho" action={podeGerenciar ? { label: "Novo Ciclo", to: "/performance/cycles/new" } : undefined} />

      <Card>
        <CardContent className="pt-6">
          {ciclos.length === 0 ? (
            <EmptyState title="Nenhum ciclo" description="Crie o primeiro ciclo de avaliação." action={podeGerenciar ? { label: "Novo Ciclo", to: "/performance/cycles/new" } : undefined} />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Data Início</TableHead>
                  <TableHead>Data Fim</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Progresso</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ciclos.map((c) => {
                  const prog = progressMap[c.id];
                  return (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium">{c.nome}</TableCell>
                      <TableCell className="text-sm">{c.dataInicio || "—"}</TableCell>
                      <TableCell className="text-sm">{c.dataFim || "—"}</TableCell>
                      <TableCell><Badge variant={c.status === "aberto" ? "success" : "default"}>{c.status}</Badge></TableCell>
                      <TableCell>
                        {prog ? (
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                              <div className="h-full rounded-full" style={{ width: `${prog.percentualConcluido}%`, backgroundColor: prog.percentualConcluido === PERCENT_COMPLETE ? "#22c55e" : prog.percentualConcluido > PERCENT_HALF ? "#6366f1" : "#f59e0b" }} />
                            </div>
                            <span className="text-xs text-muted-foreground">{prog.avaliacoesRealizadas}/{prog.totalColaboradores}</span>
                          </div>
                        ) : <span className="text-xs text-muted-foreground">—</span>}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {prog && (
                            <Button variant="ghost" size="sm" onClick={() => navigate(`/performance/cycles/${c.id}`)} aria-label="Ver progresso"><Eye className="h-4 w-4" /></Button>
                          )}
                          {podeGerenciar && (
                            <>
                              <Button variant="outline" size="sm" onClick={() => navigate(`/performance/cycles/${c.id}/edit`)}>Editar</Button>
                              <Button variant={c.status === "aberto" ? "destructive" : "outline"} size="sm" onClick={() => handleToggleStatus(c)}>
                                {c.status === "aberto" ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                                {c.status === "aberto" ? "Fechar" : "Abrir"}
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

    </div>
  );
}
