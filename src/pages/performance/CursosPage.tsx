import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { EmptyState } from "@/components/shared/EmptyState";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getCursos, createCurso, updateCurso, deleteCurso, getAllVinculos, vincularCurso, deleteVinculoCurso, getColaboradores } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Users, Link, Unlink } from "lucide-react";
import type { Curso, CursoColaborador } from "@/types";

export function CursosPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const podeGerenciar = user?.role === "admin" || user?.role === "gestor";
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editando, setEditando] = useState<Curso | null>(null);
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [cargaHoraria, setCargaHoraria] = useState("");
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Curso | null>(null);

  const [vinculoDialog, setVinculoDialog] = useState(false);
  const [vinculoCurso, setVinculoCurso] = useState<Curso | null>(null);
  const [vinculos, setVinculos] = useState<CursoColaborador[]>([]);
  const [colaboradores, setColaboradores] = useState<any[]>([]);
  const [novoColaboradorId, setNovoColaboradorId] = useState("");
  const [vinculoDataInicio, setVinculoDataInicio] = useState("");
  const [confirmDeleteVinculo, setConfirmDeleteVinculo] = useState<CursoColaborador | null>(null);

  const load = () => {
    setLoading(true);
    getCursos().then(setCursos).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openNew = () => {
    setEditando(null);
    setNome("");
    setDescricao("");
    setCargaHoraria("");
    setDialogOpen(true);
  };

  const openEdit = (curso: Curso) => {
    setEditando(curso);
    setNome(curso.nome);
    setDescricao(curso.descricao || "");
    setCargaHoraria(String(curso.cargaHoraria || ""));
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!nome.trim()) { toast.error("Nome é obrigatório"); return; }
    setSaving(true);
    try {
      if (editando) {
        await updateCurso(editando.id, { nome: nome.trim(), descricao: descricao.trim(), cargaHoraria: Number(cargaHoraria) || 0 });
        toast.success("Curso atualizado");
      } else {
        await createCurso({ nome: nome.trim(), descricao: descricao.trim(), cargaHoraria: Number(cargaHoraria) || 0 });
        toast.success("Curso criado");
      }
      setDialogOpen(false);
      load();
    } catch (err: any) {
      toast.error(err.message || "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      await deleteCurso(confirmDelete.id);
      toast.success("Curso removido");
      setConfirmDelete(null);
      load();
    } catch (err: any) {
      toast.error(err.message || "Erro ao remover");
    }
  };

  const openVinculos = async (curso: Curso) => {
    setVinculoCurso(curso);
    setNovoColaboradorId("");
    setVinculoDataInicio("");
    setVinculoDialog(true);
    try {
      const [vincs, cols] = await Promise.all([
        getAllVinculos(),
        getColaboradores({}),
      ]);
      setVinculos(vincs.filter((v: any) => v.cursoId === curso.id));
      setColaboradores(cols.data || cols);
    } catch { }
  };

  const handleVincular = async () => {
    if (!novoColaboradorId || !vinculoCurso) return;
    try {
      await vincularCurso({ colaboradorId: novoColaboradorId, cursoId: vinculoCurso.id, dataInicio: vinculoDataInicio || undefined });
      toast.success("Colaborador vinculado");
      setNovoColaboradorId("");
      setVinculoDataInicio("");
      const vincs = await getAllVinculos();
      setVinculos(vincs.filter((v: any) => v.cursoId === vinculoCurso.id));
      load();
    } catch (err: any) {
      toast.error(err.message || "Erro ao vincular");
    }
  };

  const handleDesvincular = async () => {
    if (!confirmDeleteVinculo) return;
    try {
      await deleteVinculoCurso(confirmDeleteVinculo.id);
      toast.success("Vínculo removido");
      setConfirmDeleteVinculo(null);
      if (vinculoCurso) {
        const vincs = await getAllVinculos();
        setVinculos(vincs.filter((v: any) => v.cursoId === vinculoCurso.id));
        load();
      }
    } catch (err: any) {
      toast.error(err.message || "Erro ao remover vínculo");
    }
  };

  const vinculosColabIds = vinculos.map((v) => v.colaboradorId);
  const colaboradoresDisponiveis = Array.isArray(colaboradores) ? colaboradores.filter((c: any) => !vinculosColabIds.includes(c.id)) : [];

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Cursos</h2>
          <p className="mt-1 text-sm text-muted-foreground">Catálogo de cursos disponíveis para colaboradores</p>
        </div>
        {podeGerenciar && (
          <Button onClick={openNew} className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Curso
          </Button>
        )}
      </div>

      <Card>
        <CardContent className="pt-6">
          {loading ? (
            <p className="text-sm text-muted-foreground py-8 text-center">Carregando...</p>
          ) : cursos.length === 0 ? (
            <EmptyState title="Nenhum curso" description={podeGerenciar ? 'Clique em "Novo Curso" para cadastrar.' : "Nenhum curso disponível no momento."} />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Carga Horária</TableHead>
                  <TableHead>Colaboradores</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cursos.map((curso) => (
                  <TableRow key={curso.id}>
                    <TableCell className="font-medium">{curso.nome}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{curso.descricao || "—"}</TableCell>
                    <TableCell className="text-sm">{curso.cargaHoraria ? `${curso.cargaHoraria}h` : "—"}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => openVinculos(curso)} className="gap-1.5 text-sm">
                        <Users className="h-4 w-4" />
                        {curso.colaboradorCount ?? 0}
                      </Button>
                    </TableCell>
                    <TableCell className="text-right">
                      {podeGerenciar && (
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => openVinculos(curso)} aria-label="Gerenciar vínculos"><Link className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" onClick={() => openEdit(curso)} aria-label="Editar curso"><Pencil className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" onClick={() => setConfirmDelete(curso)} aria-label="Excluir curso"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen} title={editando ? "Editar Curso" : "Novo Curso"} description={editando ? "Atualize os dados do curso." : "Preencha os dados do novo curso."}>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome</Label>
            <Input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome do curso" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea id="descricao" value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Descrição do curso" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cargaHoraria">Carga Horária (horas)</Label>
            <Input id="cargaHoraria" type="number" value={cargaHoraria} onChange={(e) => setCargaHoraria(e.target.value)} placeholder="40" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} disabled={saving}>{saving ? "Salvando..." : "Salvar"}</Button>
          </div>
        </div>
      </Dialog>

      <Dialog open={!!confirmDelete} onOpenChange={() => setConfirmDelete(null)} title="Excluir Curso" description={`Tem certeza que deseja excluir "${confirmDelete?.nome}"? Esta ação não pode ser desfeita.`}>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={() => setConfirmDelete(null)}>Cancelar</Button>
          <Button variant="destructive" onClick={handleDelete}>Excluir</Button>
        </div>
      </Dialog>

      <Dialog open={vinculoDialog} onOpenChange={setVinculoDialog} title={`Vínculos: ${vinculoCurso?.nome || ""}`} description="Gerencie os colaboradores vinculados a este curso.">
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1 space-y-1">
              <Label htmlFor="novo-colab">Adicionar Colaborador</Label>
              <Select value={novoColaboradorId} onValueChange={setNovoColaboradorId}>
                <SelectTrigger id="novo-colab"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                <SelectContent>
                  {colaboradoresDisponiveis.map((c: any) => (
                    <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="data-inicio-vinc">Data Início</Label>
              <Input id="data-inicio-vinc" type="date" value={vinculoDataInicio} onChange={(e) => setVinculoDataInicio(e.target.value)} className="w-40" />
            </div>
            <div className="flex items-end">
              <Button onClick={handleVincular} disabled={!novoColaboradorId} className="gap-1.5"><Link className="h-4 w-4" />Vincular</Button>
            </div>
          </div>

          <div className="border-t pt-4">
            <p className="text-sm font-medium mb-2">Colaboradores Vinculados ({vinculos.length})</p>
            {vinculos.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum colaborador vinculado.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Início</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vinculos.map((v: any) => (
                    <TableRow key={v.id}>
                      <TableCell className="font-medium">{v.colaboradorNome || "—"}</TableCell>
                      <TableCell>
                        <Badge variant={v.status === "concluido" ? "success" : v.status === "em_andamento" ? "warning" : "default"}>{v.status || "—"}</Badge>
                      </TableCell>
                      <TableCell className="text-sm">{v.dataInicio ? new Date(v.dataInicio).toLocaleDateString() : "—"}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => setConfirmDeleteVinculo(v)} aria-label="Remover vínculo"><Unlink className="h-4 w-4 text-destructive" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
      </Dialog>

      <Dialog open={!!confirmDeleteVinculo} onOpenChange={() => setConfirmDeleteVinculo(null)} title="Remover Vínculo" description={`Tem certeza que deseja remover este colaborador do curso "${vinculoCurso?.nome}"?`}>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={() => setConfirmDeleteVinculo(null)}>Cancelar</Button>
          <Button variant="destructive" onClick={handleDesvincular}>Remover</Button>
        </div>
      </Dialog>
    </div>
  );
}
