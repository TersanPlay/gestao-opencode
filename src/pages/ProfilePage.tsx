import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar } from "@/components/ui/avatar";
import { UserRoleBadge } from "@/components/shared/StatusBadge";
import { useAuth } from "@/contexts/AuthContext";
import { getDepartments } from "@/services/api";
import type { Department, UserRole } from "@/types";
import { ShieldCheck, Building2, Save, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export function ProfilePage() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "operator" as UserRole,
    departmentId: "__none__",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    getDepartments().then((depts) => {
      setDepartments(depts);
      if (user) {
        setForm((prev) => ({
          ...prev,
          name: user.name,
          email: user.email,
          phone: user.phone || "",
          role: user.role,
          departmentId: user.departmentId ? String(user.departmentId) : "__none__",
        }));
      }
    });
  }, [user]);

  const isAdmin = user?.role === "admin";

  const deptMap = departments.reduce<Record<string, string>>((acc, d) => {
    acc[String(d.id)] = d.name;
    return acc;
  }, {});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.newPassword) {
      if (form.newPassword.length < 6) { toast.error("Nova senha deve ter no mínimo 6 caracteres"); return; }
      if (form.newPassword !== form.confirmPassword) { toast.error("Senhas não conferem"); return; }
      if (!form.currentPassword) { toast.error("Informe a senha atual"); return; }
    }

    setSaving(true);
    try {
      const payload: Record<string, unknown> = { name: form.name, email: form.email, phone: form.phone };
      if (isAdmin) {
        payload.role = form.role;
        payload.departmentId = form.departmentId === "__none__" ? null : form.departmentId;
      }
      if (form.currentPassword) { payload.currentPassword = form.currentPassword; payload.newPassword = form.newPassword; }
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || "Erro ao salvar"); return; }
      updateUser(data.user);
      setForm((prev) => ({ ...prev, currentPassword: "", newPassword: "", confirmPassword: "" }));
      toast.success("Perfil atualizado");
    } catch (err) { console.error(err); toast.error("Erro ao salvar"); }
    finally { setSaving(false); }
  };

  if (!user) return null;

  const deptName = form.departmentId !== "__none__" ? deptMap[form.departmentId] : null;

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} aria-label="Voltar">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Meu Perfil</h2>
          <p className="mt-1 text-sm text-muted-foreground">Gerencie suas informações pessoais</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardContent className="flex flex-col items-center gap-4 p-6">
            <Avatar name={user.name} size="lg" />
            <div className="text-center">
              <p className="text-lg font-semibold text-foreground">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
              <UserRoleBadge role={user.role} />
            </div>
            {user.departmentId && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Building2 className="h-3 w-3" />
                {deptMap[String(user.departmentId)] || "Departamento"}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Informações Pessoais</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="(11) 99999-0000" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="profile-role">Papel</Label>
                  {isAdmin ? (
                    <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v as UserRole })}>
                      <SelectTrigger id="profile-role">
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Administrador</SelectItem>
                        <SelectItem value="gestor">Gestor</SelectItem>
                        <SelectItem value="assessor">Assessor</SelectItem>
                        <SelectItem value="operator">Operador</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="flex h-10 items-center gap-2 rounded-xl border border-input bg-background px-4 text-sm">
                      <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                      <UserRoleBadge role={form.role} />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="profile-dept">Departamento</Label>
                  {isAdmin ? (
                    <Select value={form.departmentId} onValueChange={(v) => setForm({ ...form, departmentId: v })}>
                      <SelectTrigger id="profile-dept">
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__none__">Sem departamento</SelectItem>
                        {departments.map((d) => (
                          <SelectItem key={d.id} value={String(d.id)}>{d.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="flex h-10 items-center gap-2 rounded-xl border border-input bg-background px-4 text-sm text-muted-foreground">
                      <Building2 className="h-4 w-4" />
                      {deptName || "Sem departamento"}
                    </div>
                  )}
                </div>
              </div>

              <hr className="border-border" />

              <p className="text-sm font-medium text-foreground">Alterar Senha</p>
              <p className="text-xs text-muted-foreground -mt-4">Deixe em branco para manter a senha atual</p>

              <div className="grid gap-5 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Senha Atual</Label>
                  <Input
                    id="currentPassword"
                    type={showPassword ? "text" : "password"}
                    value={form.currentPassword}
                    onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
                    autoComplete="current-password"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nova Senha</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showPassword ? "text" : "password"}
                      value={form.newPassword}
                      onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                      autoComplete="new-password"
                    />
                    <Button type="button" variant="ghost" size="icon" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Ocultar" : "Mostrar"} className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    value={form.confirmPassword}
                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                    autoComplete="new-password"
                  />
                </div>
              </div>

              <Button type="submit" disabled={saving} className="gap-2">
                <Save className="h-4 w-4" /> {saving ? "Salvando..." : "Salvar"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
