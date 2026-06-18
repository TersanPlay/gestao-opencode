import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { createPDI, updatePDI, getPDIById, getCiclos } from "@/services/api";
import { toast } from "sonner";
import type { CicloAvaliacao, PDIStatus } from "@/types";

export function PDIFormPage() {
  const navigate = useNavigate();
  const { colaboradorId, id } = useParams();
  const isEditing = !!id;

  const [ciclos, setCiclos] = useState<CicloAvaliacao[]>([]);
  const [form, setForm] = useState({ objetivo: "", acoesPrevistas: "", prazo: "", observacoes: "", evidencias: "", cicloId: "", status: "pending", responsavelId: "" });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEditing);

  useEffect(() => {
    getCiclos().then(setCiclos);
    if (id) {
      getPDIById(id).then((p) => {
        setForm({
          objetivo: p.objetivo, acoesPrevistas: p.acoesPrevistas || "", prazo: p.prazo || "",
          observacoes: p.observacoes || "", evidencias: p.evidencias || "", cicloId: p.cicloId || "",
          status: p.status, responsavelId: p.responsavelId || "",
        });
      }).finally(() => setLoading(false));
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.objetivo.trim()) { toast.error("Objetivo é obrigatório"); return; }
    setSaving(true);
    try {
      const payload = { ...form, status: form.status as PDIStatus, colaboradorId, cicloId: form.cicloId || undefined, responsavelId: form.responsavelId || undefined };
      if (isEditing) {
        await updatePDI(id!, payload);
        toast.success("PDI atualizado");
      } else {
        await createPDI(payload as any);
        toast.success("PDI criado");
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
      <PageHeader title={isEditing ? "Editar PDI" : "Novo PDI"} description={isEditing ? "Atualize o plano de desenvolvimento" : "Crie um plano de desenvolvimento individual"} />
      <form onSubmit={handleSubmit}>
        <Card>
          <CardContent className="pt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="objetivo">Objetivo de desenvolvimento *</Label>
                <Input id="objetivo" value={form.objetivo} onChange={(e) => setForm({ ...form, objetivo: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cicloId">Ciclo de avaliação</Label>
                <Select value={form.cicloId} onValueChange={(v) => setForm({ ...form, cicloId: v })}>
                  <SelectTrigger id="cicloId"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Sem ciclo</SelectItem>
                    {ciclos.map((c) => (<SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>))}
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
                    <SelectItem value="completed">Concluído</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="prazo">Prazo</Label>
                <Input id="prazo" type="date" value={form.prazo} onChange={(e) => setForm({ ...form, prazo: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="acoesPrevistas">Ações previstas</Label>
                <Textarea id="acoesPrevistas" value={form.acoesPrevistas} onChange={(e) => setForm({ ...form, acoesPrevistas: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="evidencias">Evidências</Label>
                <Textarea id="evidencias" value={form.evidencias} onChange={(e) => setForm({ ...form, evidencias: e.target.value })} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea id="observacoes" value={form.observacoes} onChange={(e) => setForm({ ...form, observacoes: e.target.value })} />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancelar</Button>
              <Button type="submit" variant="indigo" disabled={saving}>{saving ? "Salvando..." : isEditing ? "Atualizar PDI" : "Criar PDI"}</Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
