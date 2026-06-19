# Módulo: Usuários

## Propósito

CRUD de usuários do sistema com hierarquia de roles.

## Rotas Backend

| Método | Rota | Roles | Descrição |
|--------|------|-------|-----------|
| GET | `/api/users` | admin, gestor | Listar (gestor vê só do dept) |
| GET | `/api/users/:id` | admin, gestor | Detalhe |
| POST | `/api/users` | admin, gestor | Criar (gestor não cria admin) |
| PUT | `/api/users/:id` | admin, gestor | Atualizar |
| DELETE | `/api/users/:id` | admin | Remover |

## Páginas Frontend

| Rota | Componente | Roles | Descrição |
|------|-----------|-------|-----------|
| `/users` | `UsersPage` | admin, gestor | Lista |
| `/users/new` | `UserFormPage` | admin, gestor | Criar |
| `/users/:id/edit` | `UserFormPage` | admin, gestor | Editar |

## Tabelas DB

`users` — id, name, email, password, role, active, departmentId

## Permissões

| Role | Acesso |
|------|--------|
| admin | CRUD todos, sem restrição |
| gestor | CRUD (apenas do mesmo departamento, não cria admin) |
| assessor, operator | — |

## Dependências

- Auth (requer autenticação)
- Departamentos (departamentId FK)
