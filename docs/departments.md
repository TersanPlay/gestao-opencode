# Módulo: Departamentos

## Propósito

Estrutura organizacional em árvore com hierarquia auto-referencial.

## Rotas Backend

| Método | Rota | Roles | Descrição |
|--------|------|-------|-----------|
| GET | `/api/departments` | admin, gestor, operator | Listar em árvore |
| GET | `/api/departments/:id` | admin, gestor, operator | Detalhe |
| POST | `/api/departments` | admin, operator | Criar |
| PUT | `/api/departments/:id` | admin, operator | Atualizar |
| DELETE | `/api/departments/:id` | admin, operator | Remover |

## Páginas Frontend

| Rota | Componente | Roles | Descrição |
|------|-----------|-------|-----------|
| `/departments` | `DepartmentsPage` | admin, gestor, operator | Lista |
| `/departments/new` | `DepartmentFormPage` | admin, operator | Criar |
| `/departments/:id/edit` | `DepartmentFormPage` | admin, operator | Editar |

## Tabelas DB

`departments` — id, name, description, parentId (auto-ref), responsibleId (FK → users)

## Permissões

| Role | Acesso |
|------|--------|
| admin | CRUD |
| gestor | Read |
| operator | CRUD |
| assessor | — |

## Dependências

- Auth
