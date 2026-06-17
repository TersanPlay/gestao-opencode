import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/shared/PageHeader";
import { getUserById, createUser, updateUser, getDepartments } from "@/services/api";
import type { User, Department } from "@/types";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";

export function UserFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [departments, setDepartments] = useState<Department[]>([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "operator" as User["role"],
    departmentId: "",
    active: true,
  });

  useEffect(() => {
    getDepartments().then(setDepartments);
    if (id) getUserById(id).then((u) => {
      if (u) setForm({ name: u.name, email: u.email, phone: u.phone || "", role: u.role, departmentId: u.departmentId, active: u.active });
    });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      await updateUser(id!, form);
      toast.success("Usuário atualizado");
    } else {
      await createUser(form);
      toast.success("Usuário criado");
    }
    navigate("/users");
  };

  return (
    <div>
      <PageHeader title={isEditing ? "Editar Usuário" : "Novo Usuário"} />
      <Card className="max-w-2xl">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nome completo" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="email@org.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="(11) 99999-0000" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Papel</Label>
                <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v as User["role"] })}>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="gestor">Gestor</SelectItem>
                    <SelectItem value="assessor">Assessor</SelectItem>
                    <SelectItem value="operator">Operador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Departamento</Label>
                <Select value={form.departmentId} onValueChange={(v) => setForm({ ...form, departmentId: v })}>
                  <SelectTrigger id="department">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((d) => (
                      <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="active">Status</Label>
                <Select value={form.active ? "true" : "false"} onValueChange={(v) => setForm({ ...form, active: v === "true" })}>
                  <SelectTrigger id="active">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Ativo</SelectItem>
                    <SelectItem value="false">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" className="gap-2">
                <Save className="h-4 w-4" />
                {isEditing ? "Atualizar" : "Salvar"}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate("/users")} className="gap-2">
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
