import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { createMeta, updateMeta, getMetaById, getCiclos } from "@/services/api";
import { toast } from "sonner";
import type { CicloAvaliacao, MetaStatus } from "@/types";

export function MetaFormPage() {
  const navigate = useNavigate();
  const { colaboradorId, id } = useParams();
  const isEditing = !!id;

  const [ciclos, setCiclos] = useState<CicloAvaliacao[]>([]);
  const [form, setForm] = useState({ nome: "", descricao: "", metaEsperada: "", resultadoObtido: "", percentualConclusao: "0", prazo: "", responsavelId: "", cicloId: "", status: "pending" });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEditing);

  useEffect(() => {
    getCiclos().then((data) => {
      setCiclos(data);
      if (id) {
        return getMetaById(id).then((m) => {
          setForm({
            nome: m.nome, descricao: m.descricao || "", metaEsperada: m.metaEsperada || "",
            resultadoObtido: m.resultadoObtido || "", percentualConclusao: String(m.percentualConclusao || "0"),
            prazo: m.prazo || "", responsavelId: m.responsavelId || "", cicloId: m.cicloId || "", status: m.status,
          });
        });
      }
    }).catch((err) => toast.error(err.message || "Erro ao carregar dados")).finally(() => { if (id) setLoading(false); });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nome.trim()) { toast.error("Nome da meta é obrigatório"); return; }
    setSaving(true);
    try {
      const payload = { ...form, percentualConclusao: parseInt(form.percentualConclusao) || 0, status: form.status as MetaStatus, colaboradorId, cicloId: form.cicloId || undefined, responsavelId: form.responsavelId || undefined };
      if (isEditing) {
        await updateMeta(id!, payload);
        toast.success("Meta atualizada");
      } else {
        await createMeta(payload);
        toast.success("Meta criada");
      }
      navigate(colaboradorId ? `/performance/profiles/${colaboradorId}` : "/performance/profiles");
    } catch (err: any) {
      toast.error(err.message || "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" /></div>;

  return (
    <div className="space-y-6">
      <PageHeader title={isEditing ? "Editar Meta" : "Nova Meta"} description={isEditing ? "Atualize os dados da meta" : "Cadastre uma nova meta para o colaborador"} />
      <form onSubmit={handleSubmit}>
        <Card>
          <CardContent className="pt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="nome">Nome da meta *</Label>
                <Input id="nome" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cicloId">Ciclo de avaliação</Label>
                <Select key={ciclos.length} value={form.cicloId} onValueChange={(v) => setForm({ ...form, cicloId: v })}>
                  <SelectTrigger id="cicloId"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Sem ciclo</SelectItem>
                    {ciclos.map((c) => (<SelectItem key={c.id} value={String(c.id)}>{c.nome}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                  <SelectTrigger id="status"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="in_progress">Em andamento</SelectItem>
                    <SelectItem value="completed">Concluída</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="prazo">Prazo</Label>
                <Input id="prazo" type="date" value={form.prazo} onChange={(e) => setForm({ ...form, prazo: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="percentualConclusao">% Conclusão</Label>
                <Input id="percentualConclusao" type="number" min="0" max="100" value={form.percentualConclusao} onChange={(e) => setForm({ ...form, percentualConclusao: e.target.value })} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea id="descricao" value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="metaEsperada">Meta esperada</Label>
                <Input id="metaEsperada" value={form.metaEsperada} onChange={(e) => setForm({ ...form, metaEsperada: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="resultadoObtido">Resultado obtido</Label>
                <Input id="resultadoObtido" value={form.resultadoObtido} onChange={(e) => setForm({ ...form, resultadoObtido: e.target.value })} />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancelar</Button>
              <Button type="submit" variant="indigo" disabled={saving}>{saving ? "Salvando..." : isEditing ? "Atualizar Meta" : "Criar Meta"}</Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
