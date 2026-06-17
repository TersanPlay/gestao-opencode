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
import { ArrowLeft, Save, Eye, EyeOff, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export function UserFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [departments, setDepartments] = useState<Department[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "operator" as User["role"],
    departmentId: "__none__",
    active: true,
    password: "",
    confirmPassword: "",
  });

  function generatePassword() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let pwd = "";
    for (let i = 0; i < 12; i++) pwd += chars[Math.floor(Math.random() * chars.length)];
    setForm((prev) => ({ ...prev, password: pwd, confirmPassword: pwd }));
  }

  useEffect(() => {
    getDepartments().then((depts) => {
      setDepartments(depts);
      if (id) {
        return getUserById(id).then((u) => {
          setForm((prev) => ({
            ...prev,
            name: u.name,
            email: u.email,
            phone: u.phone || "",
            role: u.role,
            departmentId: u.departmentId ? String(u.departmentId) : "__none__",
            active: u.active,
          }));
        });
      }
    }).catch(() => toast.error("Erro ao carregar dados"));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password || !isEditing) {
      if (form.password.length < 6) {
        toast.error("Senha deve ter no mínimo 6 caracteres");
        return;
      }
      if (form.password !== form.confirmPassword) {
        toast.error("Senhas não conferem");
        return;
      }
    }

    const payload: Record<string, unknown> = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      role: form.role,
      departmentId: form.departmentId === "__none__" ? null : form.departmentId,
      active: form.active,
    };
    if (form.password) payload.password = form.password;

    try {
      if (isEditing) {
        await updateUser(id!, payload);
        toast.success("Usuário atualizado");
      } else {
        await createUser(payload as Parameters<typeof createUser>[0]);
        toast.success("Usuário criado");
      }
      navigate("/users");
    } catch { toast.error("Erro ao salvar usuário"); }
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
                    <SelectItem value="__none__">Sem departamento</SelectItem>
                    {departments.map((d) => (
                      <SelectItem key={d.id} value={String(d.id)}>{d.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha {!isEditing && <span className="text-destructive">*</span>}</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder={isEditing ? "Deixe em branco para manter" : "Mínimo 6 caracteres"}
                    autoComplete="new-password"
                    required={!isEditing}
                  />
                  <div className="absolute right-1 top-1/2 -translate-y-1/2 flex">
                    <Button type="button" variant="ghost" size="icon" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"} className="h-8 w-8">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button type="button" variant="ghost" size="icon" onClick={generatePassword} aria-label="Gerar senha" className="h-8 w-8">
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Senha {!isEditing && <span className="text-destructive">*</span>}</Label>
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  placeholder="Repita a senha"
                  autoComplete="new-password"
                  required={!isEditing}
                />
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
