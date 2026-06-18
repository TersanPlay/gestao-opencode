import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { JollyDatePicker } from "@/components/ui/date-range-picker";
import { getColaboradorById, createColaborador, updateColaborador, getDepartments } from "@/services/api";
import { toast } from "sonner";
import { CalendarDate } from "@internationalized/date";
import type { Department } from "@/types";

const MESES = [
  { value: "1", label: "1 - Janeiro" },
  { value: "2", label: "2 - Fevereiro" },
  { value: "3", label: "3 - Março" },
  { value: "4", label: "4 - Abril" },
  { value: "5", label: "5 - Maio" },
  { value: "6", label: "6 - Junho" },
  { value: "7", label: "7 - Julho" },
  { value: "8", label: "8 - Agosto" },
  { value: "9", label: "9 - Setembro" },
  { value: "10", label: "10 - Outubro" },
  { value: "11", label: "11 - Novembro" },
  { value: "12", label: "12 - Dezembro" },
];

function parseDate(str: string): CalendarDate | null {
  if (!str) return null;
  const m = str.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return null;
  return new CalendarDate(parseInt(m[1]), parseInt(m[2]), parseInt(m[3]));
}

function formatDate(d: CalendarDate | null): string {
  if (!d) return "";
  return `${d.year.toString().padStart(4, "0")}-${d.month.toString().padStart(2, "0")}-${d.day.toString().padStart(2, "0")}`;
}

export function PerfilCMPFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [form, setForm] = useState({
    nome: "", cpf: "", matricula: "", cargo: "", departamentoId: "",
    funcao: "", cargaHoraria: "", vinculo: "", ano: "", mes: "",
  });
  const [dataAdmissao, setDataAdmissao] = useState<CalendarDate | null>(null);
  const [dataDesligamento, setDataDesligamento] = useState<CalendarDate | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDepartments().then(setDepartments);
    if (isEditing && id) {
      getColaboradorById(id).then((c) => {
        setForm({
          nome: c.nome || "", cpf: c.cpf || "", matricula: c.matricula || "",
          cargo: c.cargo || "", departamentoId: c.departamentoId || "",
          funcao: c.funcao || "", cargaHoraria: String(c.cargaHoraria || ""),
          vinculo: c.vinculo || "", ano: c.ano != null ? String(c.ano) : "", mes: c.mes != null ? String(c.mes) : "",
        });
        setDataAdmissao(parseDate(c.dataAdmissao));
        setDataDesligamento(parseDate(c.dataDesligamento || ""));
      }).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nome.trim()) { toast.error("Nome é obrigatório"); return; }
    try {
      const payload = {
        nome: form.nome, cpf: form.cpf, matricula: form.matricula,
        cargo: form.cargo, departamentoId: form.departamentoId || null,
        funcao: form.funcao, cargaHoraria: parseInt(form.cargaHoraria) || 0,
        ano: form.ano ? parseInt(form.ano) : null, mes: form.mes ? parseInt(form.mes) : null,
        vinculo: form.vinculo, dataAdmissao: formatDate(dataAdmissao),
        dataDesligamento: dataDesligamento ? formatDate(dataDesligamento) : null,
      };
      if (isEditing) {
        await updateColaborador(id!, payload);
        toast.success("Colaborador atualizado");
      } else {
        await createColaborador(payload);
        toast.success("Colaborador criado");
      }
      navigate("/performance/profiles");
    } catch (err: any) {
      toast.error(err.message || "Erro ao salvar");
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" /></div>;
  }

  return (
    <div className="space-y-6">
      <PageHeader title={isEditing ? "Editar Colaborador" : "Novo Colaborador"} description={isEditing ? "Atualize os dados do colaborador" : "Cadastre um novo colaborador no sistema"} />
      <form onSubmit={handleSubmit}>
        <Card>
          <CardContent className="pt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ano">Ano de referência</Label>
                <Input id="ano" type="number" min={2000} max={2100} value={form.ano} onChange={(e) => setForm({ ...form, ano: e.target.value })} placeholder="ex: 2026" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mes">Mês de referência</Label>
                <Select value={form.mes} onValueChange={(v) => setForm({ ...form, mes: v })}>
                  <SelectTrigger id="mes"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Sem mês</SelectItem>
                    {MESES.map((m) => (<SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="matricula">Matrícula</Label>
                <Input id="matricula" value={form.matricula} onChange={(e) => setForm({ ...form, matricula: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cpf">CPF</Label>
                <Input id="cpf" value={form.cpf} onChange={(e) => setForm({ ...form, cpf: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nome">Nome completo *</Label>
                <Input id="nome" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cargo">Cargo</Label>
                <Input id="cargo" value={form.cargo} onChange={(e) => setForm({ ...form, cargo: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="departamentoId">Lotação</Label>
                <Select value={form.departamentoId} onValueChange={(v) => setForm({ ...form, departamentoId: v })}>
                  <SelectTrigger id="departamentoId"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Sem lotação</SelectItem>
                    {departments.map((d) => (<SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="funcao">Função</Label>
                <Input id="funcao" value={form.funcao} onChange={(e) => setForm({ ...form, funcao: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cargaHoraria">Carga horária semanal</Label>
                <Input id="cargaHoraria" type="number" min={0} max={60} value={form.cargaHoraria} onChange={(e) => setForm({ ...form, cargaHoraria: e.target.value })} placeholder="ex: 40" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vinculo">Vínculo</Label>
                <Input id="vinculo" value={form.vinculo} onChange={(e) => setForm({ ...form, vinculo: e.target.value })} placeholder="ex: Estatutário" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dataAdmissao">Data de admissão</Label>
                <JollyDatePicker value={dataAdmissao} onChange={(v) => v && setDataAdmissao(v)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dataDesligamento">Data de demissão</Label>
                <JollyDatePicker value={dataDesligamento} onChange={(v) => v && setDataDesligamento(v)} />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => navigate("/performance/profiles")}>Cancelar</Button>
              <Button type="submit" variant="indigo">{isEditing ? "Atualizar" : "Criar Colaborador"}</Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
