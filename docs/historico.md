# Módulo: Histórico do Colaborador

## Propósito

Linha do tempo com eventos da vida funcional do colaborador.

## Rotas Backend

| Método | Rota | Roles | Descrição |
|--------|------|-------|-----------|
| GET | `/api/historico/:colaboradorId` | admin, gestor | Listar |

## Frontend

Embutido em `PerfilCMPDetailPage`.

## Tipos de Evento

`admissao`, `cargo`, `lotacao`, `avaliacao`, `feedback`, `meta`, `pdi`, `promocao`, `desligamento`

## Tabelas DB

`historico_colaborador` — id, colaboradorId (FK), tipo, descricao, dataReferencia, createdAt

## Permissões

| Role | Acesso |
|------|--------|
| admin | Read |
| gestor | Read (scoped) |
| assessor | Read (scoped) |
| operator | Read own |

## Dependências

- Colaboradores (FK)
- Gerado automaticamente por: Avaliações, Metas, PDI, Feedbacks, Colaboradores (admissão/desligamento)
