# Módulo: Timeline

## Propósito

Registro cronológico de eventos do visitante (check-in, check-out, criação, cancelamento, reagendamento).

## Rotas Backend

| Método | Rota | Roles | Descrição |
|--------|------|-------|-----------|
| GET | `/api/timeline/:visitorId` | todos | Listar eventos |
| POST | `/api/timeline` | todos | Criar evento |

## Frontend

Embutido em `VisitorDetailPage` (exibe timeline do visitante).

## Tabelas DB

`timeline_events` — id, visitorId (FK), type, description, author, timestamp

## Permissões

| Role | Acesso |
|------|--------|
| admin | Full |
| gestor | Full |
| assessor | Read |
| operator | Read |

## Dependências

- Visitantes (FK)
