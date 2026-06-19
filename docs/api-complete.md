# Referência Completa de API

Base URL: `http://localhost:3001/api`

Autenticação: `Authorization: Bearer <token>`

## Autenticação

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| POST | `/api/auth/login` | — | Login (email + senha → JWT) |
| GET | `/api/auth/me` | JWT | Dados do usuário logado |
| PUT | `/api/auth/profile` | JWT | Atualizar perfil |

## Usuários

| Método | Rota | Roles | Descrição |
|--------|------|-------|-----------|
| GET | `/api/users` | admin, gestor | Listar (gestor vê só do dept) |
| GET | `/api/users/:id` | admin, gestor | Detalhe |
| POST | `/api/users` | admin, gestor | Criar |
| PUT | `/api/users/:id` | admin, gestor | Atualizar |
| DELETE | `/api/users/:id` | admin | Remover |

## Departamentos

| Método | Rota | Roles | Descrição |
|--------|------|-------|-----------|
| GET | `/api/departments` | admin, gestor, operator | Listar (árvore) |
| GET | `/api/departments/:id` | admin, gestor, operator | Detalhe |
| POST | `/api/departments` | admin, operator | Criar |
| PUT | `/api/departments/:id` | admin, operator | Atualizar |
| DELETE | `/api/departments/:id` | admin, operator | Remover |

## Visitantes

| Método | Rota | Roles | Descrição |
|--------|------|-------|-----------|
| GET | `/api/visitors?status=` | todos | Listar com filtro |
| GET | `/api/visitors/check-email?email=` | todos | Verificar email descartável |
| GET | `/api/visitors/:id` | todos | Detalhe |
| POST | `/api/visitors` | todos | Criar |
| PUT | `/api/visitors/:id` | admin, gestor | Atualizar |
| DELETE | `/api/visitors/:id` | admin | Remover |

## Timeline

| Método | Rota | Roles | Descrição |
|--------|------|-------|-----------|
| GET | `/api/timeline/:visitorId` | todos | Listar eventos |
| POST | `/api/timeline` | todos | Criar evento |

## Dashboard

| Método | Rota | Roles | Descrição |
|--------|------|-------|-----------|
| GET | `/api/dashboard` | todos | Métricas agregadas |

## Relatórios

| Método | Rota | Roles | Descrição |
|--------|------|-------|-----------|
| GET | `/api/reports/visitors?start=&end=&departmentId=&status=` | admin, gestor, assessor | Relatório de visitantes |
| GET | `/api/reports/departments` | admin, gestor, assessor | Relatório por departamento |
| GET | `/api/reports/users` | admin, gestor | Relatório de usuários |

## Notificações

| Método | Rota | Roles | Descrição |
|--------|------|-------|-----------|
| GET | `/api/notifications?unreadOnly=` | todos | Listar |
| GET | `/api/notifications/unread-count` | todos | Contagem não lidas |
| PUT | `/api/notifications/:id/read` | todos | Marcar lida |
| POST | `/api/notifications/read-all` | todos | Marcar todas lidas |

## Auditoria

| Método | Rota | Roles | Descrição |
|--------|------|-------|-----------|
| GET | `/api/logs?action=&resource=&userId=&start=&end=&limit=` | admin, gestor | Listar logs |
| GET | `/api/logs/users` | admin, gestor | Lista de usuários para filtro |

## Configurações

| Método | Rota | Roles | Descrição |
|--------|------|-------|-----------|
| GET | `/api/settings` | admin | Listar (oculta smtp_pass) |
| PUT | `/api/settings` | admin | Atualizar |

## Saúde

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| GET | `/api/health` | — | Health check |

---

## Performance — Colaboradores

| Método | Rota | Roles | Descrição |
|--------|------|-------|-----------|
| GET | `/api/colaboradores?search=&departamentoId=&cargo=&status=&gestorId=&vinculo=&page=&pageSize=` | admin, gestor, assessor | Listar paginado |
| GET | `/api/colaboradores/:id` | todos | Detalhe com stats |
| POST | `/api/colaboradores` | admin, gestor | Criar |
| PUT | `/api/colaboradores/:id` | admin, gestor | Atualizar |
| DELETE | `/api/colaboradores/:id` | admin | Remover |
| POST | `/api/colaboradores/import` | admin, gestor | Importar CSV |

## Performance — Ciclos

| Método | Rota | Roles | Descrição |
|--------|------|-------|-----------|
| GET | `/api/ciclos` | admin, gestor | Listar |
| GET | `/api/ciclos/:id` | admin, gestor | Detalhe |
| POST | `/api/ciclos` | admin | Criar |
| PUT | `/api/ciclos/:id` | admin | Atualizar |
| GET | `/api/ciclos/:id/progress` | admin, gestor | Progresso do ciclo |

## Performance — Competências

| Método | Rota | Roles | Descrição |
|--------|------|-------|-----------|
| GET | `/api/competencias` | todos | Listar |

## Performance — Avaliações

| Método | Rota | Roles | Descrição |
|--------|------|-------|-----------|
| GET | `/api/avaliacoes?colaboradorId=&cicloId=` | admin, gestor | Listar |
| GET | `/api/avaliacoes/:id` | admin, gestor | Detalhe |
| POST | `/api/avaliacoes` | admin, gestor | Criar |
| PUT | `/api/avaliacoes/:id` | admin, gestor | Atualizar |
| PUT | `/api/avaliacoes/:id/finalizar` | admin, gestor | Finalizar (calcula nota) |
| DELETE | `/api/avaliacoes/:id` | admin | Remover |

## Performance — Metas

| Método | Rota | Roles | Descrição |
|--------|------|-------|-----------|
| GET | `/api/metas?colaboradorId=&cicloId=` | admin, gestor | Listar |
| GET | `/api/metas/:id` | admin, gestor | Detalhe |
| POST | `/api/metas` | admin, gestor | Criar |
| PUT | `/api/metas/:id` | admin, gestor | Atualizar |
| DELETE | `/api/metas/:id` | admin | Remover |

## Performance — PDI

| Método | Rota | Roles | Descrição |
|--------|------|-------|-----------|
| GET | `/api/pdi?colaboradorId=&cicloId=` | admin, gestor | Listar |
| GET | `/api/pdi/:id` | admin, gestor | Detalhe |
| POST | `/api/pdi` | admin, gestor | Criar |
| PUT | `/api/pdi/:id` | admin, gestor | Atualizar |
| DELETE | `/api/pdi/:id` | admin | Remover |

## Performance — Feedbacks

| Método | Rota | Roles | Descrição |
|--------|------|-------|-----------|
| GET | `/api/feedbacks?colaboradorId=` | todos | Listar |
| POST | `/api/feedbacks` | todos | Criar |

## Performance — Histórico

| Método | Rota | Roles | Descrição |
|--------|------|-------|-----------|
| GET | `/api/historico/:colaboradorId` | admin, gestor | Listar histórico |

## Performance — Dashboard

| Método | Rota | Roles | Descrição |
|--------|------|-------|-----------|
| GET | `/api/dashboard-performance/rh` | admin | Dashboard RH |
| GET | `/api/dashboard-performance/gestor` | gestor | Dashboard gestor |
| GET | `/api/dashboard-performance/colaborador?userId=` | todos | Dashboard colaborador |

## Performance — Exportação

| Método | Rota | Roles | Descrição |
|--------|------|-------|-----------|
| GET | `/api/export/colaboradores?search=&departamentoId=&cargo=&status=&gestorId=&vinculo=` | admin, gestor | Exportar CSV |
| GET | `/api/export/avaliacoes/:cicloId` | admin, gestor | Exportar CSV |

## Performance — Documentos

| Método | Rota | Roles | Descrição |
|--------|------|-------|-----------|
| GET | `/api/documentos/:colaboradorId` | admin, gestor | Listar |
| POST | `/api/documentos` | admin, gestor | Upload (multipart) |
| GET | `/api/documentos/:id/download` | admin, gestor | Download |
| DELETE | `/api/documentos/:id` | admin | Remover |

## Performance — Cursos

| Método | Rota | Roles | Descrição |
|--------|------|-------|-----------|
| GET | `/api/cursos` | todos | Listar catálogo |
| GET | `/api/cursos/:id` | todos | Detalhe |
| POST | `/api/cursos` | admin, gestor | Criar |
| PUT | `/api/cursos/:id` | admin | Atualizar |
| DELETE | `/api/cursos/:id` | admin | Remover |
| GET | `/api/cursos/colaborador/:colaboradorId` | admin, gestor | Cursos do colaborador |
| POST | `/api/cursos/vincular` | admin, gestor | Vincular curso |
| PUT | `/api/cursos/vincular/:id` | admin, gestor | Atualizar vínculo |
| DELETE | `/api/cursos/vincular/:id` | admin | Remover vínculo |

> Total: ~80 endpoints
