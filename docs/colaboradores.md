# Módulo: Colaboradores

## Propósito

Perfis de colaboradores (CMP) com importação CSV, histórico de admissão/desligamento.

## Rotas Backend

| Método | Rota | Roles | Descrição |
|--------|------|-------|-----------|
| GET | `/api/colaboradores?search=&departamentoId=&cargo=&status=&gestorId=&vinculo=&page=&pageSize=` | admin, gestor, assessor | Listar paginado |
| GET | `/api/colaboradores/:id` | todos | Detalhe com stats |
| POST | `/api/colaboradores` | admin, gestor | Criar |
| PUT | `/api/colaboradores/:id` | admin, gestor | Atualizar |
| DELETE | `/api/colaboradores/:id` | admin | Remover |
| POST | `/api/colaboradores/import` | admin, gestor | Importar CSV |

## Páginas Frontend

| Rota | Componente | Roles | Descrição |
|------|-----------|-------|-----------|
| `/performance/profiles` | `PerfilCMPListPage` | admin, gestor, assessor | Lista |
| `/performance/profiles/import` | `ImportProfilesPage` | admin, gestor | Importar CSV |
| `/performance/profiles/new` | `PerfilCMPFormPage` | admin, gestor | Criar |
| `/performance/profiles/:id` | `PerfilCMPDetailPage` | todos | Detalhe |
| `/performance/profiles/:id/edit` | `PerfilCMPFormPage` | admin, gestor | Editar |

## Tabelas DB

`colaboradores` — id, nome, email, cpf, matricula, cargo, departamentoId, funcao, cargaHoraria, vinculo, dataAdmissao, dataDesligamento, gestorId, userId, status

## Permissões

| Role | Acesso |
|------|--------|
| admin | Full CRUD |
| gestor | CRUD (scoped ao dept) |
| assessor | Read (scoped) |
| operator | Read own |

## Dependências

- Auth
- Departamentos (FK)
- Histórico (gera eventos)
- Documentos, Cursos (vinculados)
