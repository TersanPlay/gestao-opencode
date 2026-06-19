# Módulo: Dashboard

## Propósito

Métricas agregadas do sistema para a página inicial do app.

## Rotas Backend

| Método | Rota | Roles | Descrição |
|--------|------|-------|-----------|
| GET | `/api/dashboard` | todos | Métricas (scoped por dept) |

## Métricas

- Total de usuários
- Usuários ativos
- Total de departamentos
- Visitantes hoje
- Visitantes em andamento
- Visitantes finalizados

## Páginas Frontend

| Rota | Componente | Descrição |
|------|-----------|-----------|
| `/dashboard` | `DashboardPage` | Dashboard principal |

## Permissões

| Role | Acesso |
|------|--------|
| admin | Full (todos os depts) |
| gestor | Full (scoped) |
| assessor | Read (scoped) |
| operator | Read (scoped) |

## Dependências

- Auth
- Users (contagem)
- Departments (contagem)
- Visitors (métricas de visita)
