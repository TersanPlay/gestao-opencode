# Módulo: Competências

## Propósito

Catálogo de competências avaliadas. Seed automático com 6 competências.

## Rotas Backend

| Método | Rota | Roles | Descrição |
|--------|------|-------|-----------|
| GET | `/api/competencias` | todos | Listar |

## Frontend

Embutido nos formulários de avaliação (`EvaluationFormPage`).

## Seed Data

| Competência | Descrição |
|-------------|-----------|
| Comunicação | Capacidade de se expressar com clareza |
| Trabalho em Equipe | Capacidade de colaborar em grupo |
| Produtividade | Entregar resultados no prazo |
| Qualidade das Entregas | Entregar com excelência |
| Comprometimento | Envolvimento e dedicação |
| Liderança | Capacidade de liderar |

## Tabelas DB

`competencias` — id, nome (UNIQUE), descricao

Índice único: `idx_competencias_nome`

## Permissões

| Role | Acesso |
|------|--------|
| admin | CRUD |
| demais | Read |

## Dependências

- Avaliações (FK via `avaliacao_competencias`)
