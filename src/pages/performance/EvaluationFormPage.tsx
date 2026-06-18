import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { getCiclos, getCompetencias, createAvaliacao, finalizarAvaliacao, getAvaliacoes } from "@/services/api";
import { toast } from "sonner";
import type { CicloAvaliacao, Competencia, Avaliacao } from "@/types";

export function EvaluationFormPage() {
  const navigate = useNavigate();
  const { colaboradorId } = useParams();

  const [ciclos, setCiclos] = useState<CicloAvaliacao[]>([]);
  const [competencias, setCompetencias] = useState<Competencia[]>([]);
  const [avaliacoesAnteriores, setAvaliacoesAnteriores] = useState<Avaliacao[]>([]);
  const [cicloId, setCicloId] = useState("");
  const [tipo, setTipo] = useState("gestor");
  const [comentarios, setComentarios] = useState("");
  const [notas, setNotas] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!colaboradorId) return;
    Promise.all([
      getCiclos().then((c) => c.filter((x) => x.status === "aberto")),
      getCompetencias(),
      getAvaliacoes({ colaboradorId }),
    ]).then(([c, comps, avs]) => {
      setCiclos(c);
      setCompetencias(comps);
      setAvaliacoesAnteriores(avs.filter((a) => a.status === "completed"));
      if (c.length > 0) setCicloId(c[0].id);
      const initial: Record<string, number> = {};
      comps.forEach((cp) => { initial[cp.id] = 3; });
      setNotas(initial);
    }).finally(() => setLoading(false));
  }, [colaboradorId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cicloId) { toast.error("Selecione um ciclo"); return; }
    if (!colaboradorId) return;
    setSaving(true);
    try {
      const competenciasArr = Object.entries(notas).map(([competenciaId, nota]) => ({ competenciaId, nota }));
      const { id } = await createAvaliacao({ colaboradorId, cicloId, tipo, competencias: competenciasArr, comentarios: comentarios || undefined });
      await finalizarAvaliacao(id);
      toast.success("Avaliação concluída com sucesso");
      navigate(`/performance/profiles/${colaboradorId}`);
    } catch (err: any) {
      toast.error(err.message || "Erro ao salvar avaliação");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" /></div>;
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Nova Avaliação" description="Avalie o colaborador por competências" />

      {avaliacoesAnteriores.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-base">Avaliações Anteriores</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {avaliacoesAnteriores.slice(0, 5).map((av) => (
                <div key={av.id} className="text-sm p-3 rounded-lg border border-border">
                  <p className="font-medium">{av.cicloNome || "—"}</p>
                  <p className="text-muted-foreground">Nota: {av.notaFinal} · {av.conceitoFinal}</p>
                  <p className="text-muted-foreground">{av.avaliadorNome} ({av.tipo})</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <form onSubmit={handleSubmit}>
        <Card>
          <CardContent className="pt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ciclo">Ciclo de avaliação *</Label>
                <Select value={cicloId} onValueChange={setCicloId}>
                  <SelectTrigger id="ciclo"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                  <SelectContent>
                    {ciclos.map((c) => (<SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo de avaliação</Label>
                <Select value={tipo} onValueChange={setTipo}>
                  <SelectTrigger id="tipo"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="autoavaliacao">Autoavaliação</SelectItem>
                    <SelectItem value="gestor">Gestor</SelectItem>
                    <SelectItem value="colega">Colega</SelectItem>
                    <SelectItem value="liderado">Liderado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Competências (nota de 1 a 5)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {competencias.map((cp) => (
                  <div key={cp.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                    <div>
                      <p className="text-sm font-medium">{cp.nome}</p>
                      <p className="text-xs text-muted-foreground">{cp.descricao}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button key={n} type="button" onClick={() => setNotas({ ...notas, [cp.id]: n })}
                          className={`w-8 h-8 rounded-full text-xs font-medium transition-all ${(notas[cp.id] || 3) >= n ? "bg-indigo-600 text-white" : "bg-muted text-muted-foreground hover:bg-accent"}`}
                        >{n}</button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="comentarios">Comentários do avaliador</Label>
              <Textarea id="comentarios" value={comentarios} onChange={(e) => setComentarios(e.target.value)} rows={4} placeholder="Registre observações qualitativas sobre o desempenho..." />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancelar</Button>
              <Button type="submit" variant="indigo" disabled={saving}>{saving ? "Salvando..." : "Finalizar Avaliação"}</Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
