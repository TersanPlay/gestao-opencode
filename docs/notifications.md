# Módulo: Notificações

## Propósito

Notificações por usuário com suporte a email opcional (SMTP).

## Rotas Backend

| Método | Rota | Roles | Descrição |
|--------|------|-------|-----------|
| GET | `/api/notifications?unreadOnly=` | todos | Listar |
| GET | `/api/notifications/unread-count` | todos | Contagem |
| PUT | `/api/notifications/:id/read` | todos | Marcar lida |
| POST | `/api/notifications/read-all` | todos | Marcar todas lidas |

## Páginas Frontend

| Rota | Componente | Descrição |
|------|-----------|-----------|
| `/notifications` | `NotificationsPage` | Central de notificações |
| — | `NotificationBell` | Sino na TopBar (contagem não lidas) |

## Tipos de Notificação

- `visitor_created` — visitante registrado
- `visitor_checkin` — visitante fez check-in
- `visitor_scheduled` — visitante agendado
- `user_created` — novo usuário criado

## Funções Helper (server)

- `notifyUser(userId, title, message, type, link)`
- `notifyDepartmentUsers(departmentId, title, message, type, link)`
- `notifyAdmins(title, message, type, link)`

## Tabelas DB

`notifications` — id, userId (FK), type, title, message, link, read, createdAt

## Dependências

- Auth
- Email service (`server/services/email.cjs`) — nodemailer, configuração SMTP do banco
