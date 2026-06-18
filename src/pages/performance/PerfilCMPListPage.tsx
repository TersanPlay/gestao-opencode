import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/shared/PageHeader";
import { SearchInput } from "@/components/shared/SearchInput";
import { EmptyState } from "@/components/shared/EmptyState";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { getColaboradores, getDepartments, getUsers } from "@/services/api";
import { Target, BookOpen, CheckCircle2, Clock, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import type { Colaborador, Department, User, PaginatedResponse } from "@/types";

const statusColors: Record<string, "success" | "warning" | "destructive" | "default"> = {
  ativo: "success", afastado: "warning", desligado: "destructive",
};

const evalStatusConfig: Record<string, { label: string; variant: "success" | "warning" | "default"; icon: React.ComponentType<{ className?: string }> }> = {
  em_dia: { label: "Em dia", variant: "success", icon: CheckCircle2 },
  pendente: { label: "Pendente", variant: "warning", icon: Clock },
  nunca_avaliado: { label: "Nunca avaliado", variant: "default", icon: AlertCircle },
};

export function PerfilCMPListPage() {
  const navigate = useNavigate();
  const [colaboradores, setColaboradores] = useState<Colaborador[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [gestores, setGestores] = useState<User[]>([]);
  const [cargos, setCargos] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [filtroDept, setFiltroDept] = useState("");
  const [filtroCargo, setFiltroCargo] = useState("");
  const [filtroGestor, setFiltroGestor] = useState("");
  const [filtroVinculo, setFiltroVinculo] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);

  const loadData = (params?: any, isSearch?: boolean) => {
    if (isSearch) { setSearching(true); } else { setLoading(true); }
    Promise.all([
      getColaboradores(params),
      getDepartments(),
      getUsers(),
    ]).then(([resp, depts, users]) => {
      setColaboradores(resp.data);
      setTotalPages(resp.totalPages);
      const gest = users.filter((u) => u.role === "gestor" || u.role === "admin");
      setGestores(gest);
      setPage(resp.page);
      const uniqueCargos = [...new Set(resp.data.map((c) => c.cargo).filter(Boolean))] as string[];
      setCargos(uniqueCargos);
    }).finally(() => { setLoading(false); setSearching(false); });
  };

  useEffect(() => { loadData(); }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadData({
        search: search || undefined,
        departamentoId: filtroDept || undefined,
        cargo: filtroCargo || undefined,
        gestorId: filtroGestor || undefined,
        vinculo: filtroVinculo || undefined,
        page,
        pageSize: 50,
      }, true);
    }, 400);
    return () => clearTimeout(timer);
  }, [search, filtroDept, filtroCargo, filtroGestor, filtroVinculo, page]);

  const goToPage = (p: number) => {
    if (p < 1 || p > totalPages) return;
    setPage(p);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" /></div>;
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Perfil-CMP" description="Gerenciamento de colaboradores para avaliação de desempenho" action={{ label: "Novo Colaborador", to: "/performance/profiles/new" }} />

      <Card>
        <CardContent className="pt-6 relative">
          {searching && <div className="absolute top-0 left-0 right-0 h-0.5 bg-indigo-100 overflow-hidden rounded-t-xl"><div className="h-full w-1/3 bg-indigo-600 rounded-full" style={{ animation: "indeterminate 1.4s ease-in-out infinite" }} /></div>}
          <div className="flex flex-wrap gap-3 mb-6">
            <div className="w-full sm:w-56">
              <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Buscar por nome, matrícula ou e-mail..." />
            </div>
            <div className="w-full sm:w-44">
              <Label htmlFor="filter-dept" className="sr-only">Departamento</Label>
              <Select value={filtroDept} onValueChange={(v) => { setFiltroDept(v); setPage(1); }}>
                <SelectTrigger id="filter-dept"><SelectValue placeholder="Departamento" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  {departments.map((d) => (<SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full sm:w-44">
              <Label htmlFor="filter-cargo" className="sr-only">Cargo</Label>
              <Select value={filtroCargo} onValueChange={(v) => { setFiltroCargo(v); setPage(1); }}>
                <SelectTrigger id="filter-cargo"><SelectValue placeholder="Cargo" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  {cargos.map((c) => (<SelectItem key={c} value={c}>{c}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full sm:w-44">
              <Label htmlFor="filter-gestor" className="sr-only">Gestor</Label>
              <Select value={filtroGestor} onValueChange={(v) => { setFiltroGestor(v); setPage(1); }}>
                <SelectTrigger id="filter-gestor"><SelectValue placeholder="Gestor" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  {gestores.map((g) => (<SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full sm:w-36">
              <Label htmlFor="filter-vinculo" className="sr-only">Vínculo</Label>
              <Select value={filtroVinculo} onValueChange={(v) => { setFiltroVinculo(v); setPage(1); }}>
                <SelectTrigger id="filter-vinculo"><SelectValue placeholder="Vínculo" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  <SelectItem value="Efetivo">Efetivo</SelectItem>
                  <SelectItem value="Comissionado">Comissionado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {colaboradores.length === 0 ? (
            <EmptyState title="Nenhum colaborador encontrado" description="Cadastre o primeiro colaborador para iniciar as avaliações de desempenho." action={{ label: "Novo Colaborador", to: "/performance/profiles/new" }} />
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {colaboradores.map((col) => {
                  const EvalIcon = evalStatusConfig[col.statusAvaliacao || "nunca_avaliado"]?.icon || AlertCircle;
                  return (
                    <button key={col.id} onClick={() => navigate(`/performance/profiles/${col.id}`)}
                      className="text-left w-full rounded-xl border border-border bg-card text-card-foreground shadow-sm p-4 hover:shadow-md hover:border-indigo-200 transition-all duration-200 cursor-pointer"
                    >
                      <div className="flex items-start gap-4">
                        <Avatar name={col.nome} size="lg" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-sm truncate">{col.nome}</span>
                            <Badge variant={statusColors[col.status] || "default"}>{col.status}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">{col.matricula && `${col.matricula} · `}{col.cargo}</p>
                          <p className="text-xs text-muted-foreground">{col.departamentoNome || "Sem lotação"}</p>
                          {col.ano && <p className="text-xs text-muted-foreground">{col.ano}{col.mes ? `/${col.mes}` : ""}</p>}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center gap-1 text-xs">
                          <EvalIcon className={`h-3 w-3 ${col.statusAvaliacao === "em_dia" ? "text-emerald-500" : col.statusAvaliacao === "pendente" ? "text-amber-500" : "text-muted-foreground"}`} />
                          <span className="text-muted-foreground">{evalStatusConfig[col.statusAvaliacao || "nunca_avaliado"]?.label || "Nunca avaliado"}</span>
                        </div>
                      </div>

                      {col.ultimaAvaliacao && (
                        <p className="text-[11px] text-muted-foreground mt-1">
                          Última: {col.ultimaAvaliacao.notaFinal} ({col.ultimaAvaliacao.conceitoFinal}) · {col.ultimaAvaliacao.cicloNome || ""}
                        </p>
                      )}

                      <div className="flex items-center gap-4 mt-2 pt-2 border-t border-border">
                        {col.notaMedia != null && (
                          <div className="text-center">
                            <p className="text-lg font-bold text-indigo-600">{col.notaMedia}</p>
                            <p className="text-[10px] text-muted-foreground">Média</p>
                          </div>
                        )}
                        <div className="text-center">
                          <div className="flex items-center gap-1 text-muted-foreground"><Target className="h-3.5 w-3.5" /><span className="text-sm font-medium">{col.metasAtivas}</span></div>
                          <p className="text-[10px] text-muted-foreground">Metas</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center gap-1 text-muted-foreground"><BookOpen className="h-3.5 w-3.5" /><span className="text-sm font-medium">{col.pdisAtivos}</span></div>
                          <p className="text-[10px] text-muted-foreground">PDIs</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                  <Button variant="outline" size="sm" onClick={() => goToPage(page - 1)} disabled={page <= 1}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
                    .map((p, idx, arr) => (
                      <span key={p} className="flex items-center">
                        {idx > 0 && arr[idx - 1] !== p - 1 && <span className="px-1 text-muted-foreground">...</span>}
                        <Button
                          variant={p === page ? "default" : "outline"}
                          size="sm"
                          className="min-w-[36px]"
                          onClick={() => goToPage(p)}
                        >
                          {p}
                        </Button>
                      </span>
                    ))}
                  <Button variant="outline" size="sm" onClick={() => goToPage(page + 1)} disabled={page >= totalPages}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
