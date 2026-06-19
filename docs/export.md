# Módulo: Exportação

## Propósito

Exportação de dados em CSV com BOM UTF-8.

## Rotas Backend

| Método | Rota | Roles | Descrição |
|--------|------|-------|-----------|
| GET | `/api/export/colaboradores?search=&departamentoId=&cargo=&status=&gestorId=&vinculo=` | admin, gestor | CSV |
| GET | `/api/export/avaliacoes/:cicloId` | admin, gestor | CSV |

## Features

- BOM UTF-8 para acentos no Excel
- Escape de fórmulas (evita injeção)
- Headers em português

## Dependências

- Auth
- Colaboradores, Avaliações, Ciclos
