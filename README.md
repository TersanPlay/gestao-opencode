# Gestão Corporativa

Sistema de gestão empresarial com módulo de portaria (visitantes) e gestão de desempenho (avaliações, metas, PDI). React 19 + Express 5 + SQLite.

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Frontend | React 19, TypeScript, Tailwind CSS v4, shadcn/ui, react-aria-components |
| Roteamento | React Router v7 |
| Formulários | react-hook-form + zod |
| Backend | Node.js, Express 5 |
| Banco | SQLite (better-sqlite3) |
| Auth | JWT + bcryptjs |

## Início Rápido

```bash
npm install
npm run dev
```

- Frontend: http://localhost:5173
- API: http://localhost:3001
- Design System: http://localhost:5173/design-system

## Credenciais Admin

```
Email: admin.admin@admin.com
Senha: admin@123
```

## Comandos

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Frontend + backend |
| `npm run dev:vite` | Apenas frontend |
| `npm run dev:server` | Apenas backend |
| `npm run build` | TypeScript + Vite build |
| `npm run preview` | Preview do build |

## Módulos do Sistema

### Portaria

| # | Módulo | Rotas Backend | Páginas Frontend | Tabelas DB | Docs |
|---|--------|--------------|-----------------|-----------|------|
| 01 | Autenticação | `auth.cjs` | LoginPage, ProfilePage | users | [docs/auth.md](docs/auth.md) |
| 02 | Usuários | `users.cjs` | UsersPage, UserFormPage | users | [docs/users.md](docs/users.md) |
| 03 | Departamentos | `departments.cjs` | DepartmentsPage, DepartmentFormPage | departments | [docs/departments.md](docs/departments.md) |
| 04 | Visitantes | `visitors.cjs` | VisitorsPage, VisitorFormPage, VisitorSchedulePage, VisitorDetailPage | visitors | [docs/visitors.md](docs/visitors.md) |
| 05 | Timeline | `timeline.cjs` | (embebido) | timeline_events | [docs/timeline.md](docs/timeline.md) |
| 06 | Dashboard | `dashboard.cjs` | DashboardPage | (agrega) | [docs/dashboard.md](docs/dashboard.md) |
| 07 | Relatórios | `reports.cjs` | ReportsIndexPage, ReportVisitorsPage, ReportDepartmentsPage, ReportUsersPage | (agrega) | [docs/reports.md](docs/reports.md) |
| 08 | Notificações | `notifications.cjs` | NotificationsPage, NotificationBell | notifications | [docs/notifications.md](docs/notifications.md) |
| 09 | Auditoria | `logs.cjs` | LogsPage | audit_logs | [docs/audit-logs.md](docs/audit-logs.md) |
| 10 | Configurações | `settings.cjs` | SettingsPage | settings | [docs/settings.md](docs/settings.md) |

### Performance

| # | Módulo | Rotas Backend | Páginas Frontend | Tabelas DB | Docs |
|---|--------|--------------|-----------------|-----------|------|
| 11 | Colaboradores | `colaboradores.cjs` | PerfilCMPListPage, PerfilCMPFormPage, PerfilCMPDetailPage, ImportProfilesPage | colaboradores | [docs/colaboradores.md](docs/colaboradores.md) |
| 12 | Ciclos | `ciclos.cjs` | CyclesListPage, CycleDetailPage, CycleFormPage | ciclos_avaliacao | [docs/ciclos.md](docs/ciclos.md) |
| 13 | Competências | `competencias.cjs` | (embebido) | competencias | [docs/competencias.md](docs/competencias.md) |
| 14 | Avaliações | `avaliacoes.cjs` | EvaluationFormPage | avaliacoes, avaliacao_competencias | [docs/avaliacoes.md](docs/avaliacoes.md) |
| 15 | Metas | `metas.cjs` | MetaFormPage | metas | [docs/metas.md](docs/metas.md) |
| 16 | PDI | `pdi.cjs` | PDIFormPage | pdi | [docs/pdi.md](docs/pdi.md) |
| 17 | Feedbacks | `feedbacks.cjs` | FeedbackFormPage | feedbacks | [docs/feedbacks.md](docs/feedbacks.md) |
| 18 | Histórico | `historico.cjs` | (embebido) | historico_colaborador | [docs/historico.md](docs/historico.md) |
| 19 | Dashboard Perf. | `dashboard-performance.cjs` | PerformanceRHPage, PerformanceGestorPage, PerformanceColaboradorPage | (agrega) | [docs/dashboard-performance.md](docs/dashboard-performance.md) |
| 20 | Exportação | `export.cjs` | (embebido) | (agrega) | [docs/export.md](docs/export.md) |
| 21 | Documentos | `documentos.cjs` | (embebido) | documentos | [docs/documentos.md](docs/documentos.md) |
| 22 | Cursos | `cursos.cjs` | (embebido) | cursos, colaborador_cursos | [docs/cursos.md](docs/cursos.md) |

## Documentação

| Documento | Descrição |
|-----------|-----------|
| [Arquitetura](docs/architecture.md) | Diagrama, camadas, fluxo |
| [Tech Stack](docs/stack.md) | Tecnologias e versões |
| [Banco de Dados](docs/database.md) | Schema completo |
| [API Completa](docs/api-complete.md) | ~80 endpoints |
| [Rotas Frontend](docs/frontend-pages.md) | ~37 páginas |
| [RBAC](docs/rbac.md) | Matriz de permissões |
| [Contributing](CONTRIBUTING.md) | Guia de contribuição |
| [Changelog](CHANGELOG.md) | Histórico de versões |

## RBAC

4 roles: `admin` > `gestor` > `assessor` > `operator`. Hierarquia com scoping por departamento. Matriz completa em [docs/rbac.md](docs/rbac.md).

## Fluxo de Visitante

```
Registrar → Agendar → Check-in → Em Visita → Finalizado
                          ↘ Cancelado
```

Detecção de email descartável: Invertexto API → CDN fallback (121k domínios) → fallback offline.

## MCPs e Plugins

Ver [`SETUP-MCP-PLUGINS.md`](./SETUP-MCP-PLUGINS.md).
