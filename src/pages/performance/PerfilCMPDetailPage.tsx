import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";
import { getColaboradorById, getAvaliacoes, getAvaliacaoById, getFeedbacks, getMetas, getPDIs, getHistorico, deleteMeta, deletePDI } from "@/services/api";
import { Plus, Target, BookOpen, Star, ClipboardCheck, MessageSquare, History, Pencil, Trash2, Eye } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import type { Colaborador, Avaliacao, Feedback, Meta, PDI, HistoricoColaborador } from "@/types";

const statusColors: Record<string, "success" | "warning" | "destructive" | "default"> = {
  ativo: "success", afastado: "warning", desligado: "destructive",
};

const conceitoColors: Record<string, "success" | "warning" | "destructive" | "info" | "default"> = {
  Excelente: "success", Bom: "info", Regular: "warning", Ruim: "destructive", Insatisfatorio: "destructive",
};

type Tab = "resumo" | "avaliacoes" | "feedbacks" | "metas" | "pdi" | "historico";

const tabs: { key: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "resumo", label: "Resumo", icon: Star },
  { key: "avaliacoes", label: "Avaliações", icon: ClipboardCheck },
  { key: "feedbacks", label: "Feedbacks", icon: MessageSquare },
  { key: "metas", label: "Metas", icon: Target },
  { key: "pdi", label: "PDI", icon: BookOpen },
  { key: "historico", label: "Histórico", icon: History },
];

export function PerfilCMPDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { can } = useAuth();

  const [colaborador, setColaborador] = useState<Colaborador | null>(null);
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [metas, setMetas] = useState<Meta[]>([]);
  const [pdis, setPDIs] = useState<PDI[]>([]);
  const [historico, setHistorico] = useState<HistoricoColaborador[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>("resumo");
  const [loading, setLoading] = useState(true);

  const [avModal, setAvModal] = useState<{ open: boolean; competencias: any[]; comentarios: string; avaliador: string; ciclo: string }>({ open: false, competencias: [], comentarios: "", avaliador: "", ciclo: "" });

  const podeGerenciar = can("create", "performance");

  const loadData = () => {
    if (!id) return;
    Promise.all([
      getColaboradorById(id),
      getAvaliacoes({ colaboradorId: id }),
      getFeedbacks({ colaboradorId: id }),
      getMetas({ colaboradorId: id }),
      getPDIs({ colaboradorId: id }),
      getHistorico(id),
    ]).then(([col, av, fb, mt, pd, hist]) => {
      setColaborador(col);
      setAvaliacoes(av);
      setFeedbacks(fb);
      setMetas(mt);
      setPDIs(pd);
      setHistorico(hist);
    }).catch(() => toast.error("Erro ao carregar dados")).finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, [id]);

  const handleViewAvaliacao = async (avId: string) => {
    try {
      const data = await getAvaliacaoById(avId);
      setAvModal({ open: true, competencias: data.competencias || [], comentarios: data.comentarios || "", avaliador: data.avaliadorNome || "", ciclo: data.cicloNome || "" });
    } catch { toast.error("Erro ao carregar avaliação"); }
  };

  const handleDeleteMeta = async (meta: Meta) => {
    if (!confirm(`Excluir meta "${meta.nome}"?`)) return;
    try { await deleteMeta(meta.id); toast.success("Meta excluída"); loadData(); } catch (err: any) { toast.error(err.message || "Erro ao excluir"); }
  };

  const handleDeletePDI = async (pdi: PDI) => {
    if (!confirm(`Excluir PDI "${pdi.objetivo}"?`)) return;
    try { await deletePDI(pdi.id); toast.success("PDI excluído"); loadData(); } catch (err: any) { toast.error(err.message || "Erro ao excluir"); }
  };

  if (loading || !colaborador) {
    return <div className="flex items-center justify-center h-64"><div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" /></div>;
  }

  return (
    <div className="space-y-6">
      <PageHeader title={colaborador.nome} description={`Matrícula: ${colaborador.matricula || "—"} · CPF: ${colaborador.cpf || "—"}`} action={podeGerenciar ? { label: "Editar", to: `/performance/profiles/${id}/edit` } : undefined} />

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <Avatar name={colaborador.nome} size="lg" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-2 text-sm flex-1">
              <div><span className="text-muted-foreground">Cargo:</span> {colaborador.cargo || "—"}</div>
              <div><span className="text-muted-foreground">Lotação:</span> {colaborador.departamentoNome || "—"}</div>
              <div><span className="text-muted-foreground">Função:</span> {colaborador.funcao || "—"}</div>
              <div><span className="text-muted-foreground">Vínculo:</span> {colaborador.vinculo || "—"}</div>
              <div><span className="text-muted-foreground">Admissão:</span> {colaborador.dataAdmissao || "—"}</div>
              <div><span className="text-muted-foreground">CH semanal:</span> {colaborador.cargaHoraria || "—"}h</div>
              <div><span className="text-muted-foreground">Ano/Mês ref.:</span> {colaborador.ano || "—"}{colaborador.mes ? `/${colaborador.mes}` : ""}</div>
              <div><span className="text-muted-foreground">Desligamento:</span> {colaborador.dataDesligamento || "—"}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {(colaborador.totalAvaliacoes ?? 0) > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card><CardContent className="pt-6 text-center"><p className="text-2xl font-bold text-indigo-600">{colaborador.notaMedia ?? "—"}</p><p className="text-xs text-muted-foreground">Média geral</p></CardContent></Card>
          <Card><CardContent className="pt-6 text-center"><p className="text-2xl font-bold">{colaborador.totalAvaliacoes}</p><p className="text-xs text-muted-foreground">Avaliações</p></CardContent></Card>
          <Card><CardContent className="pt-6 text-center"><p className="text-2xl font-bold text-emerald-600">{colaborador.metasConcluidas}</p><p className="text-xs text-muted-foreground">Metas concluídas</p></CardContent></Card>
          <Card><CardContent className="pt-6 text-center"><p className="text-2xl font-bold text-amber-600">{colaborador.pdisAtivos}</p><p className="text-xs text-muted-foreground">PDIs ativos</p></CardContent></Card>
        </div>
      )}

      <Card>
        <div className="flex border-b border-border overflow-x-auto">
          {tabs.map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.key ? "border-indigo-600 text-indigo-600" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            ><tab.icon className="h-4 w-4" />{tab.label}</button>
          ))}
        </div>

        <CardContent className="pt-6">
          {activeTab === "resumo" && (
            <div className="space-y-6">
              {colaborador.ultimaAvaliacao && (
                <Card>
                  <CardHeader><CardTitle className="text-base">Última Avaliação</CardTitle></CardHeader>
                  <CardContent className="text-sm space-y-1">
                    <p><span className="text-muted-foreground">Ciclo:</span> {colaborador.ultimaAvaliacao.cicloNome || "—"}</p>
                    <p><span className="text-muted-foreground">Avaliador:</span> {colaborador.ultimaAvaliacao.avaliadorNome || "—"}</p>
                    <div className="text-sm"><span className="text-muted-foreground">Nota final:</span> {colaborador.ultimaAvaliacao.notaFinal} <Badge variant={conceitoColors[colaborador.ultimaAvaliacao.conceitoFinal] || "default"}>{colaborador.ultimaAvaliacao.conceitoFinal}</Badge></div>
                  </CardContent>
                </Card>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card><CardHeader><CardTitle className="text-base flex items-center gap-2"><Target className="h-4 w-4" /> Metas em andamento</CardTitle></CardHeader>
                  <CardContent>{metas.filter((m) => m.status !== "completed").length === 0 ? <p className="text-sm text-muted-foreground">Nenhuma</p> : <ul className="space-y-2">{metas.filter((m) => m.status !== "completed").map((m) => <li key={m.id} className="text-sm flex justify-between"><span>{m.nome}</span><Badge variant={m.status === "in_progress" ? "warning" : "default"}>{m.status}</Badge></li>)}</ul>}</CardContent>
                </Card>
                <Card><CardHeader><CardTitle className="text-base flex items-center gap-2"><BookOpen className="h-4 w-4" /> PDIs ativos</CardTitle></CardHeader>
                  <CardContent>{pdis.filter((p) => p.status !== "completed").length === 0 ? <p className="text-sm text-muted-foreground">Nenhum</p> : <ul className="space-y-2">{pdis.filter((p) => p.status !== "completed").map((p) => <li key={p.id} className="text-sm flex justify-between"><span>{p.objetivo}</span><Badge variant={p.status === "in_progress" ? "warning" : "default"}>{p.status}</Badge></li>)}</ul>}</CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "avaliacoes" && (
            <div className="space-y-4">
              {podeGerenciar && <Button variant="indigo" onClick={() => navigate(`/performance/evaluations/new/${id}`)}><Plus className="h-4 w-4 mr-1" /> Nova Avaliação</Button>}
              {avaliacoes.length === 0 ? <EmptyState title="Nenhuma avaliação" description="Ainda não há avaliações registradas." /> : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ciclo</TableHead>
                      <TableHead>Avaliador</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Nota</TableHead>
                      <TableHead>Conceito</TableHead>
                      <TableHead>Comentários</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {avaliacoes.map((a) => (
                      <TableRow key={a.id}>
                        <TableCell className="text-sm">{a.cicloNome || "—"}</TableCell>
                        <TableCell>{a.avaliadorNome || "—"}</TableCell>
                        <TableCell><Badge variant="outline">{a.tipo}</Badge></TableCell>
                        <TableCell className="font-semibold">{a.notaFinal || "—"}</TableCell>
                        <TableCell>{a.conceitoFinal && <Badge variant={conceitoColors[a.conceitoFinal]}>{a.conceitoFinal}</Badge>}</TableCell>
                        <TableCell className="text-sm max-w-[150px] truncate">{a.comentarios || "—"}</TableCell>
                        <TableCell><Badge variant={a.status === "completed" ? "success" : "warning"}>{a.status}</Badge></TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => handleViewAvaliacao(a.id)} aria-label="Ver detalhes"><Eye className="h-4 w-4" /></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          )}

          {activeTab === "feedbacks" && (
            <div className="space-y-4">
              {<Button variant="indigo" onClick={() => navigate(`/performance/feedbacks/new/${id}`)}><Plus className="h-4 w-4 mr-1" /> Novo Feedback</Button>}
              {feedbacks.length === 0 ? <EmptyState title="Nenhum feedback" description="Ainda não há feedbacks registrados." /> : (
                <Table>
                  <TableHeader>
                    <TableRow><TableHead>Data</TableHead><TableHead>Autor</TableHead><TableHead>Tipo</TableHead><TableHead>Comentário</TableHead><TableHead>Status</TableHead></TableRow>
                  </TableHeader>
                  <TableBody>
                    {feedbacks.map((f) => (
                      <TableRow key={f.id}>
                        <TableCell className="text-sm">{new Date(f.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>{f.autorNome || "—"}</TableCell>
                        <TableCell><Badge variant="outline">{f.tipo}</Badge></TableCell>
                        <TableCell className="text-sm max-w-xs truncate">{f.comentario}</TableCell>
                        <TableCell><Badge variant={f.status === "completed" ? "success" : "warning"}>{f.status}</Badge></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          )}

          {activeTab === "metas" && (
            <div className="space-y-4">
              {podeGerenciar && <Button variant="indigo" onClick={() => navigate(`/performance/metas/new/${id}`)}><Plus className="h-4 w-4 mr-1" /> Nova Meta</Button>}
              {metas.length === 0 ? <EmptyState title="Nenhuma meta" description="Ainda não há metas cadastradas." /> : (
                <Table>
                  <TableHeader>
                    <TableRow><TableHead>Objetivo</TableHead><TableHead>Prazo</TableHead><TableHead>%</TableHead><TableHead>Resultado</TableHead><TableHead>Status</TableHead><TableHead>Responsável</TableHead>{podeGerenciar && <TableHead className="text-right">Ações</TableHead>}</TableRow>
                  </TableHeader>
                  <TableBody>
                    {metas.map((m) => (
                      <TableRow key={m.id}>
                        <TableCell className="font-medium">{m.nome}</TableCell>
                        <TableCell className="text-sm">{m.prazo || "—"}</TableCell>
                        <TableCell><div className="flex items-center gap-2"><div className="w-16 h-2 bg-muted rounded-full overflow-hidden"><div className="h-full bg-indigo-500 rounded-full" style={{ width: `${m.percentualConclusao}%` }} /></div><span className="text-xs">{m.percentualConclusao}%</span></div></TableCell>
                        <TableCell className="text-sm max-w-[120px] truncate">{m.resultadoObtido || "—"}</TableCell>
                        <TableCell><Badge variant={m.status === "completed" ? "success" : m.status === "in_progress" ? "warning" : "default"}>{m.status}</Badge></TableCell>
                        <TableCell className="text-sm">{m.responsavelNome || "—"}</TableCell>
                        {podeGerenciar && (
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button variant="ghost" size="sm" onClick={() => navigate(`/performance/metas/${m.id}/edit`)} aria-label="Editar"><Pencil className="h-4 w-4" /></Button>
                              <Button variant="ghost" size="sm" onClick={() => handleDeleteMeta(m)} aria-label="Excluir"><Trash2 className="h-4 w-4 text-rose-500" /></Button>
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          )}

          {activeTab === "pdi" && (
            <div className="space-y-4">
              {podeGerenciar && <Button variant="indigo" onClick={() => navigate(`/performance/pdi/new/${id}`)}><Plus className="h-4 w-4 mr-1" /> Novo PDI</Button>}
              {pdis.length === 0 ? <EmptyState title="Nenhum PDI" description="Ainda não há planos de desenvolvimento cadastrados." /> : (
                <Table>
                  <TableHeader>
                    <TableRow><TableHead>Objetivo</TableHead><TableHead>Prazo</TableHead><TableHead>Status</TableHead><TableHead>Responsável</TableHead><TableHead>Evidências</TableHead><TableHead>Observações</TableHead>{podeGerenciar && <TableHead className="text-right">Ações</TableHead>}</TableRow>
                  </TableHeader>
                  <TableBody>
                    {pdis.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell className="font-medium">{p.objetivo}</TableCell>
                        <TableCell className="text-sm">{p.prazo || "—"}</TableCell>
                        <TableCell><Badge variant={p.status === "completed" ? "success" : p.status === "in_progress" ? "warning" : "default"}>{p.status}</Badge></TableCell>
                        <TableCell className="text-sm">{p.responsavelNome || "—"}</TableCell>
                        <TableCell className="text-sm max-w-[120px] truncate">{p.evidencias || "—"}</TableCell>
                        <TableCell className="text-sm max-w-[120px] truncate">{p.observacoes || "—"}</TableCell>
                        {podeGerenciar && (
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button variant="ghost" size="sm" onClick={() => navigate(`/performance/pdi/${p.id}/edit`)} aria-label="Editar"><Pencil className="h-4 w-4" /></Button>
                              <Button variant="ghost" size="sm" onClick={() => handleDeletePDI(p)} aria-label="Excluir"><Trash2 className="h-4 w-4 text-rose-500" /></Button>
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          )}

          {activeTab === "historico" && (
            <div className="space-y-4">
              {historico.length === 0 ? <EmptyState title="Nenhum evento" description="Ainda não há eventos no histórico." /> : (
                <div className="relative pl-6 border-l-2 border-muted space-y-6">
                  {historico.map((h) => {
                    const colors: Record<string, string> = { admissao: "bg-emerald-500", desligamento: "bg-rose-500", avaliacao: "bg-indigo-500", promocao: "bg-amber-500", meta: "bg-blue-500", pdi: "bg-violet-500", feedback: "bg-cyan-500", cargo: "bg-orange-500", lotacao: "bg-gray-500" };
                    const labels: Record<string, string> = { admissao: "A", desligamento: "D", avaliacao: "Av", promocao: "P", meta: "M", pdi: "Pd", feedback: "Fb", cargo: "C", lotacao: "L" };
                    return (
                      <div key={h.id} className="relative">
                        <div className={`absolute -left-[25px] w-4 h-4 rounded-full border-2 border-white ${colors[h.tipo] || "bg-gray-400"} flex items-center justify-center text-[7px] font-bold text-white`}>{labels[h.tipo] || "•"}</div>
                        <div className="ml-2"><p className="text-sm">{h.descricao}</p><p className="text-xs text-muted-foreground">{h.dataReferencia || new Date(h.createdAt).toLocaleDateString()}</p></div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={avModal.open} onOpenChange={(o) => setAvModal({ ...avModal, open: o })} title="Detalhes da Avaliação" description={`Avaliador: ${avModal.avaliador} · Ciclo: ${avModal.ciclo}`}>
        <div className="space-y-4 pt-2">
          {avModal.competencias.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow><TableHead>Competência</TableHead><TableHead className="text-right">Nota</TableHead></TableRow>
              </TableHeader>
              <TableBody>
                {avModal.competencias.map((c: any) => (
                  <TableRow key={c.id || c.competenciaId}>
                    <TableCell>{c.competenciaNome || "—"}</TableCell>
                    <TableCell className="text-right font-semibold">{c.nota}/5</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          {avModal.comentarios && (
            <div><p className="text-sm font-medium mb-1">Comentários:</p><p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">{avModal.comentarios}</p></div>
          )}
        </div>
      </Dialog>
    </div>
  );
}
