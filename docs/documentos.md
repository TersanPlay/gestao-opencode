# Módulo: Documentos

## Propósito

Upload e download de documentos por colaborador.

## Rotas Backend

| Método | Rota | Roles | Descrição |
|--------|------|-------|-----------|
| GET | `/api/documentos/:colaboradorId` | admin, gestor | Listar |
| POST | `/api/documentos` | admin, gestor | Upload (multipart) |
| GET | `/api/documentos/:id/download` | admin, gestor | Download |
| DELETE | `/api/documentos/:id` | admin | Remover |

## Frontend

Embutido em `PerfilCMPDetailPage`.

## Tipos Permitidos

PDF, DOC, DOCX, XLS, XLSX, PNG, JPG, GIF (valida MIME type)

## Limites

Tamanho máximo: 20MB. Upload para `server/uploads/documentos/`.

## Tabelas DB

`documentos` — id, colaboradorId, nome, tipo, arquivo, mimeType, tamanho, createdAt

## Permissões

| Role | Acesso |
|------|--------|
| admin | CRUD |
| gestor | CRUD (scoped) |
| assessor | Read (scoped) |
| operator | — |

## Dependências

- Auth
- Colaboradores (FK)
- multer (upload)
