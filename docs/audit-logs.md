# Módulo: Auditoria

## Propósito

Registro automático de todas as mutações (POST/PUT/DELETE) para trilha de auditoria.

## Rotas Backend

| Método | Rota | Roles | Descrição |
|--------|------|-------|-----------|
| GET | `/api/logs?action=&resource=&userId=&start=&end=&limit=` | admin, gestor | Listar |
| GET | `/api/logs/users` | admin, gestor | Usuários para filtro |

## Páginas Frontend

| Rota | Componente | Roles | Descrição |
|------|-----------|-------|-----------|
| `/logs` | `LogsPage` | admin, gestor | Visualização de logs |

## Middleware

`server/middleware/audit.cjs` — log automático, ignora:
- `/api/auth/*`, `/api/dashboard`, `/api/notifications/*`, `/api/health`

## Tabelas DB

`audit_logs` — id, userId, userName, userRole, action, resource, resourceId, details, ip, createdAt

## Permissões

| Role | Acesso |
|------|--------|
| admin | Full |
| gestor | Read (scoped ao departamento) |
| assessor, operator | — |

## Dependências

- Auth
