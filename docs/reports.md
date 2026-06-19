# Módulo: Relatórios

## Propósito

Relatórios consolidados de visitantes, departamentos e usuários.

## Rotas Backend

| Método | Rota | Roles | Descrição |
|--------|------|-------|-----------|
| GET | `/api/reports/visitors?start=&end=&departmentId=&status=` | admin, gestor, assessor | Relatório |
| GET | `/api/reports/departments` | admin, gestor, assessor | Por departamento |
| GET | `/api/reports/users` | admin, gestor | Relatório de usuários |

## Páginas Frontend

| Rota | Componente | Roles | Descrição |
|------|-----------|-------|-----------|
| `/reports` | `ReportsIndexPage` | admin, gestor, assessor | Central |
| `/reports/visitors` | `ReportVisitorsPage` | admin, gestor, assessor | Visitantes |
| `/reports/departments` | `ReportDepartmentsPage` | admin, gestor, assessor | Departamentos |
| `/reports/users` | `ReportUsersPage` | admin, gestor | Usuários |

## Permissões

| Role | Acesso |
|------|--------|
| admin | Full |
| gestor | Full (scoped) |
| assessor | Read (scoped) |
| operator | — |

## Dependências

- Auth
- Visitors, Departments, Users (agregações)
