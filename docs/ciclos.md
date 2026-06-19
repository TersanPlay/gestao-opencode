# Módulo: Ciclos de Avaliação

## Propósito

Períodos de avaliação de desempenho (abertos/fechados) com progresso.

## Rotas Backend

| Método | Rota | Roles | Descrição |
|--------|------|-------|-----------|
| GET | `/api/ciclos` | admin, gestor | Listar |
| GET | `/api/ciclos/:id` | admin, gestor | Detalhe |
| POST | `/api/ciclos` | admin | Criar |
| PUT | `/api/ciclos/:id` | admin | Atualizar |
| GET | `/api/ciclos/:id/progress` | admin, gestor | Progresso (total/realizadas/pendentes/percentual) |

## Páginas Frontend

| Rota | Componente | Roles | Descrição |
|------|-----------|-------|-----------|
| `/performance/cycles` | `CyclesListPage` | admin, gestor | Lista |
| `/performance/cycles/:id` | `CycleDetailPage` | admin, gestor | Detalhe + progresso |
| `/performance/cycles/new` | `CycleFormPage` | admin | Criar |
| `/performance/cycles/:id/edit` | `CycleFormPage` | admin | Editar |

## Tabelas DB

`ciclos_avaliacao` — id, nome, dataInicio, dataFim, status (aberto/fechado)

## Permissões

| Role | Acesso |
|------|--------|
| admin | CRUD |
| gestor | Read |
| assessor, operator | — |

## Dependências

- Auth
- Avaliações (FK)
