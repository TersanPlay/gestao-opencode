import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/shared/SearchInput";
import { EmptyState } from "@/components/shared/EmptyState";
import { PageHeader } from "@/components/shared/PageHeader";
import { PermissionGate } from "@/components/auth/PermissionGate";
import { getUsers, deleteUser } from "@/services/api";
import type { User } from "@/types";
import { Pencil, Trash2, Mail, Phone, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export function UsersPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getUsers().then(setUsers);
  }, []);

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string, name: string) => {
    await deleteUser(id);
    setUsers((prev) => prev.filter((u) => u.id !== id));
    toast.success(`Usuário "${name}" removido`);
  };

  return (
    <div>
      <PageHeader
        title="Usuários"
        description="Gerencie usuários, permissões e papéis organizacionais"
        action={{ label: "Novo Usuário", to: "/users/new" }}
      />

      <Card>
        <CardContent className="p-0">
          <div className="flex items-center gap-4 p-4 pb-0">
            <SearchInput value={search} onChange={setSearch} placeholder="Buscar por nome ou email..." />
          </div>

          {filtered.length === 0 ? (
            <EmptyState
              title="Nenhum usuário encontrado"
              description={search ? "Tente ajustar sua busca" : "Cadastre o primeiro usuário do sistema"}
              action={search ? undefined : { label: "Novo Usuário", to: "/users/new" }}
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Papel</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar name={user.name} size="sm" />
                        <span className="font-medium">{user.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Mail className="h-3.5 w-3.5" />
                        {user.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Phone className="h-3.5 w-3.5" />
                        {user.phone || "—"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.role === "admin" ? "default" : user.role === "gestor" ? "success" : user.role === "assessor" ? "warning" : "slate"}>
                        <ShieldCheck className="mr-1 h-3 w-3" />
                        {user.role === "admin" ? "Admin" : user.role === "gestor" ? "Gestor" : user.role === "assessor" ? "Assessor" : "Operador"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.active ? "success" : "destructive"}>
                        {user.active ? "Ativo" : "Inativo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => navigate(`/users/${user.id}/edit`)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <PermissionGate action="delete" resource="users">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(user.id, user.name)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </PermissionGate>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
