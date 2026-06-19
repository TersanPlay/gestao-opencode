import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { getDashboardPerformanceColaborador } from "@/services/api";
import { Star, Target, BookOpen, MessageSquare, TrendingUp, TrendingDown, ArrowRight } from "lucide-react";
import type { DashboardPerformanceColaborador } from "@/types";

export function PerformanceColaboradorPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [data, setData] = useState<DashboardPerformanceColaborador | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    getDashboardPerformanceColaborador(String(user.id)).then((d) => {
      setData(d);
    }).catch(() => {
      setData(null);
    }).finally(() => setLoading(false));
  }, [user]);

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" /></div>;
  }

  if (!data || !data.colaboradorNome) {
    return (
      <div className="space-y-6">
        <PageHeader title="Meu Desempenho" description="Acompanhe sua evolução individual" />
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <p className="text-muted-foreground">Nenhum colaborador vinculado a este usuário.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Meu Desempenho" description={`Olá, ${data.colaboradorNome}`} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <Star className="h-6 w-6 text-indigo-600 mx-auto mb-2" />
            {data.ultimaAvaliacao ? (
              <Button variant="ghost" className="h-auto p-0 flex-col" onClick={() => data.colaboradorId && navigate(`/performance/profiles/${data.colaboradorId}`)}>
                <p className="text-2xl font-bold text-indigo-600">{data.ultimaAvaliacao.notaFinal}</p>
                <Badge className="mt-1">{data.ultimaAvaliacao.conceitoFinal}</Badge>
                <p className="text-[10px] text-muted-foreground mt-1">{data.ultimaAvaliacao.cicloNome}</p>
              </Button>
            ) : (
              <p className="text-sm text-muted-foreground pt-2">Nenhuma avaliação</p>
            )}
            <p className="text-xs text-muted-foreground mt-1">Última avaliação</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent
            className="pt-6 text-center cursor-pointer hover:bg-accent/50 transition-colors rounded-xl"
            onClick={() => data.colaboradorId && navigate(`/performance/profiles/${data.colaboradorId}`)}
          >
            <Target className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold">{data.metasEmAndamento}</p>
            <p className="text-xs text-muted-foreground">Metas em andamento</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent
            className="pt-6 text-center cursor-pointer hover:bg-accent/50 transition-colors rounded-xl"
            onClick={() => data.colaboradorId && navigate(`/performance/profiles/${data.colaboradorId}`)}
          >
            <BookOpen className="h-6 w-6 text-violet-600 mx-auto mb-2" />
            <p className="text-2xl font-bold">{data.pdiEmAndamento}</p>
            <p className="text-xs text-muted-foreground">PDIs ativos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent
            className="pt-6 text-center cursor-pointer hover:bg-accent/50 transition-colors rounded-xl"
            onClick={() => data.colaboradorId && navigate(`/performance/profiles/${data.colaboradorId}`)}
          >
            <MessageSquare className="h-6 w-6 text-cyan-600 mx-auto mb-2" />
            <p className="text-2xl font-bold">{data.feedbacksRecebidos}</p>
            <p className="text-xs text-muted-foreground">Feedbacks recebidos</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><TrendingUp className="h-4 w-4 text-emerald-600" /> Competências com melhor desempenho</CardTitle></CardHeader>
          <CardContent>
            {data.melhoresCompetencias.length === 0 ? <p className="text-sm text-muted-foreground">Nenhuma avaliação concluída</p> : (
              <ul className="space-y-3">
                {data.melhoresCompetencias.map((c, i) => (
                  <li key={i} className="flex items-center justify-between"><span className="text-sm">{c.nome}</span><span className="text-sm font-semibold text-emerald-600">{c.media}</span></li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><TrendingDown className="h-4 w-4 text-rose-600" /> Competências a desenvolver</CardTitle></CardHeader>
          <CardContent>
            {data.pioresCompetencias.length === 0 ? <p className="text-sm text-muted-foreground">Nenhuma avaliação concluída</p> : (
              <ul className="space-y-3">
                {data.pioresCompetencias.map((c, i) => (
                  <li key={i} className="flex items-center justify-between"><span className="text-sm">{c.nome}</span><span className="text-sm font-semibold text-rose-600">{c.media}</span></li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
