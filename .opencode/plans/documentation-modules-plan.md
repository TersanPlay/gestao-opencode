# Plano: Documentação dos Módulos do Sistema

## Objetivo

Atualizar README.md com todos os 22 módulos e criar documentação modular em `docs/`.

## Arquivos a modificar/criar

### 1. `README.md` — ATUALIZAR

Substituir conteúdo desatualizado (só cobre 7 rotas, sem módulo de performance) por:

- **Header + Stack** (manter, atualizar tabela)
- **Início Rápido + Credenciais Admin** (manter)
- **Comandos** (manter)
- **Módulos do Sistema** — tabela mestra indexando todos os 22 módulos com links para `docs/`
- **RBAC** — resumo da matriz de permissões
- **Links para Documentação** — `docs/architecture.md`, `docs/database.md`, `docs/api-complete.md`, `docs/frontend-pages.md`, `docs/rbac.md`
- **MCPs e Plugins** (manter link)

Remover seções obsoletas: estrutura src/server antiga, rotas frontend antigas, API endpoints antigos (tudo coberto pelos docs modulares).

### 2. `docs/` — CRIAR (29 arquivos)

```
docs/
├── README.md                    # Índice da pasta docs
├── architecture.md              # Visão geral da arquitetura (frontend → proxy → backend → SQLite)
├── stack.md                     # Stack detalhada com versões
├── rbac.md                      # Matriz RBAC (substitui Arquitetura RBCA.txt vazio)
├── database.md                  # Schema completo (23 tabelas)
├── api-complete.md              # Referência completa de endpoints (~80 rotas)
├── frontend-pages.md            # Todas as rotas frontend (~35 páginas)
├── auth.md                      # Módulo 01: Autenticação
├── users.md                     # Módulo 02: Usuários
├── departments.md               # Módulo 03: Departamentos
├── visitors.md                  # Módulo 04: Visitantes
├── timeline.md                  # Módulo 05: Timeline
├── dashboard.md                 # Módulo 06: Dashboard
├── reports.md                   # Módulo 07: Relatórios
├── notifications.md             # Módulo 08: Notificações
├── audit-logs.md                # Módulo 09: Auditoria
├── settings.md                  # Módulo 10: Configurações
├── colaboradores.md             # Módulo 11: Colaboradores
├── ciclos.md                    # Módulo 12: Ciclos de Avaliação
├── competencias.md              # Módulo 13: Competências
├── avaliacoes.md                # Módulo 14: Avaliações
├── metas.md                     # Módulo 15: Metas
├── pdi.md                       # Módulo 16: PDI
├── feedbacks.md                 # Módulo 17: Feedbacks
├── historico.md                 # Módulo 18: Histórico
├── dashboard-performance.md     # Módulo 19: Dashboard Performance
├── export.md                    # Módulo 20: Exportação
├── documentos.md                # Módulo 21: Documentos
└── cursos.md                    # Módulo 22: Cursos
```

**Template de cada módulo**: Propósito → Rotas backend (tabela) → Páginas frontend (tabela) → Tabelas DB (colunas) → Permissões → Dependências

### 3. `CONTRIBUTING.md` — CRIAR

Setup, code style (TS strict, Tailwind v4 sem @apply, React funcional), commits semânticos, PR workflow.

### 4. `CHANGELOG.md` — CRIAR

v1.0.0 (módulos originais) + v1.1.0 (módulo de performance adicionado).

### 5. `Arquitetura RBCA.txt` — REMOVER (substituído por `docs/rbac.md`)

## Fontes de informação (arquivos a consultar)

| Informação | Arquivo |
|---|---|
| Rotas frontend + permissões | `src/app/router.tsx` |
| Rotas backend | `server/index.cjs` (linhas 22-51) |
| Schema DB | `server/db.cjs` (19 tabelas) |
| Matriz RBAC frontend | `src/lib/permissions.ts` |
| Matriz RBAC backend | `server/middleware/rbac.cjs` |
| Tipos TS | `src/types/index.ts` |
| API service | `src/services/api.ts` (55+ funções) |
| Rotas backend individuais | `server/routes/*.cjs` (22 arquivos) |
| Páginas frontend | `src/pages/**/*.tsx` (35 páginas) |

## Ordem de implementação

1. `docs/rbac.md` — substitui o arquivo vazio, mais simples
2. `CONTRIBUTING.md` + `CHANGELOG.md` — baixo esforço
3. `docs/architecture.md` + `docs/stack.md` + `docs/database.md` — visão geral
4. `docs/api-complete.md` + `docs/frontend-pages.md` — referências completas
5. Módulos 01-10 (auth até settings) — ~1-2 min cada
6. Módulos 11-22 (colaboradores até cursos) — ~1-2 min cada
7. `docs/README.md` — índice da pasta
8. `README.md` — atualização final com tabela mestra
9. Remover `Arquitetura RBCA.txt`

## Verificação

- `npm run dev` — garantir que o servidor inicia sem erros
- Verificar que todos os links nos .md são relativos e válidos
- Confirmar que `docs/rbac.md` cobre todos os módulos e roles
- Confirmar que README.md lista todos os 22 módulos
