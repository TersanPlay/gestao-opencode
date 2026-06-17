import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { SearchInput } from "@/components/shared/SearchInput";
import { EmptyState } from "@/components/shared/EmptyState";
import { PageHeader } from "@/components/shared/PageHeader";
import { getDepartments, getUsers, deleteDepartment } from "@/services/api";
import type { Department, User } from "@/types";
import { Pencil, Trash2, Building2, ChevronRight, ChevronDown } from "lucide-react";
import { toast } from "sonner";

function buildTree(depts: Department[], parentId: string | null = null): Department[] {
  return depts
    .filter((d) => d.parentId === parentId)
    .map((d) => ({
      ...d,
      children: buildTree(depts, d.id),
    }));
}

function DeptRow({
  dept,
  users,
  depth,
  onEdit,
  onDelete,
}: {
  dept: Department;
  users: User[];
  depth: number;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const [open, setOpen] = useState(true);
  const hasChildren = dept.children && dept.children.length > 0;
  const responsible = users.find((u) => u.id === dept.responsibleId);

  return (
    <>
      <TableRow className="transition-colors hover:bg-muted/50">
        <TableCell>
          <div className="flex items-center gap-2" style={{ paddingLeft: `${depth * 20}px` }}>
            {hasChildren ? (
              <button onClick={() => setOpen(!open)} className="text-muted-foreground hover:text-foreground">
                {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>
            ) : (
              <span className="w-4" />
            )}
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{dept.name}</span>
          </div>
        </TableCell>
        <TableCell className="text-muted-foreground text-sm">
          {dept.description || "—"}
        </TableCell>
        <TableCell>
          {responsible ? (
            <div className="flex items-center gap-2">
              <Avatar name={responsible.name} size="sm" />
              <span className="text-sm">{responsible.name}</span>
            </div>
          ) : (
            <span className="text-sm text-muted-foreground">—</span>
          )}
        </TableCell>
        <TableCell className="text-right">
          <div className="flex justify-end gap-1">
            <Button variant="ghost" size="icon" onClick={() => onEdit(dept.id)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onDelete(dept.id)}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </TableCell>
      </TableRow>
      {open && hasChildren && dept.children!.map((child) => (
        <DeptRow key={child.id} dept={child} users={users} depth={depth + 1} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </>
  );
}

export function DepartmentsPage() {
  const navigate = useNavigate();
  const [depts, setDepts] = useState<Department[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getDepartments().then(setDepts);
    getUsers().then(setUsers);
  }, []);

  const tree = buildTree(depts);

  const filteredTree = tree
    .map((d) => ({
      ...d,
      children: d.children?.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase())
      ),
    }))
    .filter((d) => d.name.toLowerCase().includes(search.toLowerCase()) || (d.children && d.children.length > 0));

  const handleDelete = async (id: string) => {
    await deleteDepartment(id);
    setDepts((prev) => prev.filter((d) => d.id !== id));
    toast.success("Departamento removido");
  };

  return (
    <div>
      <PageHeader
        title="Departamentos"
        description="Organize setores, departamentos e hierarquias"
        action={{ label: "Novo Departamento", to: "/departments/new" }}
      />

      <Card>
        <CardContent className="p-0">
          <div className="flex items-center gap-4 p-4 pb-0">
            <SearchInput value={search} onChange={setSearch} placeholder="Buscar departamento..." />
          </div>

          {tree.length === 0 ? (
            <EmptyState
              title="Nenhum departamento cadastrado"
              description="Crie o primeiro departamento para começar"
              action={{ label: "Novo Departamento", to: "/departments/new" }}
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Departamento</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Responsável</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTree.map((dept) => (
                  <DeptRow
                    key={dept.id}
                    dept={dept}
                    users={users}
                    depth={0}
                    onEdit={(id) => navigate(`/departments/${id}/edit`)}
                    onDelete={handleDelete}
                  />
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
