# Módulo: Cursos

## Propósito

Catálogo de cursos com vínculo N:N com colaboradores. CRUD completo do catálogo + matrícula de colaboradores.

## Rotas Backend

| Método | Rota | Roles | Descrição |
|--------|------|-------|-----------|
| GET | `/api/cursos` | todos | Listar catálogo |
| GET | `/api/cursos/:id` | todos | Detalhe |
| POST | `/api/cursos` | admin, gestor | Criar |
| PUT | `/api/cursos/:id` | admin | Atualizar |
| DELETE | `/api/cursos/:id` | admin | Remover (com verificação de vínculos) |
| GET | `/api/cursos/colaborador/:colaboradorId` | admin, gestor | Cursos do colaborador |
| POST | `/api/cursos/vincular` | admin, gestor | Vincular colaborador |
| PUT | `/api/cursos/vincular/:id` | admin, gestor | Atualizar vínculo (status, datas) |
| DELETE | `/api/cursos/vincular/:id` | admin | Remover vínculo |

## Páginas Frontend

| Rota | Componente | Roles | Descrição |
|------|-----------|-------|-----------|
| `/performance/cursos` | `CursosPage` | admin, gestor, assessor | CRUD standalone do catálogo |

### CursosPage

Página independente em `src/pages/performance/CursosPage.tsx` com:

- **Tabela** listando todos os cursos (nome, descrição, carga horária, ações)
- **Botão "Novo Curso"** → abre Dialog com formulário (nome, descrição, cargaHorária)
- **Editar** → Dialog preenchido com dados do curso
- **Excluir** → Dialog de confirmação
- Roles: admin/gestor podem criar, editar, excluir; assessor apenas visualiza

### Embutido em PerfilCMPDetailPage

Uma aba "Cursos" exibe os cursos vinculados ao colaborador com:
- Tabela: curso, carga horária, início, término, status
- Funcionalidade de vincular/desvincular cursos

## Status de Vínculo

`pendente`, `em_andamento`, `concluído`

## Tabelas DB

### `cursos`
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | INTEGER PK | Auto-increment |
| nome | TEXT | Nome do curso |
| descricao | TEXT | Descrição |
| cargaHoraria | INTEGER | Carga horária em horas |
| createdAt | TEXT | ISO datetime |

### `colaborador_cursos`
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | INTEGER PK | Auto-increment |
| colaboradorId | INTEGER FK → colaboradores | Colaborador |
| cursoId | INTEGER FK → cursos | Curso |
| dataInicio | TEXT | Data início |
| dataFim | TEXT | Data conclusão |
| status | TEXT | pendente, em_andamento, concluído |
| certificado | TEXT | Certificado |
| createdAt | TEXT | ISO datetime |

## Funções API (`src/services/api.ts`)

| Função | Descrição |
|--------|-----------|
| `getCursos()` | Listar catálogo |
| `getCursoById(id)` | Detalhe do curso |
| `createCurso(data)` | Criar curso |
| `updateCurso(id, data)` | Atualizar curso |
| `deleteCurso(id)` | Remover curso |
| `getCursosColaborador(colaboradorId)` | Cursos de um colaborador |
| `vincularCurso(data)` | Vincular colaborador a curso |
| `updateVinculoCurso(id, data)` | Atualizar vínculo |
| `deleteVinculoCurso(id)` | Remover vínculo |

## Permissões

| Role | Catálogo | Vínculos |
|------|----------|----------|
| admin | CRUD | CRUD |
| gestor | CRUD | CRUD (scoped) |
| assessor | Read | — |
| operator | Read | — |

## Dependências

- Auth
- Colaboradores (FK)
- Sidebar: entrada em `src/components/layout/Sidebar.tsx` com ícone `BookOpen`
