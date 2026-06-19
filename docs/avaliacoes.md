# Módulo: Avaliações

## Propósito

Avaliações de desempenho por competências com cálculo de nota final e conceito.

## Rotas Backend

| Método | Rota | Roles | Descrição |
|--------|------|-------|-----------|
| GET | `/api/avaliacoes?colaboradorId=&cicloId=` | admin, gestor | Listar |
| GET | `/api/avaliacoes/:id` | admin, gestor | Detalhe com competências |
| POST | `/api/avaliacoes` | admin, gestor | Criar |
| PUT | `/api/avaliacoes/:id` | admin, gestor | Atualizar |
| PUT | `/api/avaliacoes/:id/finalizar` | admin, gestor | Finalizar (calcula média + conceito) |
| DELETE | `/api/avaliacoes/:id` | admin | Remover |

## Páginas Frontend

| Rota | Componente | Roles | Descrição |
|------|-----------|-------|-----------|
| `/performance/evaluations/new/:colaboradorId` | `EvaluationFormPage` | admin, gestor | Avaliar |

## Conceitos

| Nota | Conceito |
|------|----------|
| ≥ 4.5 | Excelente |
| ≥ 3.5 | Bom |
| ≥ 2.5 | Regular |
| ≥ 1.5 | Ruim |
| < 1.5 | Insatisfatório |

## Tabelas DB

`avaliacoes` — id, colaboradorId, cicloId, avaliadorId, tipo, notaFinal, conceitoFinal, status
`avaliacao_competencias` — id, avaliacaoId, competenciaId, nota (índice único composto)

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
- Competências (FK via `avaliacao_competencias`)
- Histórico (registro ao finalizar)
