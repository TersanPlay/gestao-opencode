# Módulo: Metas

## Propósito

Gerenciamento de metas com percentual de conclusão, prazo e resultado.

## Rotas Backend

| Método | Rota | Roles | Descrição |
|--------|------|-------|-----------|
| GET | `/api/metas?colaboradorId=&cicloId=` | admin, gestor | Listar |
| GET | `/api/metas/:id` | admin, gestor | Detalhe |
| POST | `/api/metas` | admin, gestor | Criar |
| PUT | `/api/metas/:id` | admin, gestor | Atualizar |
| DELETE | `/api/metas/:id` | admin | Remover |

## Páginas Frontend

| Rota | Componente | Roles | Descrição |
|------|-----------|-------|-----------|
| `/performance/metas/new/:colaboradorId` | `MetaFormPage` | admin, gestor | Criar |
| `/performance/metas/:id/edit` | `MetaFormPage` | admin, gestor | Editar |

## Tabelas DB

`metas` — id, colaboradorId, cicloId, nome, descricao, metaEsperada, resultadoObtido, percentualConclusao, prazo, status (pending/in_progress/completed), responsavelId

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
