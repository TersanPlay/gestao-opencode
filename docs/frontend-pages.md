# Rotas do Frontend

Todas as rotas são definidas em `src/app/router.tsx`.

## Públicas

| Rota | Componente | Descrição |
|------|-----------|-----------|
| `/` | `LandingPage` | Página inicial |
| `/login` | `LoginPage` | Login |
| `/design-system` | `DesignSystemPage` | Catálogo de componentes UI |

## Autenticadas (dentro de `AppLayout`)

### Dashboard

| Rota | Componente | Roles | Descrição |
|------|-----------|-------|-----------|
| `/dashboard` | `DashboardPage` | todos | Métricas principais |

### Usuários

| Rota | Componente | Roles | Descrição |
|------|-----------|-------|-----------|
| `/users` | `UsersPage` | admin, gestor | CRUD lista |
| `/users/new` | `UserFormPage` | admin, gestor | Criar |
| `/users/:id/edit` | `UserFormPage` | admin, gestor | Editar |

### Departamentos

| Rota | Componente | Roles | Descrição |
|------|-----------|-------|-----------|
| `/departments` | `DepartmentsPage` | admin, gestor, operator | Lista hierárquica |
| `/departments/new` | `DepartmentFormPage` | admin, operator | Criar |
| `/departments/:id/edit` | `DepartmentFormPage` | admin, operator | Editar |

### Visitantes

| Rota | Componente | Roles | Descrição |
|------|-----------|-------|-----------|
| `/visitors` | `VisitorsPage` | todos | Lista com filtros |
| `/visitors/new` | `VisitorFormPage` | todos | Registrar |
| `/visitors/schedule` | `VisitorSchedulePage` | todos | Agendar/gerenciar |
| `/visitors/:id` | `VisitorDetailPage` | todos | Detalhe + timeline |
| `/visitors/:id/edit` | `VisitorFormPage` | admin, gestor | Editar |

### Relatórios

| Rota | Componente | Roles | Descrição |
|------|-----------|-------|-----------|
| `/reports` | `ReportsIndexPage` | admin, gestor, assessor | Central |
| `/reports/visitors` | `ReportVisitorsPage` | admin, gestor, assessor | Visitantes |
| `/reports/departments` | `ReportDepartmentsPage` | admin, gestor, assessor | Departamentos |
| `/reports/users` | `ReportUsersPage` | admin, gestor | Usuários |

### Performance — Perfis

| Rota | Componente | Roles | Descrição |
|------|-----------|-------|-----------|
| `/performance/profiles` | `PerfilCMPListPage` | admin, gestor, assessor | Lista perfis |
| `/performance/profiles/import` | `ImportProfilesPage` | admin, gestor | Importar CSV |
| `/performance/profiles/new` | `PerfilCMPFormPage` | admin, gestor | Criar perfil |
| `/performance/profiles/:id` | `PerfilCMPDetailPage` | todos | Detalhe |
| `/performance/profiles/:id/edit` | `PerfilCMPFormPage` | admin, gestor | Editar |

### Performance — Ciclos

| Rota | Componente | Roles | Descrição |
|------|-----------|-------|-----------|
| `/performance/cycles` | `CyclesListPage` | admin, gestor | Lista ciclos |
| `/performance/cycles/:id` | `CycleDetailPage` | admin, gestor | Detalhe + progresso |
| `/performance/cycles/new` | `CycleFormPage` | admin | Criar |
| `/performance/cycles/:id/edit` | `CycleFormPage` | admin | Editar |

### Performance — Avaliações, Metas, PDI, Feedbacks

| Rota | Componente | Roles | Descrição |
|------|-----------|-------|-----------|
| `/performance/evaluations/new/:colaboradorId` | `EvaluationFormPage` | admin, gestor | Avaliar |
| `/performance/metas/new/:colaboradorId` | `MetaFormPage` | admin, gestor | Criar meta |
| `/performance/metas/:id/edit` | `MetaFormPage` | admin, gestor | Editar meta |
| `/performance/pdi/new/:colaboradorId` | `PDIFormPage` | admin, gestor | Criar PDI |
| `/performance/pdi/:id/edit` | `PDIFormPage` | admin, gestor | Editar PDI |
| `/performance/feedbacks/new/:colaboradorId` | `FeedbackFormPage` | todos | Dar feedback |

### Performance — Dashboards

| Rota | Componente | Roles | Descrição |
|------|-----------|-------|-----------|
| `/performance/dashboard` | `PerformanceRHPage` | admin | RH geral |
| `/performance/team-dashboard` | `PerformanceGestorPage` | gestor | Equipe |
| `/performance/my-dashboard` | `PerformanceColaboradorPage` | todos | Auto |

### Sistema

| Rota | Componente | Roles | Descrição |
|------|-----------|-------|-----------|
| `/notifications` | `NotificationsPage` | todos | Central de notificações |
| `/logs` | `LogsPage` | admin, gestor | Auditoria |
| `/settings` | `SettingsPage` | admin | Configurações |
| `/profile` | `ProfilePage` | todos | Perfil do usuário |

> Total: 37 páginas
