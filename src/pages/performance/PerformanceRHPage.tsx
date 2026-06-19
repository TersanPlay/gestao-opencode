import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardPerformanceRH } from "@/services/api";
import { Users, ClipboardCheck, Clock, Star, TrendingUp, BarChart3, Target, ArrowRight } from "lucide-react";
import type { DashboardPerformanceRH } from "@/types";

export function PerformanceRHPage() {
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardPerformanceRH | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardPerformanceRH().then(setData).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" /></div>;
  }

  if (!data) return null;

  const cards = [
    { title: "Colaboradores", value: data.totalColaboradores, icon: Users, color: "text-blue-600", to: "/performance/profiles" },
    { title: "Avaliações Realizadas", value: data.avaliacoesRealizadas, icon: ClipboardCheck, color: "text-emerald-600" },
    { title: "Avaliações Pendentes", value: data.avaliacoesPendentes, icon: Clock, color: "text-amber-600" },
    { title: "Média Geral", value: data.mediaGeral.toFixed(2), icon: Star, color: "text-indigo-600" },
    { title: "Ciclos Abertos", value: data.ciclosAbertos, icon: BarChart3, color: "text-violet-600", to: "/performance/cycles" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard RH" description="Indicadores gerais de desempenho da organização" />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {cards.map((c) => {
          const Wrapper = c.to ? "button" : "div";
          const wrapperProps = c.to ? { onClick: () => navigate(c.to!), className: "cursor-pointer text-center" } : { className: "text-center" };
          return (
            <Card key={c.title}>
              <CardContent className={`pt-6 ${c.to ? "p-0" : ""}`}>
                <Wrapper {...wrapperProps}>
                  {c.to && <div className="pt-6 px-4 pb-4"><c.icon className={`h-6 w-6 ${c.color} mx-auto mb-2`} /><p className="text-2xl font-bold">{c.value}</p><p className="text-xs text-muted-foreground">{c.title}</p></div>}
                  {!c.to && <><c.icon className={`h-6 w-6 ${c.color} mx-auto mb-2`} /><p className="text-2xl font-bold">{c.value}</p><p className="text-xs text-muted-foreground">{c.title}</p></>}
                </Wrapper>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><TrendingUp className="h-4 w-4 text-emerald-600" /> Melhores Competências</CardTitle>
          </CardHeader>
          <CardContent>
            {data.melhoresCompetencias.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhuma avaliação concluída</p>
            ) : (
              <ul className="space-y-3">
                {data.melhoresCompetencias.map((c, i) => (
                  <li key={i} className="flex items-center justify-between">
                    <span className="text-sm">{c.nome}</span>
                    <span className="text-sm font-semibold text-emerald-600">{c.media}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><Target className="h-4 w-4 text-rose-600" /> Competências a Desenvolver</CardTitle>
          </CardHeader>
          <CardContent>
            {data.pioresCompetencias.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhuma avaliação concluída</p>
            ) : (
              <ul className="space-y-3">
                {data.pioresCompetencias.map((c, i) => (
                  <li key={i} className="flex items-center justify-between">
                    <span className="text-sm">{c.nome}</span>
                    <span className="text-sm font-semibold text-rose-600">{c.media}</span>
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
