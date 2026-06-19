# RBAC — Role-Based Access Control

## Hierarquia de Roles

`admin (4)` > `gestor (3)` > `assessor (2)` > `operator (1)`

Roles superiores herdam permissões das inferiores.

## Matriz de Permissões

| Módulo | admin | gestor | assessor | operator |
|--------|-------|--------|----------|----------|
| Auth | Full | Full | Full | Full |
| Usuários | CRUD | CRUD (mesmo dept) | — | — |
| Departamentos | CRUD | Read | Read | CRUD |
| Visitantes | CRUD | CRUD | Read, Create | Read, Create |
| Timeline | Full | Full | Read | Read |
| Dashboard | Full | Full(scope) | Read(scope) | Read(scope) |
| Relatórios | Full | Full(scope) | Read(scope) | — |
| Notificações | Read own | Read own | Read own | Read own |
| Auditoria | Full | Read(scope) | — | — |
| Configurações | CRUD | — | — | — |
| Colaboradores | CRUD | CRUD(dept) | Read(dept) | Read(own) |
| Ciclos | CRUD | Read | Read | — |
| Competências | CRUD | Read | Read | Read |
| Avaliações | CRUD | CRUD(dept) | Read | Read(own) |
| Metas | CRUD | CRUD(dept) | Read | Read(own) |
| PDI | CRUD | CRUD(dept) | Read | Read(own) |
| Feedbacks | CRUD | CRUD | CRUD | CRUD |
| Histórico | Read | Read(dept) | Read(dept) | Read(own) |
| Dashboard Perf. | Full(RH) | Team view | — | Self view |
| Exportação | Full | Dept scope | Dept scope | — |
| Documentos | CRUD | CRUD(dept) | Read(dept) | — |
| Cursos | CRUD | CRUD | Read | — |

## Scoping por Departamento

- **admin**: sem restrição — vê todos os departamentos
- **gestor**: scoped ao próprio `departmentId` (vê dados do seu departamento)
- **assessor**: scoped ao próprio `departmentId`
- **operator**: scoped ao próprio `departmentId`

## Implementação

- **Frontend**: `src/lib/permissions.ts` — matriz `PERMISSIONS` + função `can(role, action, resource)`
- **Backend**: `server/middleware/rbac.cjs` — `checkRole(roles)` + `checkScope()` middleware
- **Rotas**: `src/app/router.tsx` — `ProtectedRoute` com prop `roles`
