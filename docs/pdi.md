# Módulo: PDI — Plano de Desenvolvimento Individual

## Propósito

Planos de desenvolvimento com ações previstas, evidências e observações.

## Rotas Backend

| Método | Rota | Roles | Descrição |
|--------|------|-------|-----------|
| GET | `/api/pdi?colaboradorId=&cicloId=` | admin, gestor | Listar |
| GET | `/api/pdi/:id` | admin, gestor | Detalhe |
| POST | `/api/pdi` | admin, gestor | Criar |
| PUT | `/api/pdi/:id` | admin, gestor | Atualizar |
| DELETE | `/api/pdi/:id` | admin | Remover |

## Páginas Frontend

| Rota | Componente | Roles | Descrição |
|------|-----------|-------|-----------|
| `/performance/pdi/new/:colaboradorId` | `PDIFormPage` | admin, gestor | Criar |
| `/performance/pdi/:id/edit` | `PDIFormPage` | admin, gestor | Editar |

## Tabelas DB

`pdi` — id, colaboradorId, cicloId, objetivo, acoesPrevistas, prazo, responsavelId, status (pending/in_progress/completed), evidencias, observacoes

## Permissões

| Role | Acesso |
|------|--------|
| admin | CRUD |
| gestor | CRUD (scoped) |
| assessor | Read |
| operator | Read own |

## Dependências

- Auth
- Colaboradores (FK)
- Ciclos (FK)
- Histórico (registro ao criar/concluir)
