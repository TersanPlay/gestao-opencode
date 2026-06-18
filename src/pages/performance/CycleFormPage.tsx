import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { getCicloById, createCiclo, updateCiclo } from "@/services/api";
import { toast } from "sonner";
import type { CicloStatus } from "@/types";

export function CycleFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [form, setForm] = useState<{ nome: string; dataInicio: string; dataFim: string; status: CicloStatus | string }>({ nome: "", dataInicio: "", dataFim: "", status: "aberto" });
  const [loading, setLoading] = useState(isEditing);

  useEffect(() => {
    if (id) {
      getCicloById(id).then((c) => {
        setForm({ nome: c.nome, dataInicio: c.dataInicio || "", dataFim: c.dataFim || "", status: c.status });
      }).finally(() => setLoading(false));
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nome.trim()) { toast.error("Nome é obrigatório"); return; }
    try {
      const payload = { ...form, status: form.status as CicloStatus };
      if (isEditing) {
        await updateCiclo(id!, payload);
        toast.success("Ciclo atualizado");
      } else {
        await createCiclo(payload);
        toast.success("Ciclo criado");
      }
      navigate("/performance/cycles");
    } catch (err: any) {
      toast.error(err.message || "Erro ao salvar");
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" /></div>;
  }

  return (
    <div className="space-y-6">
      <PageHeader title={isEditing ? "Editar Ciclo" : "Novo Ciclo"} description={isEditing ? "Atualize os dados do ciclo" : "Crie um novo ciclo de avaliação"} />
      <form onSubmit={handleSubmit}>
        <Card>
          <CardContent className="pt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome do ciclo *</Label>
                <Input id="nome" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                  <SelectTrigger id="status"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aberto">Aberto</SelectItem>
                    <SelectItem value="fechado">Fechado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dataInicio">Data de início</Label>
                <Input id="dataInicio" type="date" value={form.dataInicio} onChange={(e) => setForm({ ...form, dataInicio: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dataFim">Data de fim</Label>
                <Input id="dataFim" type="date" value={form.dataFim} onChange={(e) => setForm({ ...form, dataFim: e.target.value })} />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => navigate("/performance/cycles")}>Cancelar</Button>
              <Button type="submit" variant="indigo">{isEditing ? "Atualizar" : "Criar Ciclo"}</Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
