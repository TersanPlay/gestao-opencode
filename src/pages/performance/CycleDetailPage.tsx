import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { SearchInput } from "@/components/shared/SearchInput";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getCicloById, getCicloProgress, getAvaliacoes } from "@/services/api";
import { ChevronRight } from "lucide-react";
import type { CicloAvaliacao, CicloProgress, Avaliacao } from "@/types";

type Tab = "nao_avaliados" | "em_andamento" | "avaliados";

export function CycleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [ciclo, setCiclo] = useState<CicloAvaliacao | null>(null);
  const [progress, setProgress] = useState<CicloProgress | null>(null);
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("nao_avaliados");

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    Promise.all([getCicloById(id), getCicloProgress(id), getAvaliacoes({ cicloId: id })])
      .then(([c, p, avs]) => {
        setCiclo(c);
        setProgress(p);
        setAvaliacoes(avs);
      })
      .catch((err) => {
        setError(err.message || "Erro ao carregar dados do ciclo");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const { emProgresso, avaliados } = useMemo(() => {
    const pendingMap = new Map<string, { id: string; nome: string }>();
    const completedMap = new Map<string, { id: string; nome: string; nota: number; conceito: string }>();

    avaliacoes.forEach((av) => {
      if (av.status === "pending" && !completedMap.has(av.colaboradorId)) {
        if (!pendingMap.has(av.colaboradorId)) {
          pendingMap.set(av.colaboradorId, { id: av.colaboradorId, nome: av.colaboradorNome || "" });
        }
      }
      if (av.status === "completed" && !completedMap.has(av.colaboradorId)) {
        completedMap.set(av.colaboradorId, { id: av.colaboradorId, nome: av.colaboradorNome || "", nota: av.notaFinal, conceito: av.conceitoFinal });
        pendingMap.delete(av.colaboradorId);
      }
    });

    return {
      emProgresso: [...pendingMap.values()],
      avaliados: [...completedMap.values()],
    };
  }, [avaliacoes]);

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "nao_avaliados", label: "Não avaliados", count: progress?.pendentes.length ?? 0 },
    { key: "em_andamento", label: "Em andamento", count: emProgresso.length },
    { key: "avaliados", label: "Avaliados", count: avaliados.length },
  ];

  const tabHref: Record<Tab, React.ReactNode> = {
    nao_avaliados: null,
    em_andamento: null,
    avaliados: null,
  };

  const renderTabContent = () => {
    let items: { id: string; nome: string; nota?: number; conceito?: string }[] = [];

    if (activeTab === "nao_avaliados") {
      items = progress?.pendentes ?? [];
    } else if (activeTab === "em_andamento") {
      items = emProgresso;
    } else {
      items = avaliados;
    }

    const filtered = items.filter((i) => i.nome.toLowerCase().includes(search.toLowerCase()));

    if (items.length === 0) {
      if (activeTab === "nao_avaliados") {
        return <p className="text-center text-muted-foreground py-6">Todos os colaboradores foram avaliados neste ciclo.</p>;
      }
      if (activeTab === "em_andamento") {
        return <p className="text-center text-muted-foreground py-6">Nenhuma avaliação em andamento.</p>;
      }
      return <p className="text-center text-muted-foreground py-6">Nenhum colaborador avaliado ainda.</p>;
    }

    return (
      <div className="space-y-1">
        {filtered.map((i) => (
          <Button
            key={i.id}
            variant="ghost"
            className="w-full justify-between text-left h-auto py-2 px-3"
            onClick={() => navigate(`/performance/profiles/${i.id}`)}
          >
            <span>{i.nome}</span>
            <span className="flex items-center gap-2">
              {i.conceito && (
                <Badge variant={i.conceito === "Excelente" ? "success" : i.conceito === "Bom" ? "info" : i.conceito === "Regular" ? "warning" : "destructive"} className="text-xs">
                  {i.nota?.toFixed(1)} — {i.conceito}
                </Badge>
              )}
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </span>
          </Button>
        ))}
        {search && filtered.length === 0 && (
          <p className="text-sm text-muted-foreground py-2 text-center">Nenhum resultado para "{search}"</p>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Carregando..." />
        <Card><CardContent className="pt-6"><div className="h-40 flex items-center justify-center text-muted-foreground">Carregando dados do ciclo...</div></CardContent></Card>
      </div>
    );
  }

  if (error || !ciclo || !progress) {
    return (
      <div className="space-y-6">
        <PageHeader title="Ciclo não encontrado" />
        <EmptyState title="Erro ao carregar" description={error || "Ciclo não encontrado."} action={{ label: "Voltar para Ciclos", to: "/performance/cycles" }} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Progresso: ${ciclo.nome}`}
        description={`${ciclo.dataInicio || "—"} até ${ciclo.dataFim || "—"}`}
        action={{ label: "Voltar", to: "/performance/cycles" }}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-4xl font-bold text-indigo-600">{progress.percentualConcluido}%</p>
            <p className="text-sm text-muted-foreground mt-1">Concluído</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-4xl font-bold">{progress.avaliacoesRealizadas}/{progress.totalColaboradores}</p>
            <p className="text-sm text-muted-foreground mt-1">Avaliações</p>
          </CardContent>
        </Card>
      </div>

      {progress.mediaGeral != null && (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-4xl font-bold text-emerald-600">{progress.mediaGeral}</p>
            <p className="text-sm text-muted-foreground mt-1">Média geral</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-1 bg-muted p-1 rounded-lg">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => { setActiveTab(tab.key); setSearch(""); }}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    activeTab === tab.key
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>
            <SearchInput value={search} onChange={setSearch} placeholder="Filtrar por nome..." />
          </div>
          {renderTabContent()}
        </CardContent>
      </Card>
    </div>
  );
}
