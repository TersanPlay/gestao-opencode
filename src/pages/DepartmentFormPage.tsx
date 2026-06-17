import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/shared/PageHeader";
import { getDepartmentById, createDepartment, updateDepartment, getDepartments, getUsers } from "@/services/api";
import type { Department, User } from "@/types";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";

export function DepartmentFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [departments, setDepartments] = useState<Department[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    parentId: "",
    responsibleId: "",
  });

  useEffect(() => {
    getDepartments().then(setDepartments);
    getUsers().then(setUsers);
    if (id) getDepartmentById(id).then((d) => {
      if (d) setForm({ name: d.name, description: d.description || "", parentId: d.parentId || "", responsibleId: d.responsibleId });
    });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      await updateDepartment(id!, {
        name: form.name,
        description: form.description,
        parentId: form.parentId || null,
        responsibleId: form.responsibleId,
      });
      toast.success("Departamento atualizado");
    } else {
      await createDepartment({
        name: form.name,
        description: form.description,
        parentId: form.parentId || null,
        responsibleId: form.responsibleId,
      });
      toast.success("Departamento criado");
    }
    navigate("/departments");
  };

  const parentOptions = departments
    .filter((d) => d.id !== id)
    .map((d) => ({ value: d.id, label: d.name }));

  const userOptions = users.map((u) => ({ value: u.id, label: u.name }));

  return (
    <div>
      <PageHeader title={isEditing ? "Editar Departamento" : "Novo Departamento"} />
      <Card className="max-w-2xl">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Departamento</Label>
              <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ex: Tecnologia da Informação" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Input id="description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Descrição do departamento" />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="parent">Departamento Superior</Label>
                <Select value={form.parentId} onValueChange={(v) => setForm({ ...form, parentId: v })}>
                  <SelectTrigger id="parent">
                    <SelectValue placeholder="Nenhum (raiz)" />
                  </SelectTrigger>
                  <SelectContent>
                    {parentOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="responsible">Responsável</Label>
                <Select value={form.responsibleId} onValueChange={(v) => setForm({ ...form, responsibleId: v })}>
                  <SelectTrigger id="responsible">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {userOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" className="gap-2">
                <Save className="h-4 w-4" />
                {isEditing ? "Atualizar" : "Salvar"}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate("/departments")} className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
