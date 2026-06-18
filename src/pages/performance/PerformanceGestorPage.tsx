import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getDashboardPerformanceGestor } from "@/services/api";
import { toast } from "sonner";
import { Users, ClipboardCheck, Clock, BookOpen, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";
import type { DashboardPerformanceGestor } from "@/types";

export function PerformanceGestorPage() {
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardPerformanceGestor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardPerformanceGestor()
      .then(setData)
      .catch((err) => {
        toast.error(err.message || "Erro ao carregar dashboard");
        setData({
          totalEquipe: 0, equipeAvaliada: 0, avaliacoesPendentes: 0,
          pdisPendentes: 0, metasAtrasadas: 0, destaques: [], baixoDesempenho: [],
        });
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" /></div>;
  }

  if (!data) return null;

  const cards = [
    { title: "Total da Equipe", value: data.totalEquipe, icon: Users, color: "text-blue-600" },
    { title: "Equipe Avaliada", value: data.equipeAvaliada, icon: ClipboardCheck, color: "text-emerald-600" },
    { title: "Avaliações Pendentes", value: data.avaliacoesPendentes, icon: Clock, color: "text-amber-600" },
    { title: "PDIs Pendentes", value: data.pdisPendentes, icon: BookOpen, color: "text-violet-600" },
    { title: "Metas Atrasadas", value: data.metasAtrasadas, icon: AlertTriangle, color: "text-rose-600" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard da Equipe" description="Indicadores de desempenho da sua equipe" />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {cards.map((c) => (
          <Card key={c.title}>
            <CardContent className="pt-6 text-center">
              <c.icon className={`h-6 w-6 ${c.color} mx-auto mb-2`} />
              <p className="text-2xl font-bold">{c.value}</p>
              <p className="text-xs text-muted-foreground">{c.title}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><TrendingUp className="h-4 w-4 text-emerald-600" /> Destaques da Equipe</CardTitle>
          </CardHeader>
          <CardContent>
            {data.destaques.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum dado disponível</p>
            ) : (
              <ul className="space-y-3">
                {data.destaques.map((d) => (
                  <li key={d.id} className="flex items-center justify-between">
                    <button onClick={() => navigate(`/performance/profiles/${d.id}`)} className="text-sm font-medium hover:text-indigo-600 transition-colors">{d.nome}</button>
                    <Badge variant="success">{d.notaMedia}</Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><TrendingDown className="h-4 w-4 text-rose-600" /> Baixo Desempenho</CardTitle>
          </CardHeader>
          <CardContent>
            {data.baixoDesempenho.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum dado disponível</p>
            ) : (
              <ul className="space-y-3">
                {data.baixoDesempenho.map((d) => (
                  <li key={d.id} className="flex items-center justify-between">
                    <button onClick={() => navigate(`/performance/profiles/${d.id}`)} className="text-sm font-medium hover:text-indigo-600 transition-colors">{d.nome}</button>
                    <Badge variant="destructive">{d.notaMedia}</Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
