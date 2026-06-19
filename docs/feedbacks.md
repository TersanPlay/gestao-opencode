# Módulo: Feedbacks

## Propósito

Feedback 360° entre colaboradores com tipos (autoavaliação, gestor, colega, liderado).

## Rotas Backend

| Método | Rota | Roles | Descrição |
|--------|------|-------|-----------|
| GET | `/api/feedbacks?colaboradorId=` | todos | Listar (próprios + equipe) |
| POST | `/api/feedbacks` | todos | Criar |

## Páginas Frontend

| Rota | Componente | Roles | Descrição |
|------|-----------|-------|-----------|
| `/performance/feedbacks/new/:colaboradorId` | `FeedbackFormPage` | todos | Dar feedback |

## Tabelas DB

`feedbacks` — id, colaboradorId, autorId, tipo, comentario, status, createdAt

## Permissões

| Role | Acesso |
|------|--------|
| admin | CRUD |
| gestor | CRUD |
| assessor | CRUD |
| operator | CRUD |

## Dependências

- Auth
- Colaboradores (FK)
- Histórico (registro ao criar)
